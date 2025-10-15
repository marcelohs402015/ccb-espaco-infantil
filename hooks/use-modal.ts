'use client';

import { useState } from 'react';

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export const useModal = () => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const showModal = (title: string, message: string, type: ModalState['type'] = 'info') => {
    setModalState({
      isOpen: true,
      title,
      message,
      type
    });
  };

  const hideModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const showSuccess = (message: string, title: string = 'Sucesso') => {
    showModal(title, message, 'success');
  };

  const showError = (message: string, title: string = 'Erro') => {
    showModal(title, message, 'error');
  };

  const showWarning = (message: string, title: string = 'Aviso') => {
    showModal(title, message, 'warning');
  };

  const showInfo = (message: string, title: string = 'Informação') => {
    showModal(title, message, 'info');
  };

  return {
    modalState,
    showModal,
    hideModal,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};
