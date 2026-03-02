import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../layout/Navbar'
import { productService } from '../services/productService'
import { LoadingSpinner, ErrorMessage, EmptyState, Badge } from '../components/UI'
import { formatCurrency, getApiError } from '../utils/helpers'
import { useAuth } from '../context/AuthContext'
import {
  Package,
  Plus,
  Search,
  Box,
  Filter,
} from 'lucide-react'

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showForm, setShowForm] = useState(false)
  const navigate = useNavigate()
  const { isAdmin } = useAuth()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const [prods, cats] = await Promise.all([
        productService.getAll(),
        productService.getCategories(),
      ])
      setProducts(prods)
      setCategories(cats)
    } catch (err) {
      setError(getApiError(err, 'Error al cargar productos'))
    } finally {
      setLoading(false)
    }
  }

  async function handleSearch() {
    if (!searchTerm.trim()) {
      fetchData()
      return
    }
    setLoading(true)
    try {
      const results = await productService.search(searchTerm)
      setProducts(results)
    } catch (err) {
      setError(getApiError(err, 'Error en la busqueda'))
    } finally {
      setLoading(false)
    }
  }

  async function filterByCategory(catId) {
    setSelectedCategory(catId)
    if (!catId) {
      fetchData()
      return
    }
    setLoading(true)
    try {
      const results = await productService.getByCategory(catId)
      setProducts(results)
    } catch (err) {
      setError(getApiError(err, 'Error al filtrar'))
    } finally {
      setLoading(false)
    }
  }

  const getCategoryName = (catId) => {
    const cat = categories.find(c => c.id === catId)
    return cat?.name || 'Sin categoria'
  }

  return (
    <>
      <Navbar title="Productos" />
      <div className="p-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Catalogo de Productos</h2>
            <p className="text-sm text-gray-500 mt-1">{products.length} productos encontrados</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 rounded-lg bg-brand-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-800 transition-colors"
            >
              <Plus size={16} />
              Nuevo Producto
            </button>
          )}
        </div>

        {/* Create Form */}
        {showForm && (
          <ProductForm
            categories={categories}
            onSuccess={() => { setShowForm(false); fetchData() }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
            />
          </div>
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => filterByCategory(e.target.value)}
              className="appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
            >
              <option value="">Todas las categorias</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSearch}
            className="rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Buscar
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchData} />
        ) : products.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No hay productos"
            description="Comienza agregando tu primer producto"
          />
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Producto</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Categoria</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Precio</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Stock</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                            <Box size={18} className="text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-500 line-clamp-1">{product.description || 'Sin descripcion'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Badge className="bg-gray-50 text-gray-700 border-gray-200">
                          {getCategoryName(product.categoryId)}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-sm font-medium ${product.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <Badge className={product.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-500 border-gray-200'}>
                          {product.active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function ProductForm({ categories, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    categoryId: '',
    price: '',
    stock: '',
    imageUrl: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await productService.create({
        ...form,
        categoryId: parseInt(form.categoryId),
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        active: true,
      })
      onSuccess()
    } catch (err) {
      setError(getApiError(err, 'Error al crear producto'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 animate-scale-in">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Nuevo Producto</h3>
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Nombre</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Categoria</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="">Seleccionar...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Precio</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Stock</label>
          <input
            name="stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Descripcion</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1.5">URL de Imagen</label>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div className="flex gap-3 sm:col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-brand-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-800 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Creando...' : 'Crear Producto'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
