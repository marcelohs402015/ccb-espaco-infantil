/**
 * Hook para Refresh Automático (Polling)
 * CCB Espaço Infantil - Fallback para garantir sincronização
 */

import { useEffect, useRef, useCallback } from 'react';
import { useSpaceStore } from '@/store/use-space-store';

interface AutoRefreshOptions {
  enabled?: boolean;
  interval?: number; // em milissegundos
  pauseOnFocus?: boolean; // pausar quando a aba não está ativa
  pauseOnError?: boolean; // pausar temporariamente em caso de erro
}

export const useAutoRefresh = (options: AutoRefreshOptions = {}) => {
  const {
    enabled = true,
    interval = 5000, // 5 segundos
    pauseOnFocus = true,
    pauseOnError = true
  } = options;

  const { igrejaAtiva, loadIgrejas, loadIgrejaData } = useSpaceStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const errorCountRef = useRef(0);
  const isActiveRef = useRef(true);
  const lastRefreshRef = useRef<Date | null>(null);

  // Função para fazer refresh dos dados
  const refreshData = useCallback(async () => {
    if (!igrejaAtiva || !isActiveRef.current) return;

    try {
      console.log('🔄 Auto-refresh executado:', new Date().toLocaleTimeString());
      
      await Promise.all([
        loadIgrejas(),
        loadIgrejaData(igrejaAtiva)
      ]);
      
      lastRefreshRef.current = new Date();
      errorCountRef.current = 0; // Reset contador de erros
      
    } catch (error) {
      console.error('❌ Erro no auto-refresh:', error);
      errorCountRef.current++;
      
      // Se houver muitos erros consecutivos, pausar temporariamente
      if (pauseOnError && errorCountRef.current >= 3) {
        console.warn('⚠️ Muitos erros consecutivos - pausando auto-refresh por 30 segundos');
        isActiveRef.current = false;
        setTimeout(() => {
          isActiveRef.current = true;
          errorCountRef.current = 0;
        }, 30000); // Pausar por 30 segundos
      }
    }
  }, [igrejaAtiva, loadIgrejas, loadIgrejaData, pauseOnError]);

  // Configurar polling automático
  useEffect(() => {
    if (!enabled || !igrejaAtiva) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    console.log('⏰ Iniciando auto-refresh a cada', interval / 1000, 'segundos');

    // Primeiro refresh imediato
    refreshData();

    // Configurar intervalo
    intervalRef.current = setInterval(() => {
      if (isActiveRef.current) {
        refreshData();
      }
    }, interval);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, igrejaAtiva, interval, refreshData]);

  // Pausar quando a aba não está ativa (para economizar recursos)
  useEffect(() => {
    if (!pauseOnFocus) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('👁️ Aba inativa - pausando auto-refresh');
        isActiveRef.current = false;
      } else {
        console.log('👁️ Aba ativa - retomando auto-refresh');
        isActiveRef.current = true;
        // Fazer refresh imediato quando voltar à aba
        refreshData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pauseOnFocus, refreshData]);

  // Pausar quando a janela perde o foco
  useEffect(() => {
    if (!pauseOnFocus) return;

    const handleFocus = () => {
      isActiveRef.current = true;
      refreshData(); // Refresh imediato quando voltar o foco
    };

    const handleBlur = () => {
      isActiveRef.current = false;
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [pauseOnFocus, refreshData]);

  // Cleanup no unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isActive: isActiveRef.current,
    lastRefresh: lastRefreshRef.current,
    errorCount: errorCountRef.current,
    refreshNow: refreshData
  };
};
