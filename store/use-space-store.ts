import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Child, Settings, CultoObservacoes } from '@/types';

interface SpaceStore {
  children: Child[];
  settings: Settings;
  cultoObservacoes: CultoObservacoes;
  addChild: (child: Child) => void;
  updateChild: (id: string, child: Partial<Child>) => void;
  removeChild: (id: string) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  updateCultoObservacoes: (observacoes: Partial<CultoObservacoes>) => void;
  clearAllData: () => void;
}

const defaultSettings: Settings = {
  capacidadeMaxima: 30,
};

const defaultCultoObservacoes: CultoObservacoes = {
  data: new Date().toISOString().split('T')[0],
  palavraLida: '',
  hinosCantados: '',
  aprendizado: '',
};

export const useSpaceStore = create<SpaceStore>()(
  persist(
    (set) => ({
      children: [],
      settings: defaultSettings,
      cultoObservacoes: defaultCultoObservacoes,
      
      addChild: (child) => 
        set((state) => ({ 
          children: [...state.children, child] 
        })),
      
      updateChild: (id, childData) => 
        set((state) => ({
          children: state.children.map((child) =>
            child.id === id ? { ...child, ...childData } : child
          ),
        })),
      
      removeChild: (id) => 
        set((state) => ({
          children: state.children.filter((child) => child.id !== id),
        })),
      
      updateSettings: (settingsData) => 
        set((state) => ({
          settings: { ...state.settings, ...settingsData },
        })),
      
      updateCultoObservacoes: (observacoes) => 
        set((state) => ({
          cultoObservacoes: { ...state.cultoObservacoes, ...observacoes },
        })),
      
      clearAllData: () => 
        set(() => ({
          children: [],
          settings: defaultSettings,
          cultoObservacoes: defaultCultoObservacoes,
        })),
    }),
    {
      name: 'ccb-espaco-infantil-storage',
    }
  )
);

