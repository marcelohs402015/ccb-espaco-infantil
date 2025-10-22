/**
 * Modal de Permissão de Notificações de Emergência
 * CCB Espaço Infantil - Sistema de Alerta para Pais e Responsáveis
 * 
 * Conformidade LGPD:
 * - Transparência total sobre uso de notificações
 * - Permissão explícita do usuário
 * - Possibilidade de recusa
 * - Dados usados apenas para segurança das crianças
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Bell, BellRing, Shield, Volume2, X, AlertTriangle, Check, Info } from 'lucide-react';

/**
 * Estado das permissões de notificação
 */
interface NotificationState {
  permission: NotificationPermission;
  isSupported: boolean;
  isRequesting: boolean;
  hasAsked: boolean;
}

/**
 * Modal de Solicitação de Permissão para Notificações de Emergência
 * 
 * Funcionalidades:
 * - Solicita permissão para notificações push
 * - Explica claramente o propósito (emergências com crianças)
 * - Registra Service Worker para notificações em background
 * - Compatível com dispositivos móveis (Android/iOS)
 * - Interface moderna e acessível
 */
export const NotificationPermissionModal: React.FC = () => {
  const [state, setState] = useState<NotificationState>({
    permission: 'default',
    isSupported: false,
    isRequesting: false,
    hasAsked: false
  });
  
  const [isVisible, setIsVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const hasCheckedRef = useRef(false);

  /**
   * Verifica suporte a notificações no navegador
   */
  const checkNotificationSupport = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    
    const supported = (
      'Notification' in window &&
      'serviceWorker' in navigator &&
      window.isSecureContext
    );

    console.log('🔔 Verificação de suporte a notificações:', {
      hasNotification: 'Notification' in window,
      hasServiceWorker: 'serviceWorker' in navigator,
      isSecureContext: window.isSecureContext,
      supported
    });

    return supported;
  }, []);

  /**
   * Registra Service Worker para notificações em background
   */
  const registerServiceWorker = useCallback(async (): Promise<boolean> => {
    if (!('serviceWorker' in navigator)) {
      console.warn('⚠️ Service Worker não suportado');
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('✅ Service Worker registrado:', registration.scope);

      // Aguardar ativação
      if (registration.installing) {
        await new Promise<void>((resolve) => {
          registration.installing!.addEventListener('statechange', (e: Event) => {
            const target = e.target as ServiceWorker;
            if (target.state === 'activated') {
              resolve();
            }
          });
        });
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
      setState(prev => ({ ...prev, isRequesting: false }));
    }
  }, [state.isSupported, registerServiceWorker]);

  /**
   * Fecha o modal e registra que usuário dispensou (apenas na sessão)
   */
  const handleDismiss = useCallback((): void => {
    // Registrar que perguntamos nesta sessão (mais simples e confiável)
    sessionStorage.setItem('ccb-notification-asked-today', 'true');

    setState(prev => ({ ...prev, hasAsked: true }));
    setIsVisible(false);
  }, []);

  /**
   * Effect: Verificação inicial ao montar componente
   */
  useEffect(() => {
    // Primeiro, marcar que estamos no cliente
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || hasCheckedRef.current) return;
    hasCheckedRef.current = true;

    // Verificar suporte
    const isSupported = checkNotificationSupport();
    
    if (!isSupported) {
      console.warn('⚠️ Notificações não suportadas neste navegador/dispositivo');
      return;
    }

    // Abordagem mais simples: verificar apenas a permissão do navegador
    const currentPermission: NotificationPermission = Notification.permission;
    
    // Usar sessionStorage (mais confiável que localStorage)
    const sessionKey = 'ccb-notification-asked-today';
    const askedInSession = sessionStorage.getItem(sessionKey) === 'true';

    setState({
      permission: currentPermission,
      isSupported,
      isRequesting: false,
      hasAsked: askedInSession
    });

    // Mostrar modal apenas se:
    // 1. Notificações são suportadas
    // 2. Não perguntamos nesta sessão
    // 3. Permissão ainda não foi definida (nem granted nem denied)
    const shouldShow = isSupported && !askedInSession && currentPermission === 'default';
    
    console.log('🔔 Debug modal:', {
      isSupported,
      askedInSession,
      currentPermission,
      shouldShow
    });
    
    if (shouldShow) {
      // Aguardar 3 segundos antes de mostrar (melhor UX)
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isClient, checkNotificationSupport]);

  // Não renderizar se não for visível OU se ainda não estamos no cliente
  if (!isVisible || !isClient) return null;

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

