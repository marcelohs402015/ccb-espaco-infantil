'use client';

import { useState } from 'react';
import { X, Phone, AlertTriangle } from 'lucide-react';
import type { Child } from '@/types';
import { playAlertSound } from '@/utils/alert-sound';
import { CallModal } from './call-modal';

interface EmergencyModalProps {
  child: Child;
  onClose: () => void;
  onResponsavelChamado: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ 
  child, 
  onClose,
  onResponsavelChamado 
}) => {
  const [showCallModal, setShowCallModal] = useState(false);

  const handleCallPhone = (): void => {
    playAlertSound();
    setShowCallModal(true);
  };

  const handleCallModalClose = (): void => {
    setShowCallModal(false);
    onResponsavelChamado();
    onClose();
  };

  if (showCallModal) {
    return (
      <CallModal 
        responsavelNome={child.nomeResponsavel}
        telefone={child.celularResponsavel}
        onClose={handleCallModalClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slideUp">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 p-1 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center justify-center gap-3 mb-2">
            <AlertTriangle className="w-12 h-12 text-white animate-pulse" />
          </div>
          
          <h2 className="text-2xl font-bold text-white text-center">
            Alerta de Emergência
          </h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Criança:</p>
            <p className="text-xl font-bold text-gray-900 mb-3">{child.nome}</p>
            
            <p className="text-sm text-gray-600 mb-1">Responsável:</p>
            <p className="text-lg font-semibold text-gray-900 mb-2">
              {child.nomeResponsavel}
            </p>
            
            <p className="text-sm text-gray-600 mb-1">Telefone:</p>
            <p className="text-lg font-bold text-blue-700">
              {child.celularResponsavel}
            </p>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3">
            <p className="text-sm text-gray-700 text-center">
              ⚠️ Ao clicar em &quot;Ligar Agora&quot;, um <strong>alerta sonoro</strong> será tocado 
              para chamar a atenção dos responsáveis.
            </p>
          </div>

          <button
            onClick={handleCallPhone}
            className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-lg rounded-lg hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Phone className="w-6 h-6" />
            Ligar Agora
          </button>

          <button
            onClick={onClose}
            className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

