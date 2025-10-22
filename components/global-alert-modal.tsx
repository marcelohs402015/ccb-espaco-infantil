'use client';

import { useAlertStore } from '@/store/use-alert-store';
import { AlertModal } from './alert-modal';

export const GlobalAlertModal: React.FC = () => {
  const { alert, hideAlert } = useAlertStore();

  if (!alert || !alert.isOpen) {
    return null;
  }

  return (
    <AlertModal
      title={alert.title}
      message={alert.message}
      type={alert.type}
      onClose={hideAlert}
    />
  );
};
