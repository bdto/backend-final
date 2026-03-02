import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../layout/Navbar'
import { productService } from '../services/productService'
import { LoadingSpinner, ErrorMessage, Badge } from '../components/UI'
import { formatCurrency, getApiError } from '../utils/helpers'
import { ArrowLeft, Box, Tag, Layers, Hash } from 'lucide-react'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [prod, cats] = await Promise.all([
          productService.getById(id),
          productService.getCategories(),
        ])
        setProduct(prod)
        setCategories(cats)
      } catch (err) {
        setError(getApiError(err, 'Error al cargar producto'))
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) return <><Navbar title="Detalle Producto" /><LoadingSpinner /></>
  if (error) return <><Navbar title="Detalle Producto" /><ErrorMessage message={error} /></>
  if (!product) return null

  const categoryName = categories.find(c => c.id === product.categoryId)?.name || 'Sin categoria'

  return (
    <>
      <Navbar title="Detalle del Producto" />
      <div className="p-6 animate-fade-in">
        <button
          onClick={() => navigate('/products')}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver a Productos
        </button>

        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                <Box size={24} className="text-gray-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
                <p className="text-sm text-gray-500 mt-0.5">ID: #{product.id}</p>
              </div>
              <div className="ml-auto">
                <Badge className={product.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-500 border-gray-200'}>
                  {product.active ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2.5">
                <Tag size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Precio</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-50 p-2.5">
                <Layers size={18} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Stock</p>
                <p className="text-lg font-bold text-gray-900">{product.stock} unidades</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-violet-50 p-2.5">
                <Hash size={18} className="text-violet-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Categoria</p>
                <p className="text-sm font-semibold text-gray-900">{categoryName}</p>
              </div>
            </div>
          </div>

          {product.description && (
            <div className="border-t border-gray-100 px-6 py-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Descripcion</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          {product.imageUrl && (
            <div className="border-t border-gray-100 px-6 py-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Imagen</h3>
              <img
                src={product.imageUrl}
                alt={product.name}
                crossOrigin="anonymous"
                className="max-w-sm rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
