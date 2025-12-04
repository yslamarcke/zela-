import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onRemove: () => void }> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove();
    }, 4000); // Auto close after 4s
    return () => clearTimeout(timer);
  }, [onRemove]);

  const styles = {
    success: 'bg-white border-l-4 border-emerald-500 text-gray-800',
    error: 'bg-white border-l-4 border-red-500 text-gray-800',
    info: 'bg-white border-l-4 border-blue-500 text-gray-800',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  return (
    <div className={`${styles[toast.type]} shadow-lg rounded-r-lg p-4 flex items-center gap-3 min-w-[300px] animate-slide-in relative`}>
      {icons[toast.type]}
      <p className="text-sm font-medium pr-6">{toast.message}</p>
      <button 
        onClick={onRemove} 
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};