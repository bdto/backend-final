import { useState, useEffect } from 'react'
import Navbar from '../layout/Navbar'
import { orderService } from '../services/orderService'
import { LoadingSpinner, ErrorMessage, EmptyState, Badge } from '../components/UI'
import { formatCurrency, formatDate, getStatusColor } from '../utils/helpers'
import { useAuth } from '../context/AuthContext'
import {
  ShoppingCart,
  Plus,
  Search,
  Eye,
  CheckCircle,
  X,
  Truck,
  Clock,
  MapPin,
} from 'lucide-react'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [searchUserId, setSearchUserId] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [tracking, setTracking] = useState([])
  const [trackingLoading, setTrackingLoading] = useState(false)
  const { isAdmin } = useAuth()

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    setLoading(true)
    setError(null)
    try {
      // Default: search by user 1 or show empty
      const data = await orderService.getByUser(1)
      setOrders(data)
    } catch (err) {
      // If 404 or no orders, just show empty
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  async function searchByUser() {
    if (!searchUserId) return
    setLoading(true)
    setError(null)
    try {
      const data = await orderService.getByUser(searchUserId)
      setOrders(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al buscar pedidos')
    } finally {
      setLoading(false)
    }
  }

  async function confirmOrder(id) {
    try {
      await orderService.confirm(id)
      if (searchUserId) {
        const data = await orderService.getByUser(searchUserId)
        setOrders(data)
      } else {
        fetchOrders()
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al confirmar pedido')
    }
  }

  async function viewTracking(order) {
    setSelectedOrder(order)
    setTrackingLoading(true)
    try {
      const data = await orderService.getTracking(order.id)
      setTracking(data)
    } catch {
      setTracking([])
    } finally {
      setTrackingLoading(false)
    }
  }

  return (
    <>
      <Navbar title="Pedidos" />
      <div className="p-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Gestion de Pedidos</h2>
            <p className="text-sm text-gray-500 mt-1">{orders.length} pedidos encontrados</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-lg bg-brand-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-800 transition-colors"
          >
            <Plus size={16} />
            Nuevo Pedido
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <OrderForm
            onSuccess={() => { setShowForm(false); fetchOrders() }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Search */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              placeholder="Buscar por ID de usuario..."
              value={searchUserId}
              onChange={(e) => setSearchUserId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchByUser()}
              className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
            />
          </div>
          <button
            onClick={searchByUser}
            className="rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Buscar
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
        )}

        {/* Content */}
        {loading ? (
          <LoadingSpinner />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title="No hay pedidos"
            description="Busca por ID de usuario o crea un nuevo pedido"
          />
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">ID</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Producto</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Cantidad</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Total</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Estado</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Fecha</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-sm font-medium text-gray-900">#{order.id}</td>
                      <td className="px-5 py-4 text-sm text-gray-700">{order.productName}</td>
                      <td className="px-5 py-4 text-sm text-gray-700">{order.quantity}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-gray-900">{formatCurrency(order.totalPrice)}</td>
                      <td className="px-5 py-4">
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => viewTracking(order)}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            title="Ver tracking"
                          >
                            <Eye size={16} />
                          </button>
                          {order.status === 'PENDING' && (
                            <button
                              onClick={() => confirmOrder(order.id)}
                              className="rounded-lg p-1.5 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                              title="Confirmar"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tracking Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl animate-scale-in mx-4">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Tracking del Pedido #{selectedOrder.id}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{selectedOrder.productName}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 max-h-96 overflow-y-auto">
                {trackingLoading ? (
                  <LoadingSpinner text="Cargando tracking..." />
                ) : tracking.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">No hay registros de tracking</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {tracking.map((event, i) => (
                      <div key={event.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`rounded-full p-1.5 ${i === 0 ? 'bg-brand-100' : 'bg-gray-100'}`}>
                            {event.status === 'PENDING' && <Clock size={14} className="text-amber-500" />}
                            {event.status === 'CONFIRMED' && <CheckCircle size={14} className="text-blue-500" />}
                            {event.status === 'SHIPPED' && <Truck size={14} className="text-indigo-500" />}
                            {event.status === 'DELIVERED' && <CheckCircle size={14} className="text-emerald-500" />}
                            {!['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'].includes(event.status) && (
                              <MapPin size={14} className="text-gray-400" />
                            )}
                          </div>
                          {i < tracking.length - 1 && <div className="w-px flex-1 bg-gray-200 my-1" />}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                          </div>
                          <p className="text-sm text-gray-700">{event.description}</p>
                          {event.location && (
                            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                              <MapPin size={10} /> {event.location}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">{formatDate(event.trackedAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function OrderForm({ onSuccess, onCancel }) {
  const [form, setForm] = useState({
    userId: '',
    productName: '',
    quantity: '1',
    totalPrice: '',
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
      await orderService.create({
        userId: parseInt(form.userId),
        productName: form.productName,
        quantity: parseInt(form.quantity),
        totalPrice: parseFloat(form.totalPrice),
      })
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear pedido')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 animate-scale-in">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Nuevo Pedido</h3>
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">ID Usuario</label>
          <input
            name="userId"
            type="number"
            min="1"
            value={form.userId}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Nombre del Producto</label>
          <input
            name="productName"
            value={form.productName}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Cantidad</label>
          <input
            name="quantity"
            type="number"
            min="1"
            value={form.quantity}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Precio Total</label>
          <input
            name="totalPrice"
            type="number"
            step="0.01"
            min="0"
            value={form.totalPrice}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div className="flex gap-3 sm:col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-brand-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-800 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Creando...' : 'Crear Pedido'}
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
