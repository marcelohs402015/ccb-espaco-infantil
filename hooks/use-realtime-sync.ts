/**
 * Hook para Sincronização em Tempo Real
 * CCB Espaço Infantil - Usando Supabase Realtime
 */

import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useSpaceStore } from '@/store/use-space-store';
import { useSyncState } from './use-sync-state';

interface RealtimeSyncOptions {
  enabled?: boolean;
  refreshDelay?: number;
  onDataChange?: () => void;
  onEmergencyTriggered?: () => void;
}

export const useRealtimeSync = (options: RealtimeSyncOptions = {}) => {
  const {
    enabled = true,
    refreshDelay = 1000,
    onDataChange,
    onEmergencyTriggered
  } = options;

  const { igrejaAtiva, loadIgrejaData, loadIgrejas } = useSpaceStore();
  const { setConnected, setSyncing, setLastSync, setError } = useSyncState();
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);
  const lastEmergencyRef = useRef<string | null>(null);

  // Função para fazer refresh dos dados
  const refreshData = useCallback(async () => {
    if (!igrejaAtiva) return;
    
    setSyncing(true);
    try {
      await Promise.all([
        loadIgrejas(),
        loadIgrejaData(igrejaAtiva)
      ]);
      
      setLastSync(new Date());
      setConnected(true);
      
      if (onDataChange) {
        onDataChange();
      }
    } catch (error) {
      console.error('❌ Erro ao fazer refresh dos dados:', error);
      setError('Erro ao sincronizar dados');
      setConnected(false);
    }
  }, [igrejaAtiva, loadIgrejas, loadIgrejaData, onDataChange, setSyncing, setLastSync, setConnected, setError]);

  // Função para refresh com delay
  const refreshWithDelay = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    
    refreshTimeoutRef.current = setTimeout(() => {
      refreshData();
    }, refreshDelay);
  }, [refreshData, refreshDelay]);

  // Função para refresh imediato (emergências)
  const refreshImmediate = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    refreshData();
  }, [refreshData]);

  // Configurar listeners do Supabase Realtime
  useEffect(() => {
    if (!enabled || !igrejaAtiva) return;

    console.log('🔄 Configurando sincronização em tempo real para igreja:', igrejaAtiva);

    // Listener para mudanças em crianças
    const childrenChannel = supabase
      .channel(`children-${igrejaAtiva}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'criancas',
          filter: `igreja_id=eq.${igrejaAtiva}`
        },
        (payload) => {
          console.log('👶 Mudança detectada em crianças:', payload);
          
          // Se for uma emergência (isChamadoAtivo = true)
          if (payload.new && (payload.new as any).is_chamado_ativo) {
            const childId = (payload.new as any).id;
            const childName = (payload.new as any).nome;
            const responsavelName = (payload.new as any).responsavel_nome;
            const responsavelPhone = (payload.new as any).responsavel_telefone;
            
            if (childId !== lastEmergencyRef.current) {
              lastEmergencyRef.current = childId;
              console.log('🚨 EMERGÊNCIA DETECTADA - Refresh imediato!', {
                childId,
                childName,
                responsavelName,
                responsavelPhone
              });
              
              // Refresh imediato para todos os dispositivos
              refreshImmediate();
              
              // Disparar evento customizado para notificação de emergência
              window.dispatchEvent(new CustomEvent('emergency-triggered', {
                detail: {
                  childId,
                  childName,
                  responsavelName,
                  responsavelPhone,
                  timestamp: new Date().toISOString()
                }
              }));
              
              if (onEmergencyTriggered) {
                onEmergencyTriggered();
              }
            }
          } else {
            // Outras mudanças - refresh com delay
            refreshWithDelay();
          }
        }
      );

    // Listener para mudanças em cultos
    const cultosChannel = supabase
      .channel(`cultos-${igrejaAtiva}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'historico_cultos',
          filter: `igreja_id=eq.${igrejaAtiva}`
        },
        (payload) => {
          console.log('📖 Mudança detectada em cultos:', payload);
          refreshWithDelay();
        }
      );

    // Listener para mudanças em observações de culto
    const observacoesChannel = supabase
      .channel(`observacoes-${igrejaAtiva}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'culto_observacoes',
          filter: `igreja_id=eq.${igrejaAtiva}`
        },
        (payload) => {
          console.log('📝 Mudança detectada em observações:', payload);
          refreshWithDelay();
        }
      );

    // Listener para mudanças em configurações
    const settingsChannel = supabase
      .channel(`settings-${igrejaAtiva}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'configuracoes',
          filter: `igreja_id=eq.${igrejaAtiva}`
        },
        (payload) => {
          console.log('⚙️ Mudança detectada em configurações:', payload);
          refreshWithDelay();
        }
      );

    // Listener para mudanças em igrejas
    const igrejasChannel = supabase
      .channel('igrejas-global')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'igrejas'
        },
        (payload) => {
          console.log('🏛️ Mudança detectada em igrejas:', payload);
          refreshWithDelay();
        }
      );

    // Subscrever aos canais
    childrenChannel.subscribe();
    cultosChannel.subscribe();
    observacoesChannel.subscribe();
    settingsChannel.subscribe();
    igrejasChannel.subscribe();

    // Cleanup function
    return () => {
      console.log('🧹 Limpando listeners de sincronização');
      childrenChannel.unsubscribe();
      cultosChannel.unsubscribe();
      observacoesChannel.unsubscribe();
      settingsChannel.unsubscribe();
      igrejasChannel.unsubscribe();
      
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [enabled, igrejaAtiva, refreshWithDelay, refreshImmediate, onEmergencyTriggered]);

  // Refresh inicial quando a igreja muda
  useEffect(() => {
    if (igrejaAtiva && isInitialLoadRef.current) {
      console.log('🚀 Primeira entrada - fazendo refresh inicial');
      refreshData();
      isInitialLoadRef.current = false;
    }
  }, [igrejaAtiva, refreshData]);

  // Cleanup no unmount
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  return {
    refreshData,
    refreshWithDelay,
    refreshImmediate,
    isEnabled: enabled
  };
};
