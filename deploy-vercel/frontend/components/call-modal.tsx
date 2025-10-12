'use client';

import { Phone, Copy, CheckCircle, X } from 'lucide-react';
import { useState } from 'react';

interface CallModalProps {
  responsavelNome: string;
  telefone: string;
  onClose: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({ 
  responsavelNome, 
  telefone, 
  onClose 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPhone = (): void => {
    navigator.clipboard.writeText(telefone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTryCall = (): void => {
    // Tentar abrir o discador do celular
    window.location.href = `tel:${telefone}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slideUp">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 p-1 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center justify-center gap-3 mb-2">
            <Phone className="w-12 h-12 text-white animate-bounce" />
          </div>
          
          <h2 className="text-2xl font-bold text-white text-center">
            Ligar para Responsável
          </h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Responsável:</p>
            <p className="text-xl font-bold text-gray-900 mb-4">{responsavelNome}</p>
            
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-700 mb-1">Telefone:</p>
              <p className="text-3xl font-bold text-blue-900 tracking-wider">
                {telefone}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCopyPhone}
              className="flex-1 px-4 py-3 border-2 border-blue-300 text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copiar
                </>
              )}
            </button>
            <button
              onClick={handleTryCall}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Ligar
            </button>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800 text-center">
              💡 <strong>Dica:</strong> Se estiver no celular, clique em "Ligar". 
              No computador, use "Copiar" para copiar o número.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

