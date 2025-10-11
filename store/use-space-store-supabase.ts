import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Child, Settings, CultoObservacoes, HistoricoCulto, DiaUso, Igreja } from '@/types';

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
  isLoading: boolean;
  error: string | null;
  
  // Ações
  setIgrejaAtiva: (igrejaId: string | null) => Promise<void>;
  loadIgrejas: () => Promise<void>;
  loadIgrejaData: (igrejaId: string) => Promise<void>;
  addChild: (child: Omit<Child, 'id'>) => Promise<void>;
  updateChild: (id: string, child: Partial<Child>) => Promise<void>;
  removeChild: (id: string) => Promise<void>;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  updateCultoObservacoes: (observacoes: Partial<CultoObservacoes>) => Promise<void>;
  salvarCultoNoHistorico: () => Promise<void>;
  registrarDiaDeUso: () => Promise<void>;
  addIgreja: (igreja: Omit<Igreja, 'id'>) => Promise<void>;
  updateIgreja: (id: string, igreja: Partial<Igreja>) => Promise<void>;
  removeIgreja: (id: string) => Promise<void>;
  clearAllData: () => Promise<void>;
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

export const useSpaceStore = create<SpaceStore>((set, get) => ({
  igrejas: [],
  igrejaAtiva: null,
  dadosPorIgreja: {},
  isLoading: false,
  error: null,

  loadIgrejas: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('igrejas')
        .select('*')
        .order('nome');

      if (error) throw error;

      set({ igrejas: data || [], isLoading: false });
      
      console.log('✅ Igrejas carregadas:', data?.length);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error('❌ Erro ao carregar igrejas:', error);
    }
  },

  loadIgrejaData: async (igrejaId: string) => {
    set({ isLoading: true, error: null });
    try {
      const hoje = new Date().toISOString().split('T')[0];

      // Carregar children do dia
      const { data: children } = await supabase
        .from('children')
        .select('*')
        .eq('igreja_id', igrejaId)
        .eq('data_cadastro', hoje)
        .order('hora_entrada');

      // Carregar settings
      const { data: settings } = await supabase
        .from('settings')
        .select('*')
        .eq('igreja_id', igrejaId)
        .single();

      // Carregar observações do culto de hoje
      const { data: cultoObs } = await supabase
        .from('culto_observacoes')
        .select('*')
        .eq('igreja_id', igrejaId)
        .eq('data', hoje)
        .single();

      // Carregar histórico de cultos
      const { data: historico } = await supabase
        .from('historico_cultos')
        .select('*')
        .eq('igreja_id', igrejaId)
        .order('data', { ascending: false })
        .limit(10);

      // Carregar dias de uso
      const { data: diasUso } = await supabase
        .from('dias_uso')
        .select('*')
        .eq('igreja_id', igrejaId)
        .order('data', { ascending: false })
        .limit(30);

      const igrejaData: IgrejaData = {
        children: children || [],
        settings: settings || defaultSettings,
        cultoObservacoes: cultoObs || defaultCultoObservacoes,
        historicoCultos: historico || [],
        diasDeUso: diasUso || [],
      };

      set((state) => ({
        dadosPorIgreja: {
          ...state.dadosPorIgreja,
          [igrejaId]: igrejaData,
        },
        isLoading: false,
      }));

      console.log('✅ Dados da igreja carregados:', igrejaId);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error('❌ Erro ao carregar dados da igreja:', error);
    }
  },

  setIgrejaAtiva: async (igrejaId) => {
    set({ igrejaAtiva: igrejaId });
    
    if (igrejaId) {
      // Carregar dados da igreja
      await get().loadIgrejaData(igrejaId);
    }
  },

  addChild: async (childData) => {
    const { igrejaAtiva } = get();
    if (!igrejaAtiva) {
      console.error('❌ Nenhuma igreja ativa');
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('children')
        .insert({
          ...childData,
          igreja_id: igrejaAtiva,
          data_cadastro: new Date().toISOString().split('T')[0],
          is_chamado_ativo: false,
        })
        .select()
        .single();

      if (error) throw error;

      // Atualizar estado local
      set((state) => {
        const igrejaData = state.dadosPorIgreja[igrejaAtiva] || createDefaultIgrejaData();
        return {
          dadosPorIgreja: {
            ...state.dadosPorIgreja,
            [igrejaAtiva]: {
              ...igrejaData,
              children: [...igrejaData.children, data],
            },
          },
          isLoading: false,
        };
      });

      console.log('✅ Criança cadastrada no Supabase:', data);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error('❌ Erro ao cadastrar criança:', error);
    }
  },

  updateChild: async (id, childData) => {
    const { igrejaAtiva } = get();
    if (!igrejaAtiva) return;

    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('children')
        .update(childData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Atualizar estado local
      set((state) => {
        const igrejaData = state.dadosPorIgreja[igrejaAtiva] || createDefaultIgrejaData();
        return {
          dadosPorIgreja: {
            ...state.dadosPorIgreja,
            [igrejaAtiva]: {
              ...igrejaData,
              children: igrejaData.children.map((child) =>
                child.id === id ? { ...child, ...data } : child
              ),
            },
          },
          isLoading: false,
        };
      });

      console.log('✅ Criança atualizada no Supabase:', data);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error('❌ Erro ao atualizar criança:', error);
    }
  },

  removeChild: async (id) => {
    const { igrejaAtiva } = get();
    if (!igrejaAtiva) return;

    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('children')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Atualizar estado local
      set((state) => {
        const igrejaData = state.dadosPorIgreja[igrejaAtiva] || createDefaultIgrejaData();
        return {
          dadosPorIgreja: {
            ...state.dadosPorIgreja,
            [igrejaAtiva]: {
              ...igrejaData,
              children: igrejaData.children.filter((child) => child.id !== id),
            },
          },
          isLoading: false,
        };
      });

      console.log('✅ Criança removida do Supabase');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error('❌ Erro ao remover criança:', error);
    }
  },

  updateSettings: async (settingsData) => {
    const { igrejaAtiva } = get();
    if (!igrejaAtiva) return;

    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('settings')
        .upsert({
          igreja_id: igrejaAtiva,
          ...settingsData,
        })
        .select()
        .single();

      if (error) throw error;

      // Atualizar estado local
      set((state) => {
        const igrejaData = state.dadosPorIgreja[igrejaAtiva] || createDefaultIgrejaData();
        return {
          dadosPorIgreja: {
            ...state.dadosPorIgreja,
            [igrejaAtiva]: {
              ...igrejaData,
              settings: { ...igrejaData.settings, ...data },
            },
          },
          isLoading: false,
        };
      });

      console.log('✅ Settings atualizados no Supabase');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error('❌ Erro ao atualizar settings:', error);
    }
  },

  updateCultoObservacoes: async (observacoes) => {
    const { igrejaAtiva, dadosPorIgreja } = get();
    if (!igrejaAtiva) return;

    const igrejaData = dadosPorIgreja[igrejaAtiva] || createDefaultIgrejaData();
    const novasObservacoes = { ...igrejaData.cultoObservacoes, ...observacoes };

    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('culto_observacoes')
        .upsert({
          igreja_id: igrejaAtiva,
          data: novasObservacoes.data,
          palavra_lida: novasObservacoes.palavraLida,
          hinos_cantados: novasObservacoes.hinosCantados,
          aprendizado: novasObservacoes.aprendizado,
        })
        .select()
        .single();

      if (error) throw error;

      // Atualizar estado local
      set((state) => {
        const igrejaData = state.dadosPorIgreja[igrejaAtiva] || createDefaultIgrejaData();
        return {
          dadosPorIgreja: {
            ...state.dadosPorIgreja,
            [igrejaAtiva]: {
              ...igrejaData,
              cultoObservacoes: novasObservacoes,
            },
          },
          isLoading: false,
        };
      });

      console.log('✅ Observações do culto salvas no Supabase');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error('❌ Erro ao salvar observações:', error);
    }
  },

  salvarCultoNoHistorico: async () => {
    const { igrejaAtiva, dadosPorIgreja } = get();
    if (!igrejaAtiva) return;

    const igrejaData = dadosPorIgreja[igrejaAtiva] || createDefaultIgrejaData();
    const { cultoObservacoes, children } = igrejaData;

    if (!cultoObservacoes.palavraLida && !cultoObservacoes.hinosCantados && !cultoObservacoes.aprendizado) {
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('historico_cultos')
        .upsert({
          igreja_id: igrejaAtiva,
          data: cultoObservacoes.data,
          palavra_lida: cultoObservacoes.palavraLida,
          hinos_cantados: cultoObservacoes.hinosCantados,
          aprendizado: cultoObservacoes.aprendizado,
          total_criancas: children.length,
        })
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Culto salvo no histórico do Supabase');
      
      // Recarregar histórico
      await get().loadIgrejaData(igrejaAtiva);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error('❌ Erro ao salvar culto no histórico:', error);
    }
  },

  registrarDiaDeUso: async () => {
    const { igrejaAtiva, dadosPorIgreja } = get();
    if (!igrejaAtiva) return;

    const igrejaData = dadosPorIgreja[igrejaAtiva] || createDefaultIgrejaData();
    const dataAtual = new Date().toISOString().split('T')[0];

    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('dias_uso')
        .upsert({
          igreja_id: igrejaAtiva,
          data: dataAtual,
          total_criancas: igrejaData.children.length,
          culto_realizado: !!(
            igrejaData.cultoObservacoes.palavraLida ||
            igrejaData.cultoObservacoes.hinosCantados ||
            igrejaData.cultoObservacoes.aprendizado
          ),
        });

      if (error) throw error;

      console.log('✅ Dia de uso registrado no Supabase');
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error('❌ Erro ao registrar dia de uso:', error);
    }
  },

  addIgreja: async (igrejaData) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('igrejas')
        .insert({
          ...igrejaData,
          data_cadastro: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Criar settings padrão
      await supabase.from('settings').insert({
        igreja_id: data.id,
        capacidade_maxima: 30,
      });

      set((state) => ({
        igrejas: [...state.igrejas, data],
        isLoading: false,
      }));

      console.log('✅ Igreja cadastrada no Supabase:', data);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error('❌ Erro ao cadastrar igreja:', error);
    }
  },

  updateIgreja: async (id, igrejaData) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('igrejas')
        .update(igrejaData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        igrejas: state.igrejas.map((igreja) =>
          igreja.id === id ? { ...igreja, ...data } : igreja
        ),
        isLoading: false,
      }));

      console.log('✅ Igreja atualizada no Supabase');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error('❌ Erro ao atualizar igreja:', error);
    }
  },

  removeIgreja: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('igrejas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => {
        const novosDados = { ...state.dadosPorIgreja };
        delete novosDados[id];

        return {
          igrejas: state.igrejas.filter((igreja) => igreja.id !== id),
          dadosPorIgreja: novosDados,
          igrejaAtiva: state.igrejaAtiva === id ? null : state.igrejaAtiva,
          isLoading: false,
        };
      });

      console.log('✅ Igreja removida do Supabase');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error('❌ Erro ao remover igreja:', error);
    }
  },

  clearAllData: async () => {
    const { igrejaAtiva } = get();
    if (!igrejaAtiva) return;

    set({ isLoading: true, error: null });
    try {
      const hoje = new Date().toISOString().split('T')[0];

      // Remover apenas crianças de hoje
      await supabase
        .from('children')
        .delete()
        .eq('igreja_id', igrejaAtiva)
        .eq('data_cadastro', hoje);

      set((state) => ({
        dadosPorIgreja: {
          ...state.dadosPorIgreja,
          [igrejaAtiva]: createDefaultIgrejaData(),
        },
        isLoading: false,
      }));

      console.log('✅ Dados do dia limpos no Supabase');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error('❌ Erro ao limpar dados:', error);
    }
  },
}));

