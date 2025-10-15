'use client';

import { useState } from 'react';
import { Trash2, FileText, AlertTriangle } from 'lucide-react';
import { useSpaceStore } from '@/store/use-space-store';
import { SummaryModal } from './summary-modal';
import { ClearDataModal } from './clear-data-modal';
import { SelectChurchModal } from './select-church-modal';
import { GenericModal } from './generic-modal';
import { useModal } from '@/hooks/use-modal';

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
  const { modalState, showSuccess, showError, showInfo, hideModal } = useModal();

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

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          Gerenciamento de Dados
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Botão Limpar Dados */}
          <button
            onClick={handleClearData}
            disabled={isLoading}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg disabled:cursor-not-allowed"
          >
            <Trash2 className="w-5 h-5" />
            <span>Limpar Dados</span>
          </button>

          {/* Botão Resumo */}
          <button
            onClick={handleShowSummary}
            disabled={isLoading || !cultoMaisRecente}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg disabled:cursor-not-allowed"
          >
            <FileText className="w-5 h-5" />
            <span>Resumo</span>
          </button>
        </div>

        {/* Informações adicionais */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Limpar Dados:</strong> Remove todas as crianças, histórico de cultos e registros de uso da igreja selecionada.
          </p>
          <p className="text-sm text-gray-600 mt-1">
            <strong>Resumo:</strong> Exibe o resumo do culto mais recente com todas as informações registradas.
          </p>
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
    </>
  );
};
