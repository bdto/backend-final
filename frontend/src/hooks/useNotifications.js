import { useState, useCallback, useRef } from 'react';

// Global notification state
let listeners = [];
let notifications = [];
let idCounter = 0;

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function addNotification(notification) {
  const id = ++idCounter;
  const newNotification = {
    id,
    type: notification.type || 'info',
    message: notification.message,
    duration: notification.duration || 4000,
  };

  notifications = [...notifications, newNotification];
  emitChange();

  // Auto remove
  setTimeout(() => {
    removeNotification(id);
  }, newNotification.duration);

  return id;
}

export function removeNotification(id) {
  notifications = notifications.filter((n) => n.id !== id);
  emitChange();
}

export function useNotifications() {
  const [, setTick] = useState(0);
  const subscribedRef = useRef(false);

  if (!subscribedRef.current) {
    subscribedRef.current = true;
    const listener = () => setTick((t) => t + 1);
    listeners.push(listener);
  }

  const notify = useCallback((message, type = 'success') => {
    addNotification({ message, type });
  }, []);

  return {
    notifications,
    notify,
    removeNotification,
  };
}
