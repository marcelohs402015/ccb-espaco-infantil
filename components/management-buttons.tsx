'use client';

import { useState } from 'react';
import { Trash2, FileText, AlertTriangle, Smartphone } from 'lucide-react';
import { useSpaceStore } from '@/store/use-space-store';
import { SummaryModal } from './summary-modal';
import { ClearDataModal } from './clear-data-modal';
import { SelectChurchModal } from './select-church-modal';
import { GenericModal } from './generic-modal';
import { useModal } from '@/hooks/use-modal';
import { usePWAInstall } from '@/hooks/use-pwa-install';
import { IOSInstallInstructions } from './ios-install-instructions';

export const ManagementButtons: React.FC = () => {
  const { 
    igrejaAtiva, 
    igrejas, 
    dadosPorIgreja, 
    limparDadosIgreja,
    verificarSeExistemDados,
    isLoading 
  } = useSpaceStore();

  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isClearDataOpen, setIsClearDataOpen] = useState(false);
  const [isSelectChurchOpen, setIsSelectChurchOpen] = useState(false);
  const [isIOSModalOpen, setIsIOSModalOpen] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const { modalState, showSuccess, showError, showInfo, hideModal } = useModal();
  
  // Hook PWA
  const { 
    shouldShowPrompt, 
    isIOS, 
    isAndroid,
    isDesktop,
    promptInstall, 
    dismissPrompt,
    isClient
  } = usePWAInstall();

  // Dados da igreja ativa
  const igrejaData = (igrejaAtiva && dadosPorIgreja && dadosPorIgreja[igrejaAtiva]) 
    ? dadosPorIgreja[igrejaAtiva] 
    : {
        children: [],
        historicoCultos: [],
        cultoObservacoes: { data: '', palavraLida: '', hinosCantados: '', aprendizado: '' }
      };

  const { children, historicoCultos, cultoObservacoes } = igrejaData;

  // Encontrar o culto mais recente
  const cultoMaisRecente = historicoCultos && historicoCultos.length > 0 
    ? [...historicoCultos].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0]
    : null;

  // Nome da igreja ativa
  const igrejaAtivaNome = igrejas.find(i => i.id === igrejaAtiva)?.nome || 'Igreja Selecionada';

  const handleClearData = async (): Promise<void> => {
    console.log('🔴 Botão Limpar Dados clicado!');
    
    if (!igrejaAtiva) {
      console.log('❌ Nenhuma igreja ativa selecionada');
      setIsSelectChurchOpen(true);
      return;
    }

    console.log('🏢 Igreja ativa:', igrejaAtiva);

    try {
      // Verificar se existem dados antes de abrir o modal
      console.log('🔍 Iniciando verificação de dados...');
      const existemDados = await verificarSeExistemDados(igrejaAtiva);
      console.log('📊 Resultado da verificação:', existemDados);
      
      if (!existemDados) {
        // Se não existem dados, mostrar modal informativo
        console.log('ℹ️ Não existem dados - mostrando modal informativo');
        showInfo('Não existem dados para apagar!');
        return;
      }

      // Se existem dados, abrir modal de confirmação
      console.log('✅ Existem dados - abrindo modal de confirmação');
      setIsClearDataOpen(true);
    } catch (error: any) {
      console.error('❌ Erro ao verificar dados:', error);
      showError('Erro ao verificar dados: ' + error.message);
    }
  };

  const handleConfirmClearData = async (): Promise<void> => {
    try {
      const dadosForamLimpados = await limparDadosIgreja();
      setIsClearDataOpen(false);
      
      if (dadosForamLimpados) {
        showSuccess('Dados limpos com sucesso!');
      } else {
        showInfo('Dados da igreja selecionada já limpos.');
      }
    } catch (error: any) {
      console.error('❌ Erro ao limpar dados:', error);
      showError('Erro ao limpar dados: ' + error.message);
    }
  };

  const handleShowSummary = (): void => {
    if (!cultoMaisRecente) {
      showError('Nenhum culto encontrado para exibir o resumo.');
      return;
    }
    setIsSummaryOpen(true);
  };

  const handleInstallApp = async () => {
    if (isIOS) {
      // Mostrar instruções para iOS
      setIsIOSModalOpen(true);
      return;
    }

    // Android/Desktop: Usar prompt nativo
    setIsInstalling(true);
    try {
      const success = await promptInstall();
      if (success) {
        showSuccess('App instalado com sucesso!');
      }
    } catch (error: any) {
      showError('Erro ao instalar app: ' + error.message);
    } finally {
      setIsInstalling(false);
    }
  };

  const getPlatformText = () => {
    if (isIOS) return 'Como Instalar no iPhone/iPad';
    if (isAndroid) return 'Instalar no Android';
    if (isDesktop) return 'Instalar na Área de Trabalho';
    return 'Instalar Aplicativo';
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 mt-8">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          Gerenciamento de Dados
        </h3>
        
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Botões - Lado Esquerdo */}
          <div className="flex-shrink-0">
            {/* Botão Limpar Dados */}
            <button
              onClick={handleClearData}
              disabled={isLoading}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg disabled:cursor-not-allowed"
            >
              <Trash2 className="w-5 h-5" />
              <span>Limpar Dados</span>
            </button>
            
            {/* Botão Instalar App - Desktop: embaixo, Mobile: ao lado */}
            {isClient && shouldShowPrompt && (
              <button
                onClick={handleInstallApp}
                disabled={isInstalling}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-400 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed mt-3 lg:mt-3"
              >
                {isInstalling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="text-sm">Instalando...</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-4 h-4" />
                    <span className="text-sm">📱 CCB Infantil</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Informações sobre LGPD - Lado Direito */}
          <div className="flex-1">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-800 mb-2">
                    Proteção de Dados (LGPD)
                  </h4>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    Em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD)</strong>, 
                    este aplicativo foi desenvolvido com foco total na sua segurança. A 
                    <strong> Congregação Cristã no Brasil (CCB)</strong> prioriza a privacidade 
                    dos seus membros. Por isso, a função &apos;Limpar dados&apos; é acionada automaticamente 
                    após o término de cada culto, assegurando que quaisquer dados temporários sejam 
                    imediatamente eliminados e que a sua informação particular permaneça protegida.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modais */}
      {isSummaryOpen && cultoMaisRecente && (
        <SummaryModal
          culto={cultoMaisRecente}
          totalCriancas={children.length}
          onClose={() => setIsSummaryOpen(false)}
        />
      )}

      {isClearDataOpen && (
        <ClearDataModal
          igrejaNome={igrejaAtivaNome}
          onConfirm={handleConfirmClearData}
          onCancel={() => setIsClearDataOpen(false)}
        />
      )}

      {isSelectChurchOpen && (
        <SelectChurchModal
          onClose={() => setIsSelectChurchOpen(false)}
        />
      )}

      <GenericModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        onClose={hideModal}
      />

      {/* Modal de Instruções iOS */}
      {isIOSModalOpen && (
        <IOSInstallInstructions onClose={() => setIsIOSModalOpen(false)} />
      )}
    </>
  );
};
