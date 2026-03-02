import { AlertCircle, X } from 'lucide-react';

export default function ErrorAlert({ message, onClose }) {
  if (!message) return null;

  return (
    <div
      className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 animate-in"
      role="alert"
    >
      <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
      <p className="text-sm flex-1">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="text-red-400 hover:text-red-600 transition-colors"
          aria-label="Cerrar alerta"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
