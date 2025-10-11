/**
 * Store Principal - Agora usando Supabase + localStorage como backup
 * CCB Espaço Infantil
 */
export * from './use-space-store-supabase';

interface IgrejaData {
  children: Child[];
  settings: Settings;
  cultoObservacoes: CultoObservacoes;
  historicoCultos: HistoricoCulto[];
  diasDeUso: DiaUso[];
}

interface SpaceStore {
  igrejas: Igreja[];
  igrejaAtiva: string | null;
  dadosPorIgreja: Record<string, IgrejaData>;
  // Ações
  setIgrejaAtiva: (igrejaId: string | null) => void;
  addChild: (child: Child) => void;
  updateChild: (id: string, child: Partial<Child>) => void;
  removeChild: (id: string) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  updateCultoObservacoes: (observacoes: Partial<CultoObservacoes>) => void;
  salvarCultoNoHistorico: () => void;
  registrarDiaDeUso: () => void;
  addIgreja: (igreja: Igreja) => void;
  updateIgreja: (id: string, igreja: Partial<Igreja>) => void;
  removeIgreja: (id: string) => void;
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

const createDefaultIgrejaData = (): IgrejaData => ({
  children: [],
  settings: defaultSettings,
  cultoObservacoes: { ...defaultCultoObservacoes },
  historicoCultos: [],
  diasDeUso: [],
});

const getIgrejaData = (state: SpaceStore): IgrejaData => {
  if (!state.igrejaAtiva) {
    return createDefaultIgrejaData();
  }
  if (!state.dadosPorIgreja[state.igrejaAtiva]) {
    return createDefaultIgrejaData();
  }
  return state.dadosPorIgreja[state.igrejaAtiva];
};

export const useSpaceStore = create<SpaceStore>()(
  persist(
    (set, get) => ({
      igrejas: [],
      igrejaAtiva: null,
      dadosPorIgreja: {},
      
      setIgrejaAtiva: (igrejaId) =>
        set((state) => {
          // Se a igreja não existe nos dados, cria uma entrada vazia
          if (igrejaId && !state.dadosPorIgreja[igrejaId]) {
            return {
              igrejaAtiva: igrejaId,
              dadosPorIgreja: {
                ...state.dadosPorIgreja,
                [igrejaId]: createDefaultIgrejaData(),
              },
            };
          }
          return { igrejaAtiva: igrejaId };
        }),
      
      addChild: (child) => 
        set((state) => {
          if (!state.igrejaAtiva) return state;
          const igrejaData = getIgrejaData(state);
          return {
            dadosPorIgreja: {
              ...state.dadosPorIgreja,
              [state.igrejaAtiva]: {
                ...igrejaData,
                children: [...igrejaData.children, child],
              },
            },
          };
        }),
      
      updateChild: (id, childData) => 
        set((state) => {
          if (!state.igrejaAtiva) return state;
          const igrejaData = getIgrejaData(state);
          return {
            dadosPorIgreja: {
              ...state.dadosPorIgreja,
              [state.igrejaAtiva]: {
                ...igrejaData,
                children: igrejaData.children.map((child) =>
                  child.id === id ? { ...child, ...childData } : child
                ),
              },
            },
          };
        }),
      
      removeChild: (id) => 
        set((state) => {
          if (!state.igrejaAtiva) return state;
          const igrejaData = getIgrejaData(state);
          return {
            dadosPorIgreja: {
              ...state.dadosPorIgreja,
              [state.igrejaAtiva]: {
                ...igrejaData,
                children: igrejaData.children.filter((child) => child.id !== id),
              },
            },
          };
        }),
      
      updateSettings: (settingsData) => 
        set((state) => {
          if (!state.igrejaAtiva) return state;
          const igrejaData = getIgrejaData(state);
          return {
            dadosPorIgreja: {
              ...state.dadosPorIgreja,
              [state.igrejaAtiva]: {
                ...igrejaData,
                settings: { ...igrejaData.settings, ...settingsData },
              },
            },
          };
        }),
      
      updateCultoObservacoes: (observacoes) => 
        set((state) => {
          if (!state.igrejaAtiva) return state;
          const igrejaData = getIgrejaData(state);
          return {
            dadosPorIgreja: {
              ...state.dadosPorIgreja,
              [state.igrejaAtiva]: {
                ...igrejaData,
                cultoObservacoes: { ...igrejaData.cultoObservacoes, ...observacoes },
              },
            },
          };
        }),
      
      salvarCultoNoHistorico: () => 
        set((state) => {
          if (!state.igrejaAtiva) return state;
          const igrejaData = getIgrejaData(state);
          const { cultoObservacoes } = igrejaData;
          
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
            totalCriancas: igrejaData.children.length,
          };
          
          // Verifica se já existe um histórico para esta data
          const historicoExistente = igrejaData.historicoCultos.find(
            (h) => h.data === cultoObservacoes.data
          );
          
          if (historicoExistente) {
            // Atualiza o histórico existente
            return {
              dadosPorIgreja: {
                ...state.dadosPorIgreja,
                [state.igrejaAtiva]: {
                  ...igrejaData,
                  historicoCultos: igrejaData.historicoCultos.map((h) =>
                    h.data === cultoObservacoes.data ? novoHistorico : h
                  ),
                },
              },
            };
          }
          
          // Adiciona novo histórico
          return {
            dadosPorIgreja: {
              ...state.dadosPorIgreja,
              [state.igrejaAtiva]: {
                ...igrejaData,
                historicoCultos: [...igrejaData.historicoCultos, novoHistorico],
              },
            },
          };
        }),
      
      registrarDiaDeUso: () => 
        set((state) => {
          if (!state.igrejaAtiva) return state;
          const igrejaData = getIgrejaData(state);
          const dataAtual = new Date().toISOString().split('T')[0];
          const { children, cultoObservacoes } = igrejaData;
          
          // Verifica se já registrou o dia de hoje
          const diaJaRegistrado = igrejaData.diasDeUso.find((dia) => dia.data === dataAtual);
          
          if (diaJaRegistrado) {
            // Atualiza o registro do dia
            return {
              dadosPorIgreja: {
                ...state.dadosPorIgreja,
                [state.igrejaAtiva]: {
                  ...igrejaData,
                  diasDeUso: igrejaData.diasDeUso.map((dia) =>
                    dia.data === dataAtual
                      ? {
                          ...dia,
                          totalCriancas: children.length,
                          cultoRealizado: !!(cultoObservacoes.palavraLida || cultoObservacoes.hinosCantados || cultoObservacoes.aprendizado),
                        }
                      : dia
                  ),
                },
              },
            };
          }
          
          // Adiciona novo dia
          const novoDia: DiaUso = {
            data: dataAtual,
            totalCriancas: children.length,
            cultoRealizado: !!(cultoObservacoes.palavraLida || cultoObservacoes.hinosCantados || cultoObservacoes.aprendizado),
          };
          
          return {
            dadosPorIgreja: {
              ...state.dadosPorIgreja,
              [state.igrejaAtiva]: {
                ...igrejaData,
                diasDeUso: [...igrejaData.diasDeUso, novoDia],
              },
            },
          };
        }),
      
      addIgreja: (igreja) => 
        set((state) => ({ 
          igrejas: [...state.igrejas, igreja] 
        })),
      
      updateIgreja: (id, igrejaData) => 
        set((state) => ({
          igrejas: state.igrejas.map((igreja) =>
            igreja.id === id ? { ...igreja, ...igrejaData } : igreja
          ),
        })),
      
      removeIgreja: (id) => 
        set((state) => {
          // Remove os dados da igreja também
          const novosDados = { ...state.dadosPorIgreja };
          delete novosDados[id];
          
          return {
            igrejas: state.igrejas.filter((igreja) => igreja.id !== id),
            dadosPorIgreja: novosDados,
            // Se a igreja removida era a ativa, desativa
            igrejaAtiva: state.igrejaAtiva === id ? null : state.igrejaAtiva,
          };
        }),
      
      clearAllData: () => 
        set((state) => {
          if (!state.igrejaAtiva) return state;
          return {
            dadosPorIgreja: {
              ...state.dadosPorIgreja,
              [state.igrejaAtiva]: createDefaultIgrejaData(),
            },
          };
        }),
    }),
    {
      name: 'ccb-espaco-infantil-storage',
    }
  )
);

