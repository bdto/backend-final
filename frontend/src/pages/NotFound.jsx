import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6">
      <div className="text-center animate-fade-in">
        <p className="text-8xl font-bold text-brand-900">404</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Pagina no encontrada</h1>
        <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
          La pagina que buscas no existe o ha sido movida a otra ubicacion.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-900 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-800 transition-colors"
        >
          <Home size={16} />
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
