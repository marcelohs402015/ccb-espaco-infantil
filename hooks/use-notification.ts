/**
 * Hook para Gerenciar Notificações Push
 * CCB Espaço Infantil - PWA com notificações nativas
 */

import { useState, useEffect, useCallback } from 'react';

interface NotificationState {
  isSupported: boolean;
  hasPermission: boolean;
  isRegistered: boolean;
  isLoading: boolean;
  error: string | null;
}

interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
  vibrate?: number[];
  actions?: NotificationAction[];
  data?: any;
}

export const useNotification = () => {
  const [state, setState] = useState<NotificationState>({
    isSupported: false,
    hasPermission: false,
    isRegistered: false,
    isLoading: false,
    error: null
  });

  // Verificar suporte e estado inicial
  useEffect(() => {
    const checkSupport = () => {
      const isSupported = 'Notification' in window && 'serviceWorker' in navigator;
      const hasPermission = isSupported && Notification.permission === 'granted';
      
      console.log('🔔 useNotification - Verificando suporte:', {
        isSupported,
        hasPermission,
        notificationPermission: Notification.permission,
        serviceWorkerSupport: 'serviceWorker' in navigator
      });
      
      setState(prev => ({
        ...prev,
        isSupported,
        hasPermission,
        error: null
      }));
    };

    checkSupport();
  }, []);

  // Registrar Service Worker
  const registerServiceWorker = useCallback(async (): Promise<boolean> => {
    if (!('serviceWorker' in navigator)) {
      setState(prev => ({ ...prev, error: 'Service Worker não suportado' }));
      return false;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('✅ Service Worker registrado:', registration);

      // Aguardar o service worker estar ativo
      await navigator.serviceWorker.ready;
      
      setState(prev => ({ 
        ...prev, 
        isRegistered: true, 
        isLoading: false 
      }));

      return true;
    } catch (error: any) {
      console.error('❌ Erro ao registrar Service Worker:', error);
      setState(prev => ({ 
        ...prev, 
        error: error.message, 
        isLoading: false 
      }));
      return false;
    }
  }, []);

  // Solicitar permissão de notificações
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported) {
      setState(prev => ({ ...prev, error: 'Notificações não suportadas' }));
      return false;
    }

    if (state.hasPermission) {
      return true;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const permission = await Notification.requestPermission();
      
      const hasPermission = permission === 'granted';
      
      setState(prev => ({ 
        ...prev, 
        hasPermission, 
        isLoading: false,
        error: hasPermission ? null : 'Permissão de notificações negada'
      }));

      if (hasPermission) {
        // Registrar service worker após obter permissão
        await registerServiceWorker();
      }

      return hasPermission;
    } catch (error: any) {
      console.error('❌ Erro ao solicitar permissão:', error);
      setState(prev => ({ 
        ...prev, 
        error: error.message, 
        isLoading: false 
      }));
      return false;
    }
  }, [state.isSupported, state.hasPermission, registerServiceWorker]);

  // Enviar notificação local
  const sendNotification = useCallback(async (options: NotificationOptions): Promise<boolean> => {
    if (!state.hasPermission || !state.isRegistered) {
      console.warn('⚠️ Notificações não habilitadas');
      return false;
    }

    try {
      // Enviar notificação via Service Worker
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SEND_NOTIFICATION',
          data: options
        });
      } else {
        // Fallback: notificação direta
        const notification = new Notification(options.title, {
          body: options.body,
          icon: options.icon || '/ccb-logo.png',
          badge: options.badge || '/ccb-logo.png',
          tag: options.tag,
          requireInteraction: options.requireInteraction,
          silent: options.silent,
          data: options.data
        });

        // Vibrar se suportado
        if (options.vibrate && 'vibrate' in navigator) {
          navigator.vibrate(options.vibrate);
        }
      }

      console.log('📱 Notificação enviada:', options.title);
      return true;
    } catch (error: any) {
      console.error('❌ Erro ao enviar notificação:', error);
      setState(prev => ({ ...prev, error: error.message }));
      return false;
    }
  }, [state.hasPermission, state.isRegistered]);

  // Enviar notificação de emergência
  const sendEmergencyNotification = useCallback(async (emergencyData: {
    childId: string;
    childName: string;
    responsavelName: string;
    responsavelPhone: string;
  }): Promise<boolean> => {
    return sendNotification({
      title: '🚨 EMERGÊNCIA - CCB Espaço Infantil',
      body: `Emergência para ${emergencyData.childName}. Responsável: ${emergencyData.responsavelName}`,
      icon: '/ccb-logo.png',
      badge: '/ccb-logo.png',
      tag: `emergency-${emergencyData.childId}`,
      requireInteraction: true,
      silent: false,
      vibrate: [500, 200, 500, 200, 500],
      actions: [
        {
          action: 'call',
          title: 'Ligar',
          icon: '/ccb-logo.png'
        },
        {
          action: 'view',
          title: 'Visualizar',
          icon: '/ccb-logo.png'
        }
      ],
      data: {
        ...emergencyData,
        type: 'emergency'
      }
    });
  }, [sendNotification]);

  // Verificar se notificações estão habilitadas
  const isNotificationEnabled = useCallback((): boolean => {
    return state.isSupported && state.hasPermission && state.isRegistered;
  }, [state.isSupported, state.hasPermission, state.isRegistered]);

  // Limpar erro
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // Estado
    ...state,
    
    // Funções
    requestPermission,
    sendNotification,
    sendEmergencyNotification,
    registerServiceWorker,
    isNotificationEnabled,
    clearError
  };
};
