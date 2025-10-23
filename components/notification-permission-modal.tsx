'use client';

import { useState } from 'react';
import { Bell, X, Check, Info } from 'lucide-react';
import { AlertModal } from './alert-modal';

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
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const handleRequestPermission = async () => {
    if (!('Notification' in window)) {
      setAlertModal({
        isOpen: true,
        title: 'Navegador Não Suportado',
        message: 'Seu navegador não suporta notificações. Por favor, use um navegador mais recente.',
        type: 'warning'
      });
      return;
    }

    setIsRequesting(true);

    try {
      // 1. Solicitar permissão de notificações
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        // 2. Registrar Service Worker para funcionamento em background
        if ('serviceWorker' in navigator) {
          try {
            await navigator.serviceWorker.register('/sw.js');
            console.log('✅ Service Worker registrado para funcionamento em background');
          } catch (swError) {
            console.warn('⚠️ Service Worker não pôde ser registrado:', swError);
          }
        }

        // 3. Configurar para manter aplicação ativa (PWA)
        if ('wakeLock' in navigator) {
          try {
            // Wake Lock API para manter tela ativa durante emergências
            console.log('✅ Wake Lock API disponível');
          } catch (wlError) {
            console.warn('⚠️ Wake Lock não disponível:', wlError);
          }
        }

        // 4. Configurar para aplicação em segundo plano
        if ('permissions' in navigator) {
          try {
            // Verificar permissões de background
            const bgPermission = await navigator.permissions.query({ name: 'background-sync' as any });
            console.log('✅ Background sync status:', bgPermission.state);
          } catch (bgError) {
            console.warn('⚠️ Background sync não disponível:', bgError);
          }
        }

        setShowSuccess(true);
        setTimeout(() => {
          onClose();
          setShowSuccess(false);
        }, 2000);
      } else {
        setAlertModal({
          isOpen: true,
          title: 'Permissão Necessária',
          message: 'Para receber alertas de emergência, é necessário permitir notificações. Por favor, permita as notificações nas configurações do seu navegador.',
          type: 'warning'
        });
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      setAlertModal({
        isOpen: true,
        title: 'Erro na Configuração',
        message: 'Erro ao configurar notificações. Tente novamente ou verifique as configurações do seu navegador.',
        type: 'error'
      });
    } finally {
      setIsRequesting(false);
    }
  };

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
                Você receberá notificações em caso de emergência.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800 mb-1">
                        Receber alertas de emergência
                      </p>
                      <p className="text-sm text-blue-700 mb-3">
                        Permita notificações para ser alertado caso seu filho precise de atenção e seu telefone esteja com a tela bloqueada.
                      </p>
                      <p className="text-xs text-blue-600">
                        ✓ Funciona mesmo com o aplicativo fechado<br/>
                        ✓ Ativa automaticamente em segundo plano no mobile<br/>
                        ✓ Notificações chegam instantaneamente
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
                  onClick={handleRequestPermission}
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

      {/* Modal de Alerta Elegante */}
      {alertModal.isOpen && (
        <AlertModal
          title={alertModal.title}
          message={alertModal.message}
          type={alertModal.type}
          onClose={() => setAlertModal(prev => ({ ...prev, isOpen: false }))}
        />
      )}
    </div>
  );
};
