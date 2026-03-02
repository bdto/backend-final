import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useNotifications, removeNotification } from '../hooks/useNotifications';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const styles = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const iconStyles = {
  success: 'text-emerald-500',
  error: 'text-red-500',
  info: 'text-blue-500',
};

export default function NotificationContainer() {
  const { notifications } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full" role="region" aria-label="Notificaciones">
      {notifications.map((notification) => {
        const Icon = icons[notification.type] || Info;
        return (
          <div
            key={notification.id}
            className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-slide-in ${styles[notification.type] || styles.info}`}
            role="alert"
          >
            <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${iconStyles[notification.type] || iconStyles.info}`} />
            <p className="text-sm flex-1 font-medium">{notification.message}</p>
            <button
              onClick={() => removeNotification(notification.id)}
              className="opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Cerrar notificacion"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
