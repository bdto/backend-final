import { useAuth } from '../context/AuthContext'
import { Bell, Search, LogOut } from 'lucide-react'

export default function Navbar({ title }) {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 backdrop-blur-md px-6">
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center gap-3">
        <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
          <Search size={18} />
        </button>
        <button className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-500" />
        </button>
        <div className="h-6 w-px bg-gray-200" />
        <span className="text-sm text-gray-600 font-medium">{user?.username}</span>
        <button
          onClick={logout}
          className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
          title="Cerrar sesion"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}
