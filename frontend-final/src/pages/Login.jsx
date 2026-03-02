import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getApiError } from '../utils/helpers'
import { Loader2, Eye, EyeOff, LogIn } from 'lucide-react'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(username, password)
      navigate('/')
    } catch (err) {
      setError(getApiError(err, 'Credenciales invalidas'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-brand-950 p-12 text-white">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white font-bold text-lg">
              B
            </div>
            <span className="text-xl font-semibold">BackendApp</span>
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold leading-tight text-balance">
            Panel de administracion profesional
          </h1>
          <p className="mt-4 text-lg text-white/60 leading-relaxed max-w-md">
            Gestiona productos, pedidos y categorias con un dashboard moderno y seguro.
          </p>
        </div>
        <p className="text-sm text-white/40">
          Backend Final - Spring Boot + React
        </p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-900 text-white font-bold">
                B
              </div>
              <span className="text-lg font-semibold text-brand-900">BackendApp</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Iniciar sesion</h2>
            <p className="mt-2 text-sm text-gray-500">
              Ingresa tus credenciales para acceder al panel
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 animate-scale-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="tu_usuario"
                autoComplete="username"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Contrasena
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="********"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 pr-11 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-lg bg-brand-900 py-3 text-sm font-semibold text-white hover:bg-brand-800 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <LogIn size={18} />
              )}
              {loading ? 'Ingresando...' : 'Iniciar Sesion'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            {'No tienes cuenta? '}
            <Link to="/register" className="font-medium text-brand-600 hover:text-brand-700 transition-colors">
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
