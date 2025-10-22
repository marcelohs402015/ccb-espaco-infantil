'use client';

import { useState, useCallback } from 'react';
import { X, Bell, BellRing, Shield, Volume2, Check, Info } from 'lucide-react';

interface NotificationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPermissionModal: React.FC<NotificationPermissionModalProps> = ({ 
  isOpen, 
  onClose
}) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const registerServiceWorker = useCallback(async () => {
    try {
      if ('serviceWorker' in navigator) {
        console.log('🔧 Registrando Service Worker...');
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('✅ Service Worker registrado:', registration.scope);
        await navigator.serviceWorker.ready;
        console.log('🚀 Service Worker pronto para uso');
        return registration;
      } else {
        throw new Error('Service Worker não suportado');
      }
    } catch (error) {
      console.error('❌ Erro ao registrar Service Worker:', error);
      throw error;
    }
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    console.log('🔔 Iniciando solicitação de permissão para notificações...');
    
    if (!('Notification' in window)) {
      console.error('❌ Este navegador não suporta notificações');
      alert('Seu navegador não suporta notificações push');
      return;
    }

    setIsRequesting(true);

    try {
      const permission = await Notification.requestPermission();
      console.log('📢 Permissão de notificação:', permission);

      if (permission === 'granted') {
        await registerServiceWorker();
        setShowSuccess(true);
        console.log('✅ Sistema de notificações configurado com sucesso!');
        
        setTimeout(() => {
          onClose();
          setShowSuccess(false);
        }, 2000);
      } else {
        console.warn('⚠️ Permissão de notificação negada pelo usuário');
        alert('Para receber alertas de emergência, é necessário permitir notificações.');
      }
    } catch (error) {
      console.error('❌ Erro ao solicitar permissão:', error);
      alert('Erro ao configurar notificações. Tente novamente.');
    } finally {
      setIsRequesting(false);
    }
  }, [onClose, registerServiceWorker]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Notificações de Emergência
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {showSuccess ? (
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Configurado com Sucesso!
              </h3>
              <p className="text-green-600">
                Você receberá notificações em caso de emergência com crianças.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Sistema de Alerta para Pais
                  </h3>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-start space-x-3">
                    <BellRing className="w-5 h-5 text-orange-500 mt-0.5" />
                    <p className="text-sm text-gray-600">
                      Receba alertas instantâneos se seu filho precisar de atenção médica
                    </p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Volume2 className="w-5 h-5 text-orange-500 mt-0.5" />
                    <p className="text-sm text-gray-600">
                      Notificações sonoras mesmo com o celular no silencioso
                    </p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-green-500 mt-0.5" />
                    <p className="text-sm text-gray-600">
                      Seus dados ficam apenas no seu dispositivo
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800 mb-1">
                        Como funciona:
                      </p>
                      <p className="text-sm text-blue-700">
                        Quando necessário, a equipe do berçário enviará uma notificação 
                        diretamente para seu celular. Você será alertado imediatamente, 
                        mesmo que o aplicativo esteja fechado.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Agora Não
                </button>
                <button
                  onClick={requestNotificationPermission}
                  disabled={isRequesting}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isRequesting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Configurando...</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-4 h-4" />
                      <span>Permitir Notificações</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

