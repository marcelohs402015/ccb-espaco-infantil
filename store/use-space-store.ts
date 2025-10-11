import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Child, Settings, CultoObservacoes, HistoricoCulto, DiaUso } from '@/types';

interface SpaceStore {
  children: Child[];
  settings: Settings;
  cultoObservacoes: CultoObservacoes;
  historicoCultos: HistoricoCulto[];
  diasDeUso: DiaUso[];
  addChild: (child: Child) => void;
  updateChild: (id: string, child: Partial<Child>) => void;
  removeChild: (id: string) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  updateCultoObservacoes: (observacoes: Partial<CultoObservacoes>) => void;
  salvarCultoNoHistorico: () => void;
  registrarDiaDeUso: () => void;
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
    (set, get) => ({
      children: [],
      settings: defaultSettings,
      cultoObservacoes: defaultCultoObservacoes,
      historicoCultos: [],
      diasDeUso: [],
      
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
      
      salvarCultoNoHistorico: () => 
        set((state) => {
          const { cultoObservacoes, children } = state;
          
          // Só salva se tiver alguma informação preenchida
          if (!cultoObservacoes.palavraLida && !cultoObservacoes.hinosCantados && !cultoObservacoes.aprendizado) {
            return state;
          }
          
          const novoHistorico: HistoricoCulto = {
            id: Date.now().toString(),
            data: cultoObservacoes.data,
            palavraLida: cultoObservacoes.palavraLida,
            hinosCantados: cultoObservacoes.hinosCantados,
            aprendizado: cultoObservacoes.aprendizado,
            totalCriancas: children.length,
          };
          
          // Verifica se já existe um histórico para esta data
          const historicoExistente = state.historicoCultos.find(
            (h) => h.data === cultoObservacoes.data
          );
          
          if (historicoExistente) {
            // Atualiza o histórico existente
            return {
              historicoCultos: state.historicoCultos.map((h) =>
                h.data === cultoObservacoes.data ? novoHistorico : h
              ),
            };
          }
          
          // Adiciona novo histórico
          return {
            historicoCultos: [...state.historicoCultos, novoHistorico],
          };
        }),
      
      registrarDiaDeUso: () => 
        set((state) => {
          const dataAtual = new Date().toISOString().split('T')[0];
          const { children, cultoObservacoes } = state;
          
          // Verifica se já registrou o dia de hoje
          const diaJaRegistrado = state.diasDeUso.find((dia) => dia.data === dataAtual);
          
          if (diaJaRegistrado) {
            // Atualiza o registro do dia
            return {
              diasDeUso: state.diasDeUso.map((dia) =>
                dia.data === dataAtual
                  ? {
                      ...dia,
                      totalCriancas: children.length,
                      cultoRealizado: !!(cultoObservacoes.palavraLida || cultoObservacoes.hinosCantados || cultoObservacoes.aprendizado),
                    }
                  : dia
              ),
            };
          }
          
          // Adiciona novo dia
          const novoDia: DiaUso = {
            data: dataAtual,
            totalCriancas: children.length,
            cultoRealizado: !!(cultoObservacoes.palavraLida || cultoObservacoes.hinosCantados || cultoObservacoes.aprendizado),
          };
          
          return {
            diasDeUso: [...state.diasDeUso, novoDia],
          };
        }),
      
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

