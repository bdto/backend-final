import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/products', icon: Package, label: 'Productos' },
  { to: '/orders', icon: ShoppingCart, label: 'Pedidos' },
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-brand-950 text-white flex flex-col z-30 transition-all duration-300 ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 h-16 px-5 border-b border-white/10">
        <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-white">A</span>
        </div>
        {!collapsed && (
          <span className="text-lg font-semibold tracking-tight whitespace-nowrap">
            Admin Panel
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 flex flex-col gap-1 px-3" role="navigation" aria-label="Menu principal">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="px-3 pb-4">
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full py-2 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          aria-label={collapsed ? 'Expandir menu' : 'Colapsar menu'}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>
    </aside>
  );
}
