'use client';

import { useState } from 'react';
import { X, BookOpen, Plus } from 'lucide-react';
import { useSpaceStore } from '@/store/use-space-store';
import { AlertModal } from './alert-modal';

interface CreateCultoModalProps {
  onClose: () => void;
}

export const CreateCultoModal: React.FC<CreateCultoModalProps> = ({ onClose }) => {
  const { criarCultoNoHistorico, dadosPorIgreja, igrejaAtiva } = useSpaceStore();
  const [isLoading, setIsLoading] = useState(false);
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });
  
  const igrejaData = (igrejaAtiva && dadosPorIgreja && dadosPorIgreja[igrejaAtiva]) 
    ? dadosPorIgreja[igrejaAtiva] 
    : { children: [] };

  // Converter data do formato DD/MM/YYYY para ISO YYYY-MM-DD
  const converterDataParaISO = (dataBR: string): string => {
    const [dia, mes, ano] = dataBR.split('/');
    // Garantir que dia e mês tenham 2 dígitos
    const diaFormatado = dia.padStart(2, '0');
    const mesFormatado = mes.padStart(2, '0');
    const result = `${ano}-${mesFormatado}-${diaFormatado}`;
    console.log(`🔄 Convertendo ${dataBR} → ${result}`);
    return result;
  };

  // Sempre usar a data atual do sistema operacional
  const obterDataAtual = (): string => {
    const hoje = new Date();
    const dia = hoje.getDate().toString().padStart(2, '0');
    const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
    const ano = hoje.getFullYear().toString();
    return `${dia}/${mes}/${ano}`;
  };
  
  const [formData, setFormData] = useState({
    data: obterDataAtual(),
    palavraLida: '',
    hinosCantados: '',
    aprendizado: '',
  });

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Converter data para formato ISO antes de salvar
      const dataISO = converterDataParaISO(formData.data);
      
      console.log('🔍 Data do formulário (DD/MM/YYYY):', formData.data);
      console.log('🔍 Data convertida para ISO (YYYY-MM-DD):', dataISO);
      
      await criarCultoNoHistorico(
        dataISO,
        {
          palavraLida: formData.palavraLida,
          hinosCantados: formData.hinosCantados,
          aprendizado: formData.aprendizado,
        },
        igrejaData.children.length
      );
      onClose();
    } catch (error) {
      console.error('Erro ao criar culto:', error);
      setAlertModal({
        isOpen: true,
        title: 'Erro ao Criar Registro',
        message: 'Erro ao criar registro. Verifique se a data está no formato correto (DD/MM/AAAA) e tente novamente.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Plus className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Criar Novo Registro de Culto</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded-lg transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800 font-semibold">
              ℹ️ Este registro será salvo no histórico de cultos com a data escolhida abaixo.
            </p>
          </div>

          <div>
            <label htmlFor="data" className="block text-sm font-semibold text-gray-700 mb-1">
              Data do Culto * (DD/MM/AAAA)
            </label>
            <input
              type="text"
              id="data"
              name="data"
              value={formData.data}
              onChange={handleInputChange}
              required
              placeholder="DD/MM/AAAA"
              maxLength={10}
              pattern="\d{2}/\d{2}/\d{4}"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-900"
              onKeyPress={(e) => {
                const char = e.key;
                const value = e.currentTarget.value;
                
                // Permitir apenas números e /
                if (!/[\d/]/.test(char)) {
                  e.preventDefault();
                  return;
                }
                
                // Auto-adicionar barras
                if (char !== '/' && (value.length === 2 || value.length === 5)) {
                  const target = e.currentTarget;
                  setTimeout(() => {
                    target.value = value + '/' + char;
                    setFormData(prev => ({ ...prev, data: target.value }));
                  }, 0);
                  e.preventDefault();
                }
              }}
            />
            <p className="text-xs text-gray-500 mt-1">
              Formato: Dia/Mês/Ano (ex: 11/10/2025)
            </p>
          </div>

          <div>
            <label htmlFor="palavraLida" className="block text-sm font-semibold text-gray-700 mb-1">
              Palavra Lida
            </label>
            <textarea
              id="palavraLida"
              name="palavraLida"
              value={formData.palavraLida}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none text-gray-900"
              placeholder="Ex: João 3:16 - Porque Deus amou o mundo..."
            />
          </div>

          <div>
            <label htmlFor="hinosCantados" className="block text-sm font-semibold text-gray-700 mb-1">
              Hinos Cantados
            </label>
            <textarea
              id="hinosCantados"
              name="hinosCantados"
              value={formData.hinosCantados}
              onChange={handleInputChange}
              rows={5}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none text-gray-900"
              placeholder="Ex: Hino 5, Hino 12, Hino 23"
            />
          </div>

          <div>
            <label htmlFor="aprendizado" className="block text-sm font-semibold text-gray-700 mb-1">
              O que as Crianças Aprenderam
            </label>
            <textarea
              id="aprendizado"
              name="aprendizado"
              value={formData.aprendizado}
              onChange={handleInputChange}
              rows={9}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none text-gray-900"
              placeholder="Ex: As crianças aprenderam sobre o amor de Deus e a importância da oração..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Criar Registro
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Modal de Alerta Elegante */}
      {alertModal.isOpen && (
        <AlertModal
          title={alertModal.title}
          message={alertModal.message}
          type={alertModal.type}
          onClose={() => setAlertModal(prev => ({ ...prev, isOpen: false }))}
        />
      )}
    </div>
  );
};

