'use client';

import { useState, useEffect } from 'react';
import { X, Edit } from 'lucide-react';
import { useSpaceStore } from '@/store/use-space-store';
import type { HistoricoCulto } from '@/types';

interface EditLastCultoModalProps {
  onClose: () => void;
}

export const EditLastCultoModal: React.FC<EditLastCultoModalProps> = ({ onClose }) => {
  const { atualizarUltimoCultoHistorico, dadosPorIgreja, igrejaAtiva } = useSpaceStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const igrejaData = (igrejaAtiva && dadosPorIgreja && dadosPorIgreja[igrejaAtiva]) 
    ? dadosPorIgreja[igrejaAtiva] 
    : { historicoCultos: [] };

  // Formatar data para exibição no formato brasileiro
  const formatarDataBrasileira = (dataISO: string): string => {
    const data = new Date(dataISO + 'T00:00:00');
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Buscar o último culto do histórico
  const ultimoCulto = igrejaData.historicoCultos.length > 0
    ? [...igrejaData.historicoCultos].sort((a, b) => 
        new Date(b.data).getTime() - new Date(a.data).getTime()
      )[0]
    : null;

  const [formData, setFormData] = useState({
    palavraLida: ultimoCulto?.palavraLida || '',
    hinosCantados: ultimoCulto?.hinosCantados || '',
    aprendizado: ultimoCulto?.aprendizado || '',
  });

  useEffect(() => {
    if (ultimoCulto) {
      setFormData({
        palavraLida: ultimoCulto.palavraLida || '',
        hinosCantados: ultimoCulto.hinosCantados || '',
        aprendizado: ultimoCulto.aprendizado || '',
      });
    }
  }, [ultimoCulto]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!ultimoCulto) {
      // Modal já é exibido pelo early return abaixo
      return;
    }

    setIsLoading(true);
    
    try {
      await atualizarUltimoCultoHistorico({
        palavraLida: formData.palavraLida,
        hinosCantados: formData.hinosCantados,
        aprendizado: formData.aprendizado,
      });
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar culto:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!ultimoCulto) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Nenhum culto registrado
            </h3>
            <p className="text-gray-600 mb-4">
              Não há nenhum registro de culto no histórico para editar. Crie um novo registro primeiro.
            </p>
            <p className="text-gray-600 mb-6">
              Clique no botão sobre o culto para gerar os registros.
            </p>
            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-teal-600 p-4 flex justify-between items-center rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Edit className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Editar Último Culto</h2>
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
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-green-800 font-semibold">
              📅 Editando culto de: {formatarDataBrasileira(ultimoCulto.data)} ({new Date(ultimoCulto.data + 'T00:00:00').toLocaleDateString('pt-BR', {
                weekday: 'long'
              })})
            </p>
            <p className="text-xs text-green-700 mt-1">
              Total de crianças: {ultimoCulto.totalCriancas}
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
              disabled={isLoading}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Edit className="w-5 h-5" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

