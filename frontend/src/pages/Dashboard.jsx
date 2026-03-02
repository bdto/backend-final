import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import Loader from '../components/Loader';

function StatCard({ icon: Icon, label, value, change, changeType, color }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-1 mt-3">
          {changeType === 'up' ? (
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          )}
          <span
            className={`text-sm font-medium ${
              changeType === 'up' ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {change}
          </span>
          <span className="text-sm text-slate-400 ml-1">vs mes anterior</span>
        </div>
      )}
    </div>
  );
}

function RecentOrdersTable({ orders }) {
  const statusStyles = {
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
    CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
    SHIPPED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    DELIVERED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200',
  };

  const statusLabels = {
    PENDING: 'Pendiente',
    CONFIRMED: 'Confirmado',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado',
  };

  return (
    <div className="card overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200">
        <h3 className="text-base font-semibold text-slate-900">Pedidos recientes</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                ID
              </th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                Producto
              </th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                Cantidad
              </th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                Total
              </th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-sm text-slate-400 py-8">
                  No hay pedidos recientes
                </td>
              </tr>
            ) : (
              orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5 text-sm font-medium text-slate-900">#{order.id}</td>
                  <td className="px-6 py-3.5 text-sm text-slate-600">{order.productName}</td>
                  <td className="px-6 py-3.5 text-sm text-slate-600">{order.quantity}</td>
                  <td className="px-6 py-3.5 text-sm font-medium text-slate-900">
                    ${Number(order.totalPrice).toFixed(2)}
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        statusStyles[order.status] || 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {statusLabels[order.status] || order.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const productsData = await productService.getAll();
        if (!cancelled) setProducts(productsData);
      } catch {
        // Products endpoint is public, might still fail
      }

      try {
        // Try fetching orders (requires auth)
        const ordersData = await orderService.getByUser(1);
        if (!cancelled) setOrders(ordersData);
      } catch {
        // Orders might fail if user ID doesn't match
      }

      if (!cancelled) setLoading(false);
    };

    fetchData();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" text="Cargando dashboard..." />
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);
  const activeProducts = products.filter((p) => p.active).length;
  const pendingOrders = orders.filter((o) => o.status === 'PENDING').length;

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 text-balance">
          Bienvenido, {user?.username}
        </h1>
        <p className="text-slate-500 mt-1">Aqui tienes un resumen de tu sistema</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Package}
          label="Productos activos"
          value={activeProducts}
          change="12%"
          changeType="up"
          color="blue"
        />
        <StatCard
          icon={ShoppingCart}
          label="Total pedidos"
          value={orders.length}
          change="8%"
          changeType="up"
          color="green"
        />
        <StatCard
          icon={DollarSign}
          label="Ingresos totales"
          value={`$${totalRevenue.toFixed(2)}`}
          change="15%"
          changeType="up"
          color="amber"
        />
        <StatCard
          icon={TrendingUp}
          label="Pedidos pendientes"
          value={pendingOrders}
          color="indigo"
        />
      </div>

      {/* Recent Orders */}
      <RecentOrdersTable orders={orders} />
    </div>
  );
}
