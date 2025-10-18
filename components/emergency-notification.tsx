/**
 * Notificação de Emergência em Tempo Real
 * CCB Espaço Infantil
 */

'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Phone, User, Clock, X } from 'lucide-react';

interface EmergencyData {
  childId: string;
  childName: string;
  responsavelName: string;
  responsavelPhone: string;
  timestamp: string;
}

export const EmergencyNotification: React.FC = () => {
  const [emergencyData, setEmergencyData] = useState<EmergencyData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleEmergency = (event: CustomEvent) => {
      const data = event.detail as EmergencyData;
      console.log('🚨 Notificação de emergência recebida:', data);
      
      setEmergencyData(data);
      setIsVisible(true);
      
      // Auto-hide após 30 segundos
      setTimeout(() => {
        setIsVisible(false);
      }, 30000);
    };

    // Escutar eventos de emergência
    window.addEventListener('emergency-triggered', handleEmergency as EventListener);

    return () => {
      window.removeEventListener('emergency-triggered', handleEmergency as EventListener);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleCallResponsavel = () => {
    if (emergencyData?.responsavelPhone) {
      window.open(`tel:${emergencyData.responsavelPhone}`, '_self');
    }
  };

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (!isVisible || !emergencyData) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-red-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border-4 border-red-500 animate-pulse">
        {/* Header de Emergência */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-t-2xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 animate-bounce" />
              <div>
                <h2 className="text-2xl font-bold">🚨 EMERGÊNCIA</h2>
                <p className="text-red-100 text-sm">Chamada de emergência ativada</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              aria-label="Fechar notificação"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Conteúdo da Emergência */}
        <div className="p-6 space-y-4">
          {/* Informações da Criança */}
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <User className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-bold text-red-800">Criança</h3>
            </div>
            <p className="text-xl font-semibold text-gray-900">
              {emergencyData.childName}
            </p>
          </div>

          {/* Informações do Responsável */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <Phone className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-bold text-blue-800">Responsável</h3>
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-2">
              {emergencyData.responsavelName}
            </p>
            <p className="text-base text-gray-700">
              {emergencyData.responsavelPhone}
            </p>
          </div>

          {/* Timestamp */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Emergência ativada às {formatTime(emergencyData.timestamp)}</span>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleCallResponsavel}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <Phone className="w-5 h-5" />
              Ligar Agora
            </button>
            <button
              onClick={handleClose}
              className="px-6 py-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
            >
              Entendi
            </button>
          </div>
        </div>

        {/* Indicador de Urgência */}
        <div className="bg-red-100 border-t-2 border-red-300 p-3 rounded-b-2xl">
          <p className="text-center text-red-800 font-semibold text-sm">
            ⚠️ Ação imediata necessária - Chame o responsável agora!
          </p>
        </div>
      </div>
    </div>
  );
};
