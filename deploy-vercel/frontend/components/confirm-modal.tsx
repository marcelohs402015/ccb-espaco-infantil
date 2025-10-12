'use client';

import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'warning' | 'error' | 'info';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  type = 'warning',
}) => {
  const colors = {
    warning: {
      gradient: 'from-yellow-500 to-orange-500',
      icon: 'text-yellow-500',
      button: 'from-yellow-500 to-orange-500',
    },
    error: {
      gradient: 'from-red-500 to-pink-500',
      icon: 'text-red-500',
      button: 'from-red-500 to-pink-500',
    },
    info: {
      gradient: 'from-blue-500 to-purple-500',
      icon: 'text-blue-500',
      button: 'from-blue-500 to-purple-500',
    },
  };

  const colorScheme = colors[type];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slideUp">
        <div className={`bg-gradient-to-r ${colorScheme.gradient} p-6 rounded-t-2xl relative`}>
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 p-1 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center justify-center gap-3 mb-2">
            <AlertTriangle className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-white text-center">
            {title}
          </h2>
        </div>
        
        <div className="p-6">
          <p className="text-center text-gray-700 text-lg mb-6">
            {message}
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-3 bg-gradient-to-r ${colorScheme.button} text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

