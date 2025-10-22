/**
 * Modal de Permissão de Notificações de Emergência
 * CCB Espaço Infantil - Sistema de Alerta para Pais e Responsáveis
 * 
 * Este modal é exibido APENAS em dispositivos móveis para simplificar
 * a experiência do usuário e o código da aplicação.
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
import { useIsMobile } from '@/hooks/use-is-mobile';

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
 * - Exibido APENAS em dispositivos móveis para simplificar a codificação
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
  const isMobile = useIsMobile();

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

      return true;
    } catch (error) {
      console.error('❌ Erro ao registrar Service Worker:', error);
      return false;
    }
  }, []);

  /**
   * Solicita permissão de notificação ao usuário
   */
  const handleRequestPermission = useCallback(async (): Promise<void> => {
    if (!state.isSupported) {
      console.warn('⚠️ Notificações não suportadas neste dispositivo');
      return;
    }

    setState(prev => ({ ...prev, isRequesting: true }));

    try {
      // 1. Registrar Service Worker primeiro
      const swRegistered = await registerServiceWorker();
      
      if (!swRegistered) {
        console.warn('⚠️ Service Worker não pôde ser registrado');
      }

      // 2. Solicitar permissão
      const permission = await Notification.requestPermission();

      console.log('🔔 Permissão de notificação:', permission);

      setState(prev => ({
        ...prev,
        permission,
        isRequesting: false,
        hasAsked: true
      }));

      // 3. Registrar que perguntamos (apenas na sessão - mais simples)
      sessionStorage.setItem('ccb-notification-asked-today', 'true');

      // 4. Se permitido, mostrar mensagem de sucesso e enviar notificação de teste
      if (permission === 'granted') {
        setShowSuccess(true);
        
        // Notificação de teste/confirmação
        setTimeout(() => {
          new Notification('🔔 Notificações Ativadas!', {
            body: 'Você receberá alertas de emergência sobre seu filho(a) no Espaço Infantil CCB.',
            icon: '/ccb-logo.png',
            badge: '/ccb-logo.png',
            tag: 'welcome',
            requireInteraction: false,
            silent: false
          });
        }, 500);

        // Fechar modal após sucesso
        setTimeout(() => {
          setIsVisible(false);
        }, 2500);
      } else {
        // Se negado, fechar após 2 segundos
        setTimeout(() => {
          setIsVisible(false);
        }, 2000);
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
    // 4. Dispositivo é mobile (NOVO)
    const shouldShow = isSupported && !askedInSession && currentPermission === 'default' && isMobile;
    
    console.log('🔔 Debug modal:', {
      isSupported,
      askedInSession,
      currentPermission,
      isMobile,
      shouldShow
    });
    
    if (shouldShow) {
      // Aguardar 3 segundos antes de mostrar (melhor UX)
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isClient, checkNotificationSupport, isMobile]);

  // Não renderizar se não for visível OU se ainda não estamos no cliente
  if (!isVisible || !isClient) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      role="dialog"
      aria-labelledby="notification-modal-title"
      aria-describedby="notification-modal-description"
    >
      <div 
        className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-red-500 via-red-600 to-orange-600 p-6 sm:p-8 rounded-t-3xl text-white overflow-hidden">
          {/* Padrão de fundo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
          </div>

          {/* Botão fechar */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Conteúdo do header */}
          <div className="relative flex items-start gap-4">
            <div className="flex-shrink-0 w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <BellRing className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h2 id="notification-modal-title" className="text-2xl font-bold mb-1">
                Ativar Alertas de Emergência?
              </h2>
              <p className="text-red-100 text-sm">
                Notificações importantes sobre seu filho(a)
              </p>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 sm:p-8 space-y-5">
          {/* Mensagem de sucesso */}
          {showSuccess && (
            <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-green-900">Notificações Ativadas!</p>
                  <p className="text-sm text-green-700">Você receberá alertas de emergência.</p>
                </div>
              </div>
            </div>
          )}

          {/* Descrição */}
          <div id="notification-modal-description" className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              Receba <strong className="text-red-600">notificações sonoras instantâneas</strong> quando houver uma emergência com seu filho(a) no Espaço Infantil.
            </p>

            {/* Benefícios */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">Emergências</h3>
                  <p className="text-xs text-gray-600">
                    Seja avisado imediatamente em casos que exigem sua presença urgente
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                <Volume2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">Alerta Sonoro</h3>
                  <p className="text-xs text-gray-600">
                    Vibração e som alto, mesmo com celular travado ou silencioso
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">Segurança Total</h3>
                  <p className="text-xs text-gray-600">
                    Funciona mesmo com o app fechado ou celular em modo economia
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Informação LGPD */}
          <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <Info className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-600 leading-relaxed">
              <strong>Privacidade:</strong> Usamos notificações apenas para alertas de emergência. 
              Você pode desativar a qualquer momento nas configurações do navegador. 
              O sistema pergunta uma vez por sessão, sem armazenar dados permanentes.
            </p>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="p-6 sm:p-8 pt-0 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDismiss}
            disabled={state.isRequesting}
            className="flex-1 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Agora Não
          </button>
          <button
            onClick={handleRequestPermission}
            disabled={state.isRequesting || showSuccess}
            className="flex-1 px-6 py-3.5 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-red-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {state.isRequesting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Ativando...</span>
              </>
            ) : showSuccess ? (
              <>
                <Check className="w-5 h-5" />
                <span>Ativado!</span>
              </>
            ) : (
              <>
                <Bell className="w-5 h-5" />
                <span>Ativar Alertas</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

