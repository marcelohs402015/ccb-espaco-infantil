'use client';

import { useState, useEffect } from 'react';
import { Plus, Settings, Users, BookOpen, Edit, Search, History, Church, FileText, Bell } from 'lucide-react';
import { useSpaceStore } from '@/store/use-space-store';
import { Header } from '@/components/header';
import { ChildListItem } from '@/components/child-list-item';
import { AddChildForm } from '@/components/add-child-form';
import { SettingsModal } from '@/components/settings-modal';
import { ObservationsModal } from '@/components/observations-modal';
import { GlobalAlert } from '@/components/global-alert';
import { HistoryModal } from '@/components/history-modal';
import { ChurchesModal } from '@/components/churches-modal';
import { ChurchSelector } from '@/components/church-selector';
import { EditLastCultoModal } from '@/components/edit-last-culto-modal';
import { ManagementButtons } from '@/components/management-buttons';
import { SummaryModal } from '@/components/summary-modal';
import { EmergencyNotification } from '@/components/emergency-notification';
import { NotificationPermissionModal } from '@/components/notification-permission-modal';
import { AlertModal } from '@/components/alert-modal';
import { GlobalAlertManager } from '@/components/global-alert-manager';
import { useModal } from '@/hooks/use-modal';
import { useRealtimeSync } from '@/hooks/use-realtime-sync';
import { useSyncState } from '@/hooks/use-sync-state';
import { useAutoRefresh } from '@/hooks/use-auto-refresh';
import type { Child } from '@/types';

export default function Home() {
  const { 
    addChild, 
    updateChild, 
    removeChild, 
    updateSettings, 
    updateCultoObservacoes, 
    registrarDiaDeUso, 
    igrejaAtiva, 
    dadosPorIgreja,
    igrejas,
    setIgrejaAtiva,
    loadIgrejas,
    loadIgrejaData,
    isLoading,
    error
  } = useSpaceStore();
  
  // Dados reativos da igreja ativa
  const igrejaData = (igrejaAtiva && dadosPorIgreja && dadosPorIgreja[igrejaAtiva]) 
    ? dadosPorIgreja[igrejaAtiva] 
    : {
        children: [],
        settings: { capacidadeMaxima: 30 },
        cultoObservacoes: { data: new Date().toISOString().split('T')[0], palavraLida: '', hinosCantados: '', aprendizado: '' },
        historicoCultos: [],
        diasDeUso: []
      };
  
  const { children, settings, cultoObservacoes, historicoCultos } = igrejaData;
  
  // Usar sempre o registro mais recente (ordenar por data se necessário)
  const dadosParaExibir = historicoCultos && historicoCultos.length > 0 
    ? [...historicoCultos].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0]
    : null;
  
  // Debug: mostrar qual registro está sendo usado
  console.log('🔍 Todos os históricos:', historicoCultos);
  console.log('🎯 Dados para exibir (mais recente):', dadosParaExibir);
  
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isObservationsOpen, setIsObservationsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isChurchesOpen, setIsChurchesOpen] = useState(false);
  const [isEditLastCultoOpen, setIsEditLastCultoOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [showLgpdCleanupModal, setShowLgpdCleanupModal] = useState(false);
  const [childToEdit, setChildToEdit] = useState<Child | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);
  const { showError } = useModal();
  const syncState = useSyncState();

  // Sistema de auto-refresh a cada 5 segundos (fallback)
  const autoRefresh = useAutoRefresh({
    enabled: true,
    interval: 5000, // 5 segundos
    pauseOnFocus: true, // Pausar quando aba não está ativa
    pauseOnError: true // Pausar temporariamente em caso de erro
  });

  // Configurar sincronização em tempo real
  useRealtimeSync({
    enabled: true,
    refreshDelay: 1000,
    onDataChange: () => {
      console.log('🔄 Dados atualizados via sincronização em tempo real');
    },
    onEmergencyTriggered: () => {
      console.log('🚨 Emergência detectada - todos os dispositivos serão notificados!');
      
      // Tocar som de alerta
      try {
        const audio = new Audio('/sounds/emergency-alert.mp3');
        audio.play().catch(() => {
          // Fallback para som do sistema se arquivo não existir
          console.log('🔊 Som de emergência ativado');
        });
      } catch (error) {
        console.log('🔊 Som de emergência ativado (fallback)');
      }
    }
  });

  // Marcar hidratação como completa
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Carregar igrejas quando o componente monta
  useEffect(() => {
    loadIgrejas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Detectar quando o app volta do lock screen e fazer refresh
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && igrejaAtiva) {
        console.log('📱 App voltou do lock screen - fazendo refresh dos dados');
        // Fazer refresh dos dados quando voltar do lock screen
        loadIgrejaData(igrejaAtiva);
      }
    };

    const handleFocus = () => {
      if (igrejaAtiva) {
        console.log('📱 App ganhou foco - fazendo refresh dos dados');
        loadIgrejaData(igrejaAtiva);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [igrejaAtiva, loadIgrejaData]);

  // Carregar dados da igreja ativa e registrar dia de uso
  useEffect(() => {
    if (igrejaAtiva) {
      loadIgrejaData(igrejaAtiva);
      registrarDiaDeUso();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [igrejaAtiva]);

  // Refresh automático dos dados a cada 30 segundos para manter sincronizado
  useEffect(() => {
    if (!igrejaAtiva) return;

    const interval = setInterval(() => {
      loadIgrejaData(igrejaAtiva);
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [igrejaAtiva]);

  // Detectar quando limpeza automática LGPD foi executada
  useEffect(() => {
    const { lgpdCleanupExecuted, setLgpdCleanupExecuted } = useSpaceStore.getState();

    if (lgpdCleanupExecuted && igrejaAtiva) {
      setShowLgpdCleanupModal(true);
      setLgpdCleanupExecuted(false); // Reset flag
    }
  }, [igrejaAtiva, dadosPorIgreja]);

  // Mostrar modal de notificações automaticamente após delay
  useEffect(() => {
    if (!isHydrated || !igrejaAtiva) return;

    // Verificar se permissão já foi concedida
    if ('Notification' in window && Notification.permission === 'granted') {
      return; // Já tem permissão, não mostrar modal
    }

    // Verificar se modal já foi mostrado antes
    const modalShown = localStorage.getItem('notification-modal-shown');
    if (modalShown === 'true') {
      return; // Já foi mostrado, não mostrar novamente
    }

    // Delay de 3 segundos após igreja estar ativa
    const timer = setTimeout(() => {
      setIsNotificationModalOpen(true);
      localStorage.setItem('notification-modal-shown', 'true');
    }, 3000);

    return () => clearTimeout(timer);
  }, [isHydrated, igrejaAtiva]);

  // Exibe automaticamente o modal de permissão de notificações após 3 s.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Não mostrar se o usuário já decidiu (granted/denied)
    if ('Notification' in window && Notification.permission !== 'default') return;

    // Evitar reabrir se já está aberto
    if (isNotificationModalOpen) return;

    // Evitar exibir mais de uma vez por dia (usa YYYY-MM-DD)
    const todayKey = new Date().toISOString().slice(0, 10);
    const lastPrompt = localStorage.getItem('notificationPromptDate');
    if (lastPrompt === todayKey) return;

    const timerId = setTimeout(() => {
      setIsNotificationModalOpen(true);
      localStorage.setItem('notificationPromptDate', todayKey);
    }, 3000);

    return () => clearTimeout(timerId);
  }, [isNotificationModalOpen]);

  // Listener para abrir modal de igrejas via evento
  useEffect(() => {
    const handleOpenChurches = (): void => {
      setIsChurchesOpen(true);
    };

    window.addEventListener('openChurchesModal', handleOpenChurches);
    return () => {
      window.removeEventListener('openChurchesModal', handleOpenChurches);
    };
  }, []);

  const capacidadeAtual = children.length;
  const capacidadeMaxima = settings?.capacidadeMaxima || 30;
  const percentualOcupacao = capacidadeMaxima > 0 ? (capacidadeAtual / capacidadeMaxima) * 100 : 0;

  const getCapacidadeColor = (): string => {
    if (percentualOcupacao >= 90) return 'text-red-600';
    if (percentualOcupacao >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleEditChild = (child: Child): void => {
    setChildToEdit(child);
    setIsAddFormOpen(true);
  };

  const handleSaveChild = async (child: Child): Promise<void> => {
    if (childToEdit) {
      await updateChild(child.id, child);
    } else {
      // Remove o id para que o Supabase gere automaticamente
      const { id, ...childData } = child;
      await addChild(childData);
    }
  };

  const handleCloseForm = (): void => {
    setIsAddFormOpen(false);
    setChildToEdit(null);
  };

  const handleAddNewChild = (): void => {
    if (capacidadeAtual >= capacidadeMaxima) {
      return; // Não permite adicionar se capacidade estiver cheia
    }
    setChildToEdit(null);
    setIsAddFormOpen(true);
  };

  const handleShowSummary = (): void => {
    if (!dadosParaExibir) {
      showError('Nenhum culto encontrado para exibir o resumo.');
      return;
    }
    setIsSummaryOpen(true);
  };

  const isCapacityFull = capacidadeAtual >= capacidadeMaxima;

  // Filtrar crianças baseado no termo de pesquisa
  const filteredChildren = children.filter(child =>
    child.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen">
      <Header />
      <GlobalAlert />
      
      <div className="container mx-auto px-4 py-8 relative">
        {/* Church Selector */}
        <ChurchSelector onOpenNotificationModal={() => setIsNotificationModalOpen(true)} />

        {/* Capacity Status */}
        {isHydrated && igrejaAtiva ? (
          <>
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border-4 border-purple-200 card-hover backdrop-blur-sm bg-opacity-95">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl shadow-lg animate-bounce-soft">
                <Users className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  Capacidade do Espaço
                </h2>
                <p className="text-base text-gray-600 font-medium">
                  🎈 Crianças presentes no momento
                </p>
              </div>
            </div>
            
            <div className="text-center bg-gradient-to-br from-purple-50 to-pink-50 px-8 py-4 rounded-2xl border-2 border-purple-200">
              <p className={`text-6xl font-black ${getCapacidadeColor()} drop-shadow-lg`}>
                {capacidadeAtual} / {capacidadeMaxima}
              </p>
              <p className="text-base text-gray-700 mt-2 font-semibold">
                {percentualOcupacao.toFixed(0)}% ocupado
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-2xl button-pop flex items-center gap-2"
                aria-label="Configurações"
              >
                <Settings className="w-6 h-6" />
                Configurar
              </button>
            </div>
          </div>
        </div>

        {/* Worship Summary */}
        <div className="bg-gradient-to-r from-green-100 to-teal-100 rounded-xl shadow-lg p-6 md:p-8 mb-8 border-2 border-green-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-7 h-7 text-green-700" />
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">Resumo do Culto</h3>
                {dadosParaExibir && (dadosParaExibir.palavraLida || dadosParaExibir.hinosCantados || dadosParaExibir.aprendizado) ? (
                  <p className="text-sm text-green-600 font-medium">
                    {new Date(dadosParaExibir.data + 'T00:00:00').toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })} - {new Date(dadosParaExibir.data + 'T00:00:00').toLocaleDateString('pt-BR', {
                      weekday: 'long'
                    })}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 font-medium">
                    Gerencie os registros de cultos
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button
                onClick={handleShowSummary}
                disabled={!dadosParaExibir}
                className="flex-1 sm:flex-none px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md disabled:cursor-not-allowed"
                aria-label="Ver resumo do culto"
              >
                <FileText className="w-5 h-5" />
                <span className="hidden sm:inline">Resumo do Culto</span>
                <span className="sm:hidden">Resumo</span>
              </button>
              <button
                onClick={() => setIsEditLastCultoOpen(true)}
                className="flex-1 sm:flex-none px-4 py-3 bg-blue-400 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
                aria-label="Editar último culto"
              >
                <Edit className="w-5 h-5" />
                Alterar
              </button>
            </div>
          </div>
          
          {historicoCultos && historicoCultos.length > 0 && (
            <div className="grid md:grid-cols-3 gap-6">
              {dadosParaExibir?.palavraLida && (
                <div>
                  <p className="text-sm font-bold text-green-700 uppercase mb-2">Palavra Lida</p>
                  <p className="text-base text-gray-800 bg-white p-4 rounded-lg border border-green-200 min-h-[80px] leading-relaxed">
                    {dadosParaExibir.palavraLida}
                  </p>
                </div>
              )}
              {dadosParaExibir?.hinosCantados && (
                <div>
                  <p className="text-sm font-bold text-green-700 uppercase mb-2">Hinos Cantados</p>
                  <p className="text-base text-gray-800 bg-white p-4 rounded-lg border border-green-200 min-h-[80px] leading-relaxed">
                    {dadosParaExibir.hinosCantados}
                  </p>
                </div>
              )}
              {dadosParaExibir?.aprendizado && (
                <div>
                  <p className="text-sm font-bold text-green-700 uppercase mb-2">Aprendizado</p>
                  <p className="text-base text-gray-800 bg-white p-4 rounded-lg border border-green-200 min-h-[80px] leading-relaxed">
                    {dadosParaExibir.aprendizado}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-6 mb-8">
          <button
            onClick={() => setIsObservationsOpen(true)}
            className="flex-1 min-w-[280px] px-8 py-6 bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 text-white font-black text-xl rounded-2xl hover:scale-105 transition-all shadow-2xl hover:shadow-green-500/50 button-pop flex items-center justify-center gap-3 border-4 border-white/30 relative overflow-hidden group"
          >
            <div className="absolute inset-0 gradient-shine"></div>
            <BookOpen className="w-8 h-8 group-hover:rotate-12 transition-transform" />
            <span className="relative z-10">📖 Sobre o Culto</span>
          </button>

          <button
            onClick={handleAddNewChild}
            disabled={isCapacityFull}
            className={`flex-1 min-w-[280px] px-8 py-6 font-black text-xl rounded-2xl transition-all shadow-2xl flex items-center justify-center gap-3 border-4 border-white/30 relative overflow-hidden group ${
              isCapacityFull
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed opacity-60'
                : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:scale-105 hover:shadow-purple-500/50 button-pop'
            }`}
            title={isCapacityFull ? `Capacidade máxima atingida (${capacidadeAtual}/${capacidadeMaxima})` : 'Adicionar nova criança'}
          >
            {!isCapacityFull && <div className="absolute inset-0 gradient-shine"></div>}
            <Plus className={`w-8 h-8 transition-transform ${!isCapacityFull ? 'group-hover:rotate-90' : ''}`} />
            <span className="relative z-10">
              {isCapacityFull ? '🚫 Capacidade Cheia' : '✨ Nova Criança'}
            </span>
          </button>

        </div>

        {/* Search Field */}
        {children.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-gray-100">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Pesquisar por nome da criança..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors text-gray-900 placeholder-gray-500"
              />
            </div>
            {searchTerm && (
              <p className="text-sm text-gray-600 mt-2">
                {filteredChildren.length === 0 
                  ? 'Nenhuma criança encontrada' 
                  : `${filteredChildren.length} criança${filteredChildren.length !== 1 ? 's' : ''} encontrada${filteredChildren.length !== 1 ? 's' : ''}`
                }
              </p>
            )}
          </div>
        )}

        {/* Children List */}
        {children.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl p-16 text-center border-4 border-dashed border-purple-300 card-hover backdrop-blur-sm bg-opacity-95">
            <div className="animate-float mb-6">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-full p-8 inline-block">
                <Users className="w-24 h-24 text-purple-400 mx-auto" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3">
              👶 Nenhuma criança cadastrada ainda
            </h3>
            <p className="text-gray-600 text-lg mb-8 font-medium">
              🎈 Clique no botão abaixo para adicionar a primeira criança
            </p>
            <button
              onClick={handleAddNewChild}
              disabled={isCapacityFull}
              className={`px-10 py-5 font-black text-xl rounded-2xl transition-all shadow-2xl inline-flex items-center gap-3 border-4 border-white/30 relative overflow-hidden group ${
                isCapacityFull
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:scale-110 hover:shadow-purple-500/50 button-pop'
              }`}
              title={isCapacityFull ? `Capacidade máxima atingida (${capacidadeAtual}/${capacidadeMaxima})` : 'Adicionar primeira criança'}
            >
              {!isCapacityFull && <div className="absolute inset-0 gradient-shine"></div>}
              <Plus className={`w-7 h-7 transition-transform ${!isCapacityFull ? 'group-hover:rotate-180' : ''}`} />
              <span className="relative z-10">
                {isCapacityFull ? '🚫 Capacidade Cheia' : 'Adicionar Primeira Criança'}
              </span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredChildren.length === 0 && searchTerm ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center border-2 border-gray-100">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  Nenhuma criança encontrada
                </h3>
                <p className="text-gray-500">
                  Tente pesquisar por outro nome ou limpe a pesquisa para ver todas as crianças.
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Limpar pesquisa
                </button>
              </div>
            ) : (
              filteredChildren.map((child) => (
                <ChildListItem
                  key={child.id}
                  child={child}
                  onRemove={removeChild}
                  onEdit={handleEditChild}
                />
              ))
            )}
          </div>
        )}

        {/* Management Buttons - No final, após a lista de crianças */}
        {isHydrated && igrejaAtiva && <ManagementButtons />}
        </>
        ) : null}
      </div>

      {isAddFormOpen && (
        <AddChildForm
          onAdd={handleSaveChild}
          onClose={handleCloseForm}
          childToEdit={childToEdit}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onUpdate={updateSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {isHistoryOpen && (
        <HistoryModal
          onClose={() => setIsHistoryOpen(false)}
        />
      )}

      {isChurchesOpen && (
        <ChurchesModal
          onClose={() => setIsChurchesOpen(false)}
        />
      )}

      {isObservationsOpen && (
        <ObservationsModal
          observacoes={cultoObservacoes}
          onUpdate={updateCultoObservacoes}
          onClose={() => setIsObservationsOpen(false)}
        />
      )}

      {isEditLastCultoOpen && (
        <EditLastCultoModal
          onClose={() => setIsEditLastCultoOpen(false)}
        />
      )}

      {isSummaryOpen && dadosParaExibir && (
        <SummaryModal
          culto={dadosParaExibir}
          totalCriancas={children.length}
          onClose={() => setIsSummaryOpen(false)}
        />
      )}

      {/* Notificação de Emergência em Tempo Real */}
      <EmergencyNotification />

      {/* Modal de Permissão de Notificações */}
      <NotificationPermissionModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />

      {/* Gerenciador de Alertas Globais */}
      <GlobalAlertManager />

      {/* Modal de Limpeza Automática LGPD */}
      {showLgpdCleanupModal && (
        <AlertModal
          title="Dados Limpos Automaticamente"
          message="Ontem esqueceram de apagar os dados desta igreja, mas já apaguei para manter a LGPD. A interface foi atualizada e está pronta para o novo dia!"
          type="info"
          onClose={() => {
            setShowLgpdCleanupModal(false);
            // Forçar refresh da interface
            if (igrejaAtiva) {
              loadIgrejaData(igrejaAtiva);
            }
          }}
        />
      )}
    </main>
  );
}

