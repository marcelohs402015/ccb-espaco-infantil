import { create } from 'zustand';

interface AlertState {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose?: () => void;
}

interface AlertStore {
  alert: AlertState | null;
  showAlert: (alert: Omit<AlertState, 'isOpen'>) => void;
  hideAlert: () => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  alert: null,
  
  showAlert: (alertData) => {
    set({
      alert: {
        ...alertData,
        isOpen: true,
      },
    });
  },
  
  hideAlert: () => {
    set((state) => {
      // Call onClose callback if it exists
      if (state.alert?.onClose) {
        state.alert.onClose();
      }
      return { alert: null };
    });
  },
}));
