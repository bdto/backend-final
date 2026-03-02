import { Loader2 } from 'lucide-react'

export function LoadingSpinner({ text = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <Loader2 className="h-8 w-8 animate-spin text-brand-600 mb-3" />
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  )
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="rounded-full bg-red-50 p-4 mb-4">
        <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <p className="text-sm text-gray-700 font-medium mb-1">Algo salio mal</p>
      <p className="text-sm text-gray-500 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
        >
          Reintentar
        </button>
      )}
    </div>
  )
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      {Icon && (
        <div className="rounded-full bg-gray-100 p-4 mb-4">
          <Icon className="h-8 w-8 text-gray-400" />
        </div>
      )}
      <p className="text-sm font-medium text-gray-700 mb-1">{title}</p>
      {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
      {action}
    </div>
  )
}

export function Badge({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {children}
    </span>
  )
}
