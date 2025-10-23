'use client';

import { useGlobalAlert } from '@/hooks/use-global-alert';
import { AlertModal } from './alert-modal';

export const GlobalAlertManager: React.FC = () => {
  const { alerts, hideAlert } = useGlobalAlert();

  return (
    <>
      {alerts.map((alert) => (
        <AlertModal
          key={alert.id}
          title={alert.title}
          message={alert.message}
          type={alert.type}
          onClose={() => hideAlert(alert.id)}
        />
      ))}
    </>
  );
};
