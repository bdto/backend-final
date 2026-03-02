import { useState, useEffect, useMemo } from 'react';
import { productService } from '../services/productService';
import { useAuth } from '../hooks/useAuth';
import { addNotification } from '../hooks/useNotifications';
import { Plus, X, Package } from 'lucide-react';
import DataTable from '../components/DataTable';
import Loader from '../components/Loader';

function CreateProductModal({ categories, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    categoryId: '',
    price: '',
    stock: '',
    imageUrl: '',
    active: true,
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.categoryId || !form.price) {
      addNotification({ message: 'Completa los campos requeridos', type: 'error' });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        categoryId: Number(form.categoryId),
        price: Number(form.price),
        stock: Number(form.stock) || 0,
        imageUrl: form.imageUrl,
        active: form.active,
      };
      await productService.create(payload);
      addNotification({ message: 'Producto creado exitosamente', type: 'success' });
      onCreated();
      onClose();
    } catch (err) {
      addNotification({
        message: err.response?.data?.message || 'Error al crear producto',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" role="dialog" aria-modal="true">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Nuevo producto</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Cerrar">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-slate-700">Nombre *</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="Nombre del producto" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium text-slate-700">Descripcion</label>
            <textarea id="description" name="description" value={form.description} onChange={handleChange} className="input-field resize-none" rows={3} placeholder="Descripcion del producto" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="categoryId" className="text-sm font-medium text-slate-700">Categoria *</label>
              <select id="categoryId" name="categoryId" value={form.categoryId} onChange={handleChange} className="input-field">
                <option value="">Seleccionar</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="price" className="text-sm font-medium text-slate-700">Precio *</label>
              <input id="price" name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} className="input-field" placeholder="0.00" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="stock" className="text-sm font-medium text-slate-700">Stock</label>
              <input id="stock" name="stock" type="number" min="0" value={form.stock} onChange={handleChange} className="input-field" placeholder="0" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="imageUrl" className="text-sm font-medium text-slate-700">URL de imagen</label>
              <input id="imageUrl" name="imageUrl" value={form.imageUrl} onChange={handleChange} className="input-field" placeholder="https://..." />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="active" checked={form.active} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
            <span className="text-sm text-slate-700">Producto activo</span>
          </label>

          <div className="flex items-center gap-3 mt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
            <button type="submit" className="btn-primary flex-1" disabled={saving}>
              {saving ? 'Guardando...' : 'Crear producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),
        productService.getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch {
      addNotification({ message: 'Error al cargar productos', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const term = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term)
    );
  }, [products, search]);

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.name || '-';
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (item) => <span className="font-medium text-slate-900">#{item.id}</span>,
    },
    {
      key: 'name',
      label: 'Producto',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
            <Package className="h-4 w-4 text-brand-600" />
          </div>
          <div>
            <p className="font-medium text-slate-900">{item.name}</p>
            <p className="text-xs text-slate-500 truncate max-w-[200px]">{item.description}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'categoryId',
      label: 'Categoria',
      render: (item) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
          {getCategoryName(item.categoryId)}
        </span>
      ),
    },
    {
      key: 'price',
      label: 'Precio',
      render: (item) => <span className="font-semibold text-slate-900">${Number(item.price).toFixed(2)}</span>,
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (item) => (
        <span className={`font-medium ${item.stock > 10 ? 'text-emerald-600' : item.stock > 0 ? 'text-amber-600' : 'text-red-600'}`}>
          {item.stock}
        </span>
      ),
    },
    {
      key: 'active',
      label: 'Estado',
      render: (item) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            item.active
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-slate-50 text-slate-500 border-slate-200'
          }`}
        >
          {item.active ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Productos</h1>
          <p className="text-slate-500 mt-1">Gestiona el catalogo de productos</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nuevo producto
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={filteredProducts}
        loading={loading}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar productos..."
        emptyMessage="No se encontraron productos"
      />

      {showModal && (
        <CreateProductModal
          categories={categories}
          onClose={() => setShowModal(false)}
          onCreated={fetchData}
        />
      )}
    </div>
  );
}
