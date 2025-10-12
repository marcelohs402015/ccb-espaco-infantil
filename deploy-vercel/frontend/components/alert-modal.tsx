'use client';

import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

interface AlertModalProps {
  title: string;
  message: string;
  onClose: () => void;
  type?: 'success' | 'error' | 'info' | 'warning';
}

export const AlertModal: React.FC<AlertModalProps> = ({
  title,
  message,
  onClose,
  type = 'info',
}) => {
  const configs = {
    success: {
      gradient: 'from-green-500 to-teal-500',
      icon: <CheckCircle className="w-12 h-12 text-white" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    error: {
      gradient: 'from-red-500 to-pink-500',
      icon: <AlertCircle className="w-12 h-12 text-white" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    warning: {
      gradient: 'from-yellow-500 to-orange-500',
      icon: <AlertCircle className="w-12 h-12 text-white" />,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    info: {
      gradient: 'from-blue-500 to-purple-500',
      icon: <Info className="w-12 h-12 text-white" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
  };

  const config = configs[type];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slideUp">
        <div className={`bg-gradient-to-r ${config.gradient} p-6 rounded-t-2xl relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 p-1 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center justify-center gap-3 mb-2">
            {config.icon}
          </div>
          
          <h2 className="text-2xl font-bold text-white text-center">
            {title}
          </h2>
        </div>
        
        <div className="p-6">
          <div className={`${config.bgColor} border-2 ${config.borderColor} rounded-lg p-4 mb-6`}>
            <p className="text-center text-gray-800 text-base">
              {message}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

