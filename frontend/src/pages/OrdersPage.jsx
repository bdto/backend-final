import { useState, useEffect, useMemo } from 'react';
import { orderService } from '../services/orderService';
import { addNotification } from '../hooks/useNotifications';
import { useAuth } from '../hooks/useAuth';
import {
  ShoppingCart,
  CheckCircle,
  Truck,
  Clock,
  XCircle,
  Eye,
  X,
  MapPin,
} from 'lucide-react';
import DataTable from '../components/DataTable';

const statusConfig = {
  PENDING: {
    label: 'Pendiente',
    style: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Clock,
  },
  CONFIRMED: {
    label: 'Confirmado',
    style: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: CheckCircle,
  },
  SHIPPED: {
    label: 'Enviado',
    style: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: Truck,
  },
  DELIVERED: {
    label: 'Entregado',
    style: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle,
  },
  CANCELLED: {
    label: 'Cancelado',
    style: 'bg-red-50 text-red-700 border-red-200',
    icon: XCircle,
  },
};

function StatusBadge({ status }) {
  const config = statusConfig[status] || { label: status, style: 'bg-slate-50 text-slate-700 border-slate-200' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.style}`}>
      {config.label}
    </span>
  );
}

function TrackingModal({ orderId, onClose }) {
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const data = await orderService.getTracking(orderId);
        setTracking(data);
      } catch {
        addNotification({ message: 'Error al cargar tracking', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchTracking();
  }, [orderId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" role="dialog" aria-modal="true">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Tracking - Pedido #{orderId}</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Cerrar">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 border-2 border-slate-200 border-t-brand-600 rounded-full animate-spin" />
            </div>
          ) : tracking.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">
              No hay informacion de tracking
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {tracking.map((entry, idx) => (
                <div key={entry.id || idx} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-brand-600 shrink-0 mt-1.5" />
                    {idx < tracking.length - 1 && (
                      <div className="w-px flex-1 bg-slate-200 my-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <StatusBadge status={entry.status} />
                    {entry.location && (
                      <p className="flex items-center gap-1 text-xs text-slate-500 mt-1.5">
                        <MapPin className="h-3 w-3" />
                        {entry.location}
                      </p>
                    )}
                    {entry.description && (
                      <p className="text-sm text-slate-600 mt-1">{entry.description}</p>
                    )}
                    {entry.trackedAt && (
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(entry.trackedAt).toLocaleString('es')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [trackingOrderId, setTrackingOrderId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // For a real app, you'd use the actual userId. Here we try user 1.
      const data = await orderService.getByUser(1);
      setOrders(data);
    } catch {
      addNotification({ message: 'Error al cargar pedidos', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleConfirm = async (id) => {
    try {
      await orderService.confirmOrder(id);
      addNotification({ message: `Pedido #${id} confirmado`, type: 'success' });
      fetchOrders();
    } catch (err) {
      addNotification({
        message: err.response?.data?.message || 'Error al confirmar pedido',
        type: 'error',
      });
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await orderService.updateStatus(id, status);
      addNotification({ message: `Pedido #${id} actualizado a ${status}`, type: 'success' });
      fetchOrders();
    } catch (err) {
      addNotification({
        message: err.response?.data?.message || 'Error al actualizar estado',
        type: 'error',
      });
    }
  };

  const filteredOrders = useMemo(() => {
    if (!search.trim()) return orders;
    const term = search.toLowerCase();
    return orders.filter(
      (o) =>
        o.productName?.toLowerCase().includes(term) ||
        o.status?.toLowerCase().includes(term) ||
        String(o.id).includes(term)
    );
  }, [orders, search]);

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (item) => <span className="font-medium text-slate-900">#{item.id}</span>,
    },
    {
      key: 'productName',
      label: 'Producto',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
            <ShoppingCart className="h-4 w-4 text-amber-600" />
          </div>
          <span className="font-medium text-slate-700">{item.productName}</span>
        </div>
      ),
    },
    {
      key: 'quantity',
      label: 'Cantidad',
      render: (item) => <span className="text-slate-600">{item.quantity}</span>,
    },
    {
      key: 'totalPrice',
      label: 'Total',
      render: (item) => <span className="font-semibold text-slate-900">${Number(item.totalPrice).toFixed(2)}</span>,
    },
    {
      key: 'status',
      label: 'Estado',
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: 'createdAt',
      label: 'Fecha',
      render: (item) => (
        <span className="text-slate-500 text-xs">
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString('es') : '-'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (item) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setTrackingOrderId(item.id)}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
            title="Ver tracking"
            aria-label={`Ver tracking del pedido ${item.id}`}
          >
            <Eye className="h-4 w-4" />
          </button>
          {item.status === 'PENDING' && (
            <button
              onClick={() => handleConfirm(item.id)}
              className="p-1.5 rounded-lg hover:bg-emerald-50 transition-colors text-emerald-600"
              title="Confirmar pedido"
              aria-label={`Confirmar pedido ${item.id}`}
            >
              <CheckCircle className="h-4 w-4" />
            </button>
          )}
          {isAdmin && item.status === 'CONFIRMED' && (
            <button
              onClick={() => handleStatusChange(item.id, 'SHIPPED')}
              className="p-1.5 rounded-lg hover:bg-indigo-50 transition-colors text-indigo-600"
              title="Marcar como enviado"
              aria-label={`Enviar pedido ${item.id}`}
            >
              <Truck className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pedidos</h1>
        <p className="text-slate-500 mt-1">Gestiona y rastrea los pedidos</p>
      </div>

      <DataTable
        columns={columns}
        data={filteredOrders}
        loading={loading}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar pedidos..."
        emptyMessage="No se encontraron pedidos"
      />

      {trackingOrderId && (
        <TrackingModal
          orderId={trackingOrderId}
          onClose={() => setTrackingOrderId(null)}
        />
      )}
    </div>
  );
}
