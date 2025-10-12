'use client';

import { useState } from 'react';
import { X, BookOpen } from 'lucide-react';
import { useSpaceStore } from '@/store/use-space-store';
import type { CultoObservacoes } from '@/types';

interface ObservationsModalProps {
  observacoes: CultoObservacoes;
  onUpdate: (observacoes: CultoObservacoes) => void;
  onClose: () => void;
}

export const ObservationsModal: React.FC<ObservationsModalProps> = ({ 
  observacoes, 
  onUpdate, 
  onClose 
}) => {
  // Formatar data para o padrão brasileiro DD/MM/YYYY
  const formatarDataParaExibicao = (dataISO: string): string => {
    if (!dataISO) return '';
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  // Converter data do formato DD/MM/YYYY para ISO YYYY-MM-DD
  const converterDataParaISO = (dataBR: string): string => {
    if (!dataBR || dataBR.length !== 10) return '';
    const [dia, mes, ano] = dataBR.split('/');
    return `${ano}-${mes}-${dia}`;
  };

  // Sempre usar a data atual do sistema operacional
  const obterDataAtual = (): string => {
    const hoje = new Date();
    const dia = hoje.getDate().toString().padStart(2, '0');
    const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
    const ano = hoje.getFullYear().toString();
    return `${dia}/${mes}/${ano}`;
  };
  
  const [formData, setFormData] = useState<CultoObservacoes>({
    ...observacoes,
    data: obterDataAtual()
  });
  const { criarCultoNoHistorico, dadosPorIgreja, igrejaAtiva } = useSpaceStore();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    try {
      // Converter data de volta para ISO antes de salvar
      const dataISO = converterDataParaISO(formData.data);
      
      console.log('🔍 Data do formulário (DD/MM/YYYY):', formData.data);
      console.log('🔍 Data convertida para ISO (YYYY-MM-DD):', dataISO);
      
      // Obter total de crianças
      const igrejaData = (igrejaAtiva && dadosPorIgreja && dadosPorIgreja[igrejaAtiva]) 
        ? dadosPorIgreja[igrejaAtiva] 
        : { children: [] };
      
      // Usar criarCultoNoHistorico para salvar APENAS no historico_cultos
      await criarCultoNoHistorico(
        dataISO,
        {
          palavraLida: formData.palavraLida,
          hinosCantados: formData.hinosCantados,
          aprendizado: formData.aprendizado,
        },
        igrejaData.children.length
      );
      
      console.log('✅ Culto criado APENAS no historico_cultos');
      onClose();
    } catch (error) {
      console.error('❌ Erro ao criar culto:', error);
      alert('Erro ao criar registro. Verifique se a data está no formato correto (DD/MM/AAAA).');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    
    // Se mudou a data, limpar os campos de conteúdo
    if (name === 'data' && value !== formData.data) {
      setFormData({
        data: value,
        palavraLida: '',
        hinosCantados: '',
        aprendizado: '',
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-teal-600 p-4 flex justify-between items-center rounded-t-2xl">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Criar Registro de Culto</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded-lg transition-colors"
            aria-label="Fechar observações"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="data" className="block text-sm font-semibold text-gray-700 mb-1">
              Data do Culto (DD/MM/AAAA)
            </label>
            <input
              type="text"
              id="data"
              name="data"
              value={formData.data}
              onChange={handleInputChange}
              placeholder="DD/MM/AAAA"
              maxLength={10}
              pattern="\d{2}/\d{2}/\d{4}"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors text-gray-900"
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
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors resize-none text-gray-900"
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
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors resize-none text-gray-900"
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
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors resize-none text-gray-900"
              placeholder="Ex: As crianças aprenderam sobre o amor de Deus e a importância da oração..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
            >
              Criar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

