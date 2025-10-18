/**
 * Hook para Gerenciar Estado de Sincronização
 * CCB Espaço Infantil
 */

import { useState, useEffect, useCallback } from 'react';

interface SyncState {
  isConnected: boolean;
  isSyncing: boolean;
  lastSync: Date | null;
  error: string | null;
}

export const useSyncState = () => {
  const [syncState, setSyncState] = useState<SyncState>({
    isConnected: true,
    isSyncing: false,
    lastSync: null,
    error: null
  });

  const setConnected = useCallback((connected: boolean) => {
    setSyncState(prev => ({
      ...prev,
      isConnected: connected,
      error: connected ? null : 'Conexão perdida'
    }));
  }, []);

  const setSyncing = useCallback((syncing: boolean) => {
    setSyncState(prev => ({
      ...prev,
      isSyncing: syncing
    }));
  }, []);

  const setLastSync = useCallback((date: Date) => {
    setSyncState(prev => ({
      ...prev,
      lastSync: date,
      isSyncing: false,
      error: null
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setSyncState(prev => ({
      ...prev,
      error,
      isSyncing: false
    }));
  }, []);

  // Simular verificação de conectividade
  useEffect(() => {
    const checkConnectivity = () => {
      setConnected(navigator.onLine);
    };

    // Verificar conectividade inicial
    checkConnectivity();

    // Listeners para mudanças de conectividade
    window.addEventListener('online', checkConnectivity);
    window.addEventListener('offline', checkConnectivity);

    return () => {
      window.removeEventListener('online', checkConnectivity);
      window.removeEventListener('offline', checkConnectivity);
    };
  }, [setConnected]);

  return {
    ...syncState,
    setConnected,
    setSyncing,
    setLastSync,
    setError
  };
};
