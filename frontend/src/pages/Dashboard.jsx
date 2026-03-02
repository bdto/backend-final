import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../layout/Navbar'
import { productService } from '../services/productService'
import { LoadingSpinner, ErrorMessage } from '../components/UI'
import { formatCurrency } from '../utils/helpers'
import {
  Package,
  ShoppingCart,
  FolderTree,
  TrendingUp,
  ArrowRight,
  Box,
  AlertTriangle,
} from 'lucide-react'

export default function Dashboard() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData() {
      try {
        const [prods, cats] = await Promise.all([
          productService.getAll(),
          productService.getCategories(),
        ])
        setProducts(prods)
        setCategories(cats)
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar datos')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <><Navbar title="Dashboard" /><LoadingSpinner /></>
  if (error) return <><Navbar title="Dashboard" /><ErrorMessage message={error} onRetry={() => window.location.reload()} /></>

  const totalProducts = products.length
  const totalCategories = categories.length
  const totalValue = products.reduce((sum, p) => sum + (parseFloat(p.price) * (p.stock || 0)), 0)
  const lowStock = products.filter(p => p.stock < 10)

  const stats = [
    {
      label: 'Total Productos',
      value: totalProducts,
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
      iconBg: 'bg-blue-100',
    },
    {
      label: 'Categorias',
      value: totalCategories,
      icon: FolderTree,
      color: 'bg-emerald-50 text-emerald-600',
      iconBg: 'bg-emerald-100',
    },
    {
      label: 'Valor Inventario',
      value: formatCurrency(totalValue),
      icon: TrendingUp,
      color: 'bg-violet-50 text-violet-600',
      iconBg: 'bg-violet-100',
    },
    {
      label: 'Stock Bajo',
      value: lowStock.length,
      icon: AlertTriangle,
      color: 'bg-amber-50 text-amber-600',
      iconBg: 'bg-amber-100',
    },
  ]

  return (
    <>
      <Navbar title="Dashboard" />
      <div className="p-6 animate-fade-in">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">{stat.label}</span>
                <div className={`rounded-lg p-2 ${stat.iconBg}`}>
                  <stat.icon size={18} className={stat.color.split(' ')[1]} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Products */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-900">Productos Recientes</h2>
              <button
                onClick={() => navigate('/products')}
                className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors"
              >
                Ver todos <ArrowRight size={14} />
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {products.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                    <Box size={18} className="text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(product.price)}
                  </span>
                </div>
              ))}
              {products.length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-gray-500">No hay productos aun</p>
              )}
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-900">Alertas de Stock Bajo</h2>
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 border border-amber-200">
                {lowStock.length} productos
              </span>
            </div>
            <div className="divide-y divide-gray-50">
              {lowStock.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                    <AlertTriangle size={18} className="text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{formatCurrency(product.price)}</p>
                  </div>
                  <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 border border-red-200">
                    {product.stock} uds
                  </span>
                </div>
              ))}
              {lowStock.length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-gray-500">Todo el inventario esta bien</p>
              )}
            </div>
          </div>

          {/* Categories Overview */}
          <div className="rounded-xl border border-gray-200 bg-white lg:col-span-2">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-900">Categorias</h2>
              <button
                onClick={() => navigate('/categories')}
                className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors"
              >
                Ver todas <ArrowRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
              {categories.map((cat) => {
                const catProducts = products.filter(p => p.categoryId === cat.id)
                return (
                  <div key={cat.id} className="rounded-lg border border-gray-100 p-4 hover:border-gray-200 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="rounded-lg bg-brand-50 p-2">
                        <FolderTree size={16} className="text-brand-600" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900">{cat.name}</h3>
                    </div>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">{cat.description || 'Sin descripcion'}</p>
                    <p className="text-xs font-medium text-gray-700">{catProducts.length} productos</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
