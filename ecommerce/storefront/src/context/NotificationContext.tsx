import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { INotification, SOCKET_EVENTS } from '@ecommerce/notifications';

const API_URL = 'http://localhost:3000';

interface NotificationContextType {
  notifications: INotification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

const getUserInfo = () => {
  try {
    return JSON.parse(localStorage.getItem('userInfo') || '');
  } catch {
    return null;
  }
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [token, setToken] = useState<string | null>(() => getUserInfo()?.token || null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const handleAuthChange = () => setToken(getUserInfo()?.token || null);
    window.addEventListener('auth-updated', handleAuthChange);
    return () => window.removeEventListener('auth-updated', handleAuthChange);
  }, []);

  const getAuthHeaders = useCallback(() => {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }, [token]);

  const fetchNotifications = useCallback(async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/notifications`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('[Notifications] Fetch error:', error);
    }
  }, [token, getAuthHeaders]);

  const markAsRead = useCallback(async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setNotifications(prev =>
          prev.map(n => (n._id === id ? { ...n, read: true } : n))
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('[Notifications] Mark as read error:', error);
    }
  }, [token, getAuthHeaders]);

  const markAllRead = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/notifications/read-all`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('[Notifications] Mark all read error:', error);
    }
  }, [token, getAuthHeaders]);

  const deleteNotification = useCallback(async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/notifications/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setNotifications(prev => {
          const notification = prev.find(n => n._id === id);
          if (notification && !notification.read) {
            setUnreadCount(c => Math.max(0, c - 1));
          }
          return prev.filter(n => n._id !== id);
        });
      }
    } catch (error) {
      console.error('[Notifications] Delete error:', error);
    }
  }, [token, getAuthHeaders]);

  // Socket.IO connection lifecycle
  useEffect(() => {
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    fetchNotifications();

    const socket = io(API_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('[Notifications] Socket connected');
    });

    socket.on(SOCKET_EVENTS.NOTIFICATION_NEW, (notification: INotification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);

      // Show browser notification
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
          });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              new Notification(notification.title, {
                body: notification.message,
              });
            }
          });
        }
      }
    });

    socket.on('connect_error', (error) => {
      console.error('[Notifications] Socket connection error:', error.message);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
        markAllRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
