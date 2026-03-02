import { useState, useEffect } from 'react'
import Navbar from '../layout/Navbar'
import { productService } from '../services/productService'
import { LoadingSpinner, ErrorMessage, EmptyState } from '../components/UI'
import { getApiError } from '../utils/helpers'
import { FolderTree, Package } from 'lucide-react'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedCat, setExpandedCat] = useState(null)
  const [catProducts, setCatProducts] = useState([])
  const [catLoading, setCatLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [cats, prods] = await Promise.all([
        productService.getCategories(),
        productService.getAll(),
      ])
      setCategories(cats)
      setProducts(prods)
    } catch (err) {
      setError(getApiError(err, 'Error al cargar categorias'))
    } finally {
      setLoading(false)
    }
  }

  async function toggleCategory(catId) {
    if (expandedCat === catId) {
      setExpandedCat(null)
      setCatProducts([])
      return
    }
    setExpandedCat(catId)
    setCatLoading(true)
    try {
      const data = await productService.getByCategory(catId)
      setCatProducts(data)
    } catch {
      setCatProducts([])
    } finally {
      setCatLoading(false)
    }
  }

  if (loading) return <><Navbar title="Categorias" /><LoadingSpinner /></>
  if (error) return <><Navbar title="Categorias" /><ErrorMessage message={error} onRetry={fetchData} /></>

  return (
    <>
      <Navbar title="Categorias" />
      <div className="p-6 animate-fade-in">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Categorias</h2>
          <p className="text-sm text-gray-500 mt-1">{categories.length} categorias registradas</p>
        </div>

        {categories.length === 0 ? (
          <EmptyState
            icon={FolderTree}
            title="No hay categorias"
            description="Las categorias apareceran cuando se agreguen desde el backend"
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {categories.map((cat) => {
              const count = products.filter(p => p.categoryId === cat.id).length
              const isExpanded = expandedCat === cat.id
              return (
                <div
                  key={cat.id}
                  className="rounded-xl border border-gray-200 bg-white overflow-hidden transition-shadow hover:shadow-md"
                >
                  <button
                    onClick={() => toggleCategory(cat.id)}
                    className="flex w-full items-center gap-4 px-5 py-5 text-left"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                      <FolderTree size={22} className="text-brand-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900">{cat.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {cat.description || 'Sin descripcion'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
                        {count} productos
                      </span>
                      <span className="text-xs text-gray-400">ID: {cat.id}</span>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50/50 animate-slide-in">
                      {catLoading ? (
                        <div className="flex items-center justify-center py-6">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
                        </div>
                      ) : catProducts.length === 0 ? (
                        <p className="py-6 text-center text-sm text-gray-500">No hay productos en esta categoria</p>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {catProducts.map((product) => (
                            <div key={product.id} className="flex items-center gap-3 px-5 py-3">
                              <Package size={16} className="shrink-0 text-gray-400" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 truncate">{product.name}</p>
                              </div>
                              <span className="text-sm font-medium text-gray-700">
                                S/ {parseFloat(product.price).toFixed(2)}
                              </span>
                              <span className="text-xs text-gray-500">
                                Stock: {product.stock}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
