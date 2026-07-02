import { INotification } from '@ecommerce/notifications';
import { Trash2 } from 'lucide-react';

interface NotificationItemProps {
  notification: INotification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const getRelativeTime = (dateStr: string): string => {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
};

const getNotificationIcon = (type: string): string => {
  switch (type) {
    case 'account_created': return '👋';
    case 'order_placed': return '🛒';
    case 'payment_success': return '💳';
    case 'order_status_updated': return '📋';
    case 'order_shipped': return '🚚';
    case 'order_delivered': return '📦';
    case 'new_user_registered': return '👤';
    case 'new_order_placed': return '🛍️';
    case 'payment_completed': return '💰';
    default: return '🔔';
  }
};

const NotificationItem = ({ notification, onMarkAsRead, onDelete }: NotificationItemProps) => {
  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification._id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(notification._id);
  };

  return (
    <div
      onClick={handleClick}
      className={`group flex items-start gap-3 px-4 py-3 cursor-pointer transition-all duration-200 border-b border-gray-50 last:border-b-0 ${
        notification.read
          ? 'bg-white hover:bg-gray-50'
          : 'bg-blue-50/50 hover:bg-blue-50'
      }`}
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-base mt-0.5">
        {getNotificationIcon(notification.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm leading-snug ${notification.read ? 'text-gray-600' : 'text-gray-900 font-semibold'}`}>
            {notification.title}
          </p>
          {!notification.read && (
            <span className="flex-shrink-0 w-2 h-2 mt-1.5 rounded-full bg-blue-500" />
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">{notification.message}</p>
        <span className="text-[11px] text-gray-400 mt-1 block">{getRelativeTime(notification.createdAt)}</span>
      </div>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        className="flex-shrink-0 p-1.5 rounded-lg text-gray-300 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
        title="Delete notification"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default NotificationItem;
