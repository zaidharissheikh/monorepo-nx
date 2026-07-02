import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useEffect } from 'react';

export interface ToastProps {
  id: string;
  type?: 'success' | 'error' | 'info';
  message: string;
  onClose: (id: string) => void;
  duration?: number;
}

const Toast = ({ id, type = 'info', message, onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const typeStyles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  const Icon = type === 'success' ? CheckCircle : type === 'error' ? AlertCircle : Info;
  const iconColors = type === 'success' ? 'text-green-500' : type === 'error' ? 'text-red-500' : 'text-blue-500';

  return (
    <div className={`flex items-center w-full max-w-xs p-4 mb-4 rounded-xl border shadow-sm ${typeStyles[type]} transition-all duration-300 transform translate-y-0 opacity-100`}>
      <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${typeStyles[type]}`}>
        <Icon className={`w-5 h-5 ${iconColors}`} />
      </div>
      <div className="ml-3 text-sm font-medium">{message}</div>
      <button 
        type="button" 
        onClick={() => onClose(id)}
        className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 hover:bg-black/5 inline-flex h-8 w-8 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Toast;
