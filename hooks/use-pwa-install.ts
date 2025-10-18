/**
 * Hook para Gerenciar Instalação PWA
 * CCB Espaço Infantil - Add to Home Screen
 */

import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAInstallState {
  canInstall: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isDesktop: boolean;
  isDismissed: boolean;
}

export const usePWAInstall = () => {
  const [state, setState] = useState<PWAInstallState>({
    canInstall: false,
    isInstalled: false,
    isIOS: false,
    isAndroid: false,
    isDesktop: false,
    isDismissed: false
  });

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  // Detectar plataforma
  const detectPlatform = useCallback(() => {
    if (typeof window === 'undefined') return { isIOS: false, isAndroid: false, isDesktop: false };

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /android/.test(userAgent);
    const isDesktop = !isIOS && !isAndroid;

    console.log('🔍 PWA: Plataforma detectada:', { isIOS, isAndroid, isDesktop, userAgent: userAgent.substring(0, 50) });

    return { isIOS, isAndroid, isDesktop };
  }, []);

  // Verificar se app está instalado
  const checkIfInstalled = useCallback(() => {
    if (typeof window === 'undefined') return false;

    // Verificar display mode standalone
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    // Verificar iOS standalone
    const isIOSStandalone = (navigator as any).standalone === true;
    
    // Verificar fullscreen
    const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;

    return isStandalone || isIOSStandalone || isFullscreen;
  }, []);

  // Verificar se foi dismissed nesta sessão
  const checkIfDismissed = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('ccb-install-prompt-dismissed') === 'true';
  }, []);

  // Inicializar estado
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const platform = detectPlatform();
    const isInstalled = checkIfInstalled();
    const isDismissed = checkIfDismissed();

    setState(prev => ({
      ...prev,
      ...platform,
      isInstalled,
      isDismissed
    }));
  }, [detectPlatform, checkIfInstalled, checkIfDismissed]);

  // Verificar se está no cliente (hidratação)
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Capturar evento beforeinstallprompt
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      
      setState(prev => ({
        ...prev,
        canInstall: true
      }));

      console.log('📱 PWA: Prompt de instalação capturado');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Detectar quando app é instalado
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleAppInstalled = () => {
      console.log('✅ PWA: App instalado com sucesso!');
      
      setState(prev => ({
        ...prev,
        isInstalled: true,
        canInstall: false
      }));

      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Função para disparar prompt de instalação
  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) {
      console.warn('⚠️ PWA: Prompt de instalação não disponível');
      return false;
    }

    try {
      await deferredPrompt.prompt();
      
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log(`📱 PWA: Usuário ${outcome === 'accepted' ? 'aceitou' : 'recusou'} a instalação`);

      if (outcome === 'accepted') {
        setState(prev => ({
          ...prev,
          isInstalled: true,
          canInstall: false
        }));
      }

      setDeferredPrompt(null);
      return outcome === 'accepted';
    } catch (error) {
      console.error('❌ PWA: Erro ao mostrar prompt de instalação:', error);
      return false;
    }
  }, [deferredPrompt]);

  // Função para dispensar o card (apenas nesta sessão)
  const dismissPrompt = useCallback(() => {
    if (typeof window === 'undefined') return;

    sessionStorage.setItem('ccb-install-prompt-dismissed', 'true');
    
    setState(prev => ({
      ...prev,
      isDismissed: true
    }));

    console.log('✋ PWA: Card de instalação dispensado (apenas nesta sessão)');
  }, []);

  // Verificar se deve mostrar o prompt
  const shouldShowPrompt = useCallback(() => {
    if (!isClient) {
      console.log('🔍 PWA: Não está no cliente (SSR)');
      return false; // Não mostrar durante SSR
    }
    
    const shouldShow = !state.isInstalled && !state.isDismissed;
    console.log('🔍 PWA: shouldShowPrompt =', shouldShow, {
      isInstalled: state.isInstalled,
      isDismissed: state.isDismissed,
      canInstall: state.canInstall,
      isIOS: state.isIOS,
      isAndroid: state.isAndroid,
      isDesktop: state.isDesktop
    });
    
    return shouldShow;
  }, [isClient, state.isInstalled, state.isDismissed, state.canInstall, state.isIOS, state.isAndroid, state.isDesktop]);

  return {
    ...state,
    promptInstall,
    dismissPrompt,
    shouldShowPrompt: shouldShowPrompt(),
    isClient
  };
};
