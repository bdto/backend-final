import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-brand-600 leading-none mb-2">404</div>
        <h1 className="text-2xl font-bold text-slate-900 mt-4">Pagina no encontrada</h1>
        <p className="text-slate-500 mt-2 text-balance">
          Lo sentimos, la pagina que buscas no existe o ha sido movida.
        </p>
        <div className="flex items-center justify-center gap-3 mt-8">
          <Link to="/dashboard" className="btn-primary flex items-center gap-2">
            <Home className="h-4 w-4" />
            Ir al Dashboard
          </Link>
          <button onClick={() => window.history.back()} className="btn-secondary flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
