import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderTree,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
} from 'lucide-react'
import { cn, getInitials } from '../utils/helpers'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Productos', href: '/products', icon: Package },
  { name: 'Pedidos', href: '/orders', icon: ShoppingCart },
  { name: 'Categorias', href: '/categories', icon: FolderTree },
]

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout, isAdmin } = useAuth()
  const location = useLocation()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-gray-100 px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-900 text-white font-semibold text-sm">
          B
        </div>
        {!collapsed && (
          <span className="text-lg font-semibold text-brand-900 truncate">
            BackendApp
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href ||
              (item.href !== '/' && location.pathname.startsWith(item.href))
            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon
                    size={20}
                    className={cn(
                      'shrink-0 transition-colors',
                      isActive ? 'text-brand-600' : 'text-gray-400'
                    )}
                  />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="border-t border-gray-100 p-3">
        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="mb-3 flex w-full items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        {/* User info */}
        <div className={cn(
          'flex items-center gap-3 rounded-lg p-2',
          collapsed && 'justify-center'
        )}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-xs font-semibold">
            {getInitials(user?.username)}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.username}</p>
              <p className="flex items-center gap-1 text-xs text-gray-500">
                {isAdmin && <Shield size={10} />}
                {user?.role?.replace('ROLE_', '')}
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={logout}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              title="Cerrar sesion"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
