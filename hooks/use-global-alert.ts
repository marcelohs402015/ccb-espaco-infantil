'use client';

import { useState, useCallback } from 'react';

interface GlobalAlert {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  isOpen: boolean;
}

interface GlobalAlertStore {
  alerts: GlobalAlert[];
  showAlert: (title: string, message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  hideAlert: (id: string) => void;
  clearAllAlerts: () => void;
}

// Store global para alertas (fora do React)
let globalAlertStore: GlobalAlertStore = {
  alerts: [],
  showAlert: () => {},
  hideAlert: () => {},
  clearAllAlerts: () => {},
};

// Função para mostrar alerta (pode ser chamada de qualquer lugar)
export const showGlobalAlert = (
  title: string, 
  message: string, 
  type: 'success' | 'error' | 'info' | 'warning' = 'info'
): void => {
  const id = Math.random().toString(36).substr(2, 9);
  const alert: GlobalAlert = {
    id,
    title,
    message,
    type,
    isOpen: true,
  };
  
  globalAlertStore.alerts.push(alert);
  globalAlertStore.showAlert(title, message, type);
};

// Hook para usar alertas globais
export const useGlobalAlert = () => {
  const [alerts, setAlerts] = useState<GlobalAlert[]>([]);

  const showAlert = useCallback((title: string, message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    const newAlert: GlobalAlert = {
      id,
      title,
      message,
      type,
      isOpen: true,
    };
    
    setAlerts(prev => [...prev, newAlert]);
    
    // Auto-hide após 5 segundos
    setTimeout(() => {
      hideAlert(id);
    }, 5000);
  }, []);

  const hideAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // Atualizar o store global
  globalAlertStore = {
    alerts,
    showAlert,
    hideAlert,
    clearAllAlerts,
  };

  return {
    alerts,
    showAlert,
    hideAlert,
    clearAllAlerts,
  };
};
