import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Child, Settings, CultoObservacoes, HistoricoCulto, DiaUso, Igreja, ResponsavelType } from '@/types';

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
  criarCultoNoHistorico: (data: string, observacoes: { palavraLida?: string; hinosCantados?: string; aprendizado?: string }, totalCriancas: number) => Promise<void>;
  atualizarUltimoCultoHistorico: (observacoes: { palavraLida?: string; hinosCantados?: string; aprendizado?: string }) => Promise<void>;
  registrarDiaDeUso: () => Promise<void>;
  addIgreja: (igreja: Omit<Igreja, 'id'>) => Promise<void>;
  updateIgreja: (id: string, igreja: Partial<Igreja>) => Promise<void>;
  removeIgreja: (id: string) => Promise<void>;
  clearAllData: () => Promise<void>;
  clearHistoricoCultos: () => Promise<void>;
  removeCultoFromHistorico: (cultoId: string) => Promise<void>;
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

      // Mapear snake_case para camelCase
      const igrejasMapeadas: Igreja[] = (data || []).map(igreja => ({
        id: igreja.id,
        nome: igreja.nome,
        dataCadastro: igreja.data_cadastro,
      }));

      set({ igrejas: igrejasMapeadas, isLoading: false });
      
      console.log('✅ Igrejas carregadas:', igrejasMapeadas.length);
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
      const { data: childrenData } = await supabase
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
        .maybeSingle();

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

      // Mapear children de snake_case para camelCase
      const children: Child[] = (childrenData || []).map(child => ({
        id: child.id,
        nome: child.nome,
        nomeResponsavel: child.nome_responsavel,
        tipoResponsavel: child.tipo_responsavel as ResponsavelType,
        celularResponsavel: child.celular_responsavel,
        observacoes: child.observacoes || '',
        horaEntrada: child.hora_entrada,
        isChamadoAtivo: child.is_chamado_ativo || false,
      }));

      const igrejaData: IgrejaData = {
        children,
        settings: settings ? {
          capacidadeMaxima: settings.capacidade_maxima || 30
        } : defaultSettings,
        cultoObservacoes: cultoObs ? {
          data: cultoObs.data,
          palavraLida: cultoObs.palavra_lida || '',
          hinosCantados: cultoObs.hinos_cantados || '',
          aprendizado: cultoObs.aprendizado || '',
        } : defaultCultoObservacoes,
        historicoCultos: (historico || []).map(h => ({
          id: h.id,
          data: h.data,
          palavraLida: h.palavra_lida || '',
          hinosCantados: h.hinos_cantados || '',
          aprendizado: h.aprendizado || '',
          totalCriancas: h.total_criancas || 0,
        })),
        diasDeUso: (diasUso || []).map(d => ({
          data: d.data,
          totalCriancas: d.total_criancas || 0,
          cultoRealizado: d.culto_realizado || false,
        })),
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
      // Converter camelCase para snake_case
      const childPayload = {
        igreja_id: igrejaAtiva,
        nome: childData.nome,
        nome_responsavel: childData.nomeResponsavel,
        tipo_responsavel: childData.tipoResponsavel,
        celular_responsavel: childData.celularResponsavel,
        observacoes: childData.observacoes || '',
        hora_entrada: childData.horaEntrada,
        is_chamado_ativo: false,
        data_cadastro: new Date().toISOString().split('T')[0],
      };

      console.log('📤 Enviando criança para Supabase:', childPayload);

      const { data, error } = await supabase
        .from('children')
        .insert(childPayload)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro detalhado:', error);
        throw error;
      }

      console.log('✅ Criança cadastrada no Supabase:', data);

      // Converter de volta para camelCase para o estado local
      const childLocal: Child = {
        id: data.id,
        nome: data.nome,
        nomeResponsavel: data.nome_responsavel,
        tipoResponsavel: data.tipo_responsavel as ResponsavelType,
        celularResponsavel: data.celular_responsavel,
        observacoes: data.observacoes || '',
        horaEntrada: data.hora_entrada,
        isChamadoAtivo: data.is_chamado_ativo || false,
      };

      // Atualizar estado local
      set((state) => {
        const igrejaData = state.dadosPorIgreja[igrejaAtiva] || createDefaultIgrejaData();
        return {
          dadosPorIgreja: {
            ...state.dadosPorIgreja,
            [igrejaAtiva]: {
              ...igrejaData,
              children: [...igrejaData.children, childLocal],
            },
          },
          isLoading: false,
        };
      });

      console.log('✅ Estado local atualizado');
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
      // Converter camelCase para snake_case
      const updatePayload: any = {};
      
      if (childData.nome !== undefined) updatePayload.nome = childData.nome;
      if (childData.nomeResponsavel !== undefined) updatePayload.nome_responsavel = childData.nomeResponsavel;
      if (childData.tipoResponsavel !== undefined) updatePayload.tipo_responsavel = childData.tipoResponsavel;
      if (childData.celularResponsavel !== undefined) updatePayload.celular_responsavel = childData.celularResponsavel;
      if (childData.observacoes !== undefined) updatePayload.observacoes = childData.observacoes;
      if (childData.horaEntrada !== undefined) updatePayload.hora_entrada = childData.horaEntrada;
      if (childData.isChamadoAtivo !== undefined) updatePayload.is_chamado_ativo = childData.isChamadoAtivo;

      console.log('📤 Atualizando criança no Supabase:', updatePayload);

      const { data, error } = await supabase
        .from('children')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro detalhado:', error);
        throw error;
      }

      console.log('✅ Criança atualizada no Supabase:', data);

      // Converter de volta para camelCase
      const childLocal: Child = {
        id: data.id,
        nome: data.nome,
        nomeResponsavel: data.nome_responsavel,
        tipoResponsavel: data.tipo_responsavel as ResponsavelType,
        celularResponsavel: data.celular_responsavel,
        observacoes: data.observacoes || '',
        horaEntrada: data.hora_entrada,
        isChamadoAtivo: data.is_chamado_ativo || false,
      };

      // Atualizar estado local
      set((state) => {
        const igrejaData = state.dadosPorIgreja[igrejaAtiva] || createDefaultIgrejaData();
        return {
          dadosPorIgreja: {
            ...state.dadosPorIgreja,
            [igrejaAtiva]: {
              ...igrejaData,
              children: igrejaData.children.map((child) =>
                child.id === id ? childLocal : child
              ),
            },
          },
          isLoading: false,
        };
      });

      console.log('✅ Estado local atualizado');
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
      // Converter camelCase para snake_case para o Supabase
      const settingsPayload = {
        igreja_id: igrejaAtiva,
        capacidade_maxima: settingsData.capacidadeMaxima,
      };

      console.log('📤 Enviando settings para Supabase:', settingsPayload);

      const { data, error } = await supabase
        .from('settings')
        .upsert(settingsPayload, {
          onConflict: 'igreja_id', // Chave única para merge
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erro detalhado:', error);
        throw error;
      }

      console.log('✅ Settings salvos no Supabase:', data);

      // Atualizar estado local (converter de volta para camelCase)
      set((state) => {
        const igrejaData = state.dadosPorIgreja[igrejaAtiva] || createDefaultIgrejaData();
        return {
          dadosPorIgreja: {
            ...state.dadosPorIgreja,
            [igrejaAtiva]: {
              ...igrejaData,
              settings: {
                capacidadeMaxima: data.capacidade_maxima,
              },
            },
          },
          isLoading: false,
        };
      });

      console.log('✅ Settings atualizados localmente');
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
      const observacoesPayload = {
        igreja_id: igrejaAtiva,
        data: novasObservacoes.data,
        palavra_lida: novasObservacoes.palavraLida || null,
        hinos_cantados: novasObservacoes.hinosCantados || null,
        aprendizado: novasObservacoes.aprendizado || null,
      };

      console.log('📤 Salvando observações do culto:', observacoesPayload);

      const { data, error } = await supabase
        .from('culto_observacoes')
        .upsert(observacoesPayload, {
          onConflict: 'igreja_id,data', // Chave única composta
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erro detalhado:', error);
        throw error;
      }

      console.log('✅ Observações do culto salvas no Supabase:', data);

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

      console.log('✅ Estado local atualizado');
      
      // Registrar dia de uso automaticamente
      await get().registrarDiaDeUso();
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
      console.log('⚠️ Nenhuma observação de culto para salvar');
      return;
    }

    set({ isLoading: true, error: null });
    try {
      // Buscar as observações atualizadas do banco para ter a data correta
      const { data: obsAtual } = await supabase
        .from('culto_observacoes')
        .select('*')
        .eq('igreja_id', igrejaAtiva)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Usar a data das observações salvas, não a data atual
      const dataParaHistorico = obsAtual?.data || cultoObservacoes.data;

      const historicoPayload = {
        igreja_id: igrejaAtiva,
        data: dataParaHistorico,
        palavra_lida: obsAtual?.palavra_lida || cultoObservacoes.palavraLida || null,
        hinos_cantados: obsAtual?.hinos_cantados || cultoObservacoes.hinosCantados || null,
        aprendizado: obsAtual?.aprendizado || cultoObservacoes.aprendizado || null,
        total_criancas: children.length,
      };

      console.log('📤 Salvando culto no histórico (data:', dataParaHistorico + '):', historicoPayload);

      const { data, error } = await supabase
        .from('historico_cultos')
        .upsert(historicoPayload, {
          onConflict: 'igreja_id,data', // Chave única composta
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erro detalhado:', error);
        throw error;
      }

      console.log('✅ Culto salvo no histórico do Supabase (data ' + data.data + '):', data);
      
      // Recarregar histórico
      await get().loadIgrejaData(igrejaAtiva);
      
      console.log('✅ Histórico recarregado');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error('❌ Erro ao salvar culto no histórico:', error);
    }
  },

  criarCultoNoHistorico: async (data, observacoes, totalCriancas) => {
    const { igrejaAtiva } = get();
    if (!igrejaAtiva) {
      console.error('❌ Nenhuma igreja ativa');
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const historicoPayload = {
        igreja_id: igrejaAtiva,
        data: data,
        palavra_lida: observacoes.palavraLida || null,
        hinos_cantados: observacoes.hinosCantados || null,
        aprendizado: observacoes.aprendizado || null,
        total_criancas: totalCriancas,
      };

      console.log('📤 Criando novo culto no histórico:', historicoPayload);

      const { data: novoHistorico, error } = await supabase
        .from('historico_cultos')
        .upsert(historicoPayload, {
          onConflict: 'igreja_id,data',
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erro detalhado:', error);
        throw error;
      }

      console.log('✅ Novo culto criado no histórico:', novoHistorico);
      
      // Recarregar histórico
      await get().loadIgrejaData(igrejaAtiva);
      
      console.log('✅ Histórico recarregado');
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error('❌ Erro ao criar culto no histórico:', error);
      throw error;
    }
  },

  atualizarUltimoCultoHistorico: async (observacoes) => {
    const { igrejaAtiva, dadosPorIgreja } = get();
    if (!igrejaAtiva) {
      console.error('❌ Nenhuma igreja ativa');
      return;
    }

    const igrejaData = dadosPorIgreja[igrejaAtiva] || createDefaultIgrejaData();
    
    // Buscar o último culto do histórico
    const ultimoCulto = igrejaData.historicoCultos.length > 0
      ? [...igrejaData.historicoCultos].sort((a, b) => 
          new Date(b.data).getTime() - new Date(a.data).getTime()
        )[0]
      : null;

    if (!ultimoCulto) {
      console.error('❌ Nenhum culto no histórico para atualizar');
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const updatePayload = {
        palavra_lida: observacoes.palavraLida || null,
        hinos_cantados: observacoes.hinosCantados || null,
        aprendizado: observacoes.aprendizado || null,
      };

      console.log('📤 Atualizando último culto do histórico:', updatePayload);

      const { data, error } = await supabase
        .from('historico_cultos')
        .update(updatePayload)
        .eq('id', ultimoCulto.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro detalhado:', error);
        throw error;
      }

      console.log('✅ Último culto atualizado:', data);
      
      // Recarregar histórico
      await get().loadIgrejaData(igrejaAtiva);
      
      console.log('✅ Histórico recarregado');
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error('❌ Erro ao atualizar último culto:', error);
      throw error;
    }
  },

  registrarDiaDeUso: async () => {
    const { igrejaAtiva, dadosPorIgreja } = get();
    if (!igrejaAtiva) return;

    const igrejaData = dadosPorIgreja[igrejaAtiva] || createDefaultIgrejaData();
    const dataAtual = new Date().toISOString().split('T')[0];

    set({ isLoading: true, error: null });
    try {
      const diaUsoPayload = {
        igreja_id: igrejaAtiva,
        data: dataAtual,
        total_criancas: igrejaData.children.length,
        culto_realizado: !!(
          igrejaData.cultoObservacoes.palavraLida ||
          igrejaData.cultoObservacoes.hinosCantados ||
          igrejaData.cultoObservacoes.aprendizado
        ),
      };

      console.log('📤 Registrando dia de uso:', diaUsoPayload);

      const { error } = await supabase
        .from('dias_uso')
        .upsert(diaUsoPayload, {
          onConflict: 'igreja_id,data', // Chave única composta
        });

      if (error) {
        console.error('❌ Erro detalhado:', error);
        throw error;
      }

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
      // Inserir apenas o nome (id e datas são gerados automaticamente)
      const { data, error } = await supabase
        .from('igrejas')
        .insert({
          nome: igrejaData.nome,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erro detalhado ao cadastrar igreja:', error);
        throw error;
      }

      console.log('✅ Igreja cadastrada no Supabase:', data);

      // Criar settings padrão
      const { error: settingsError } = await supabase
        .from('settings')
        .insert({
          igreja_id: data.id,
          capacidade_maxima: 30,
        });

      if (settingsError) {
        console.error('❌ Erro ao criar settings:', settingsError);
      } else {
        console.log('✅ Settings criados automaticamente');
      }

      // Mapear snake_case para camelCase
      const igrejaLocal: Igreja = {
        id: data.id,
        nome: data.nome,
        dataCadastro: data.data_cadastro,
      };

      set((state) => ({
        igrejas: [...state.igrejas, igrejaLocal],
        isLoading: false,
      }));

      // Atualizar dados da igreja
      await get().loadIgrejaData(data.id);
      
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error('❌ Erro ao cadastrar igreja:', error);
      throw error; // Re-throw para o componente tratar
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

      // Mapear snake_case para camelCase
      const igrejaAtualizada: Igreja = {
        id: data.id,
        nome: data.nome,
        dataCadastro: data.data_cadastro,
      };

      set((state) => ({
        igrejas: state.igrejas.map((igreja) =>
          igreja.id === id ? igrejaAtualizada : igreja
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

  clearHistoricoCultos: async () => {
    const { igrejaAtiva } = get();
    if (!igrejaAtiva) return;

    set({ isLoading: true, error: null });
    try {
      // Remover todo o histórico de cultos da igreja
      const { error } = await supabase
        .from('historico_cultos')
        .delete()
        .eq('igreja_id', igrejaAtiva);

      if (error) throw error;

      // Atualizar estado local
      set((state) => {
        const igrejaData = state.dadosPorIgreja[igrejaAtiva] || createDefaultIgrejaData();
        return {
          dadosPorIgreja: {
            ...state.dadosPorIgreja,
            [igrejaAtiva]: {
              ...igrejaData,
              historicoCultos: [],
            },
          },
          isLoading: false,
        };
      });

      console.log('✅ Histórico de cultos limpo no Supabase');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error('❌ Erro ao limpar histórico de cultos:', error);
    }
  },

  removeCultoFromHistorico: async (cultoId) => {
    const { igrejaAtiva } = get();
    if (!igrejaAtiva) return;

    set({ isLoading: true, error: null });
    try {
      // Remover culto específico do histórico
      const { error } = await supabase
        .from('historico_cultos')
        .delete()
        .eq('id', cultoId)
        .eq('igreja_id', igrejaAtiva);

      if (error) throw error;

      // Atualizar estado local
      set((state) => {
        const igrejaData = state.dadosPorIgreja[igrejaAtiva] || createDefaultIgrejaData();
        return {
          dadosPorIgreja: {
            ...state.dadosPorIgreja,
            [igrejaAtiva]: {
              ...igrejaData,
              historicoCultos: igrejaData.historicoCultos.filter(culto => culto.id !== cultoId),
            },
          },
          isLoading: false,
        };
      });

      console.log('✅ Culto removido do histórico no Supabase');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error('❌ Erro ao remover culto do histórico:', error);
    }
  },
}));

