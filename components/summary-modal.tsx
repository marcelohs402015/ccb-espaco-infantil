'use client';

import { X, BookOpen, Users, Calendar } from 'lucide-react';
import type { HistoricoCulto } from '@/types';

interface SummaryModalProps {
  culto: HistoricoCulto | null;
  totalCriancas: number;
  onClose: () => void;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({ 
  culto, 
  totalCriancas, 
  onClose 
}) => {
  if (!culto) return null;

  const formatarData = (data: string): string => {
    const dataObj = new Date(data + 'T00:00:00');
    return dataObj.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-teal-600 p-4 flex justify-between items-center rounded-t-2xl">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">
              Resumo do Culto
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded-lg transition-colors"
            aria-label="Fechar resumo"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Data e Crianças */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border-2 border-green-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm font-semibold text-green-700 uppercase mb-1">Data do Culto</p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatarData(culto.data)}
                </p>
              </div>
              <div className="bg-white px-6 py-3 rounded-xl border-2 border-purple-200">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase">Crianças Presentes</p>
                    <p className="text-2xl font-black text-purple-600">
                      {totalCriancas}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Palavra Lida */}
          {culto.palavraLida && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Palavra Lida
              </label>
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 h-[4rem] overflow-y-auto">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {culto.palavraLida}
                </p>
              </div>
            </div>
          )}

          {/* Hinos Cantados */}
          {culto.hinosCantados && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Hinos Cantados
              </label>
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 h-[6rem] overflow-y-auto">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {culto.hinosCantados}
                </p>
              </div>
            </div>
          )}

          {/* Aprendizado */}
          {culto.aprendizado && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                O que as Crianças Aprenderam
              </label>
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 h-[9rem] overflow-y-auto">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {culto.aprendizado}
                </p>
              </div>
            </div>
          )}

          {/* Mensagem se não houver informações */}
          {!culto.palavraLida && !culto.hinosCantados && !culto.aprendizado && (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Nenhuma informação adicional registrada para este culto</p>
            </div>
          )}

          {/* Botão Fechar */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
            >
              Fechar Resumo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
