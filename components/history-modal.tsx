'use client';

import { useState } from 'react';
import { X, BookOpen, Calendar, Users, TrendingUp, Eye } from 'lucide-react';
import { useSpaceStore } from '@/store/use-space-store';
import type { HistoricoCulto } from '@/types';

interface HistoryModalProps {
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ onClose }) => {
  const { historicoCultos, diasDeUso } = useSpaceStore();
  const [cultoDetalhado, setCultoDetalhado] = useState<HistoricoCulto | null>(null);

  // Ordenar histórico por data (mais recente primeiro)
  const historicosOrdenados = [...historicoCultos].sort((a, b) => 
    new Date(b.data).getTime() - new Date(a.data).getTime()
  );

  // Ordenar dias de uso por data (mais recente primeiro)
  const diasOrdenados = [...diasDeUso].sort((a, b) => 
    new Date(b.data).getTime() - new Date(a.data).getTime()
  );

  const formatarData = (data: string): string => {
    return new Date(data).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalCultosRealizados = historicoCultos.length;
  const totalDiasDeUso = diasDeUso.length;
  const mediaCriancasPorCulto = historicoCultos.length > 0
    ? Math.round(historicoCultos.reduce((sum, h) => sum + h.totalCriancas, 0) / historicoCultos.length)
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex justify-between items-center rounded-t-2xl">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">
              Histórico de Cultos e Uso do Sistema
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded-lg transition-colors"
            aria-label="Fechar histórico"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Estatísticas Resumidas */}
        <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BookOpen className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm font-semibold text-gray-600">Cultos Realizados</p>
              </div>
              <p className="text-3xl font-black text-green-600">{totalCultosRealizados}</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm font-semibold text-gray-600">Dias de Uso</p>
              </div>
              <p className="text-3xl font-black text-blue-600">{totalDiasDeUso}</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-sm font-semibold text-gray-600">Média de Crianças</p>
              </div>
              <p className="text-3xl font-black text-purple-600">{mediaCriancasPorCulto}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Histórico de Cultos */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-800">Histórico de Cultos</h3>
            </div>

            {historicosOrdenados.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Nenhum culto registrado ainda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {historicosOrdenados.map((culto) => (
                  <div
                    key={culto.id}
                    className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-5 border-2 border-green-200 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-bold text-green-700">
                        {formatarData(culto.data)}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full">
                          <Users className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-bold text-purple-600">
                            {culto.totalCriancas} {culto.totalCriancas === 1 ? 'criança' : 'crianças'}
                          </span>
                        </div>
                        <button
                          onClick={() => setCultoDetalhado(culto)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
                          aria-label="Ver detalhes do culto"
                        >
                          <Eye className="w-4 h-4" />
                          Ver Detalhes
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      {culto.palavraLida && (
                        <div>
                          <p className="text-xs font-bold text-green-700 uppercase mb-1">Palavra Lida</p>
                          <p className="text-sm text-gray-800 bg-white p-3 rounded-lg border border-green-200 truncate">
                            {culto.palavraLida}
                          </p>
                        </div>
                      )}
                      {culto.hinosCantados && (
                        <div>
                          <p className="text-xs font-bold text-green-700 uppercase mb-1">Hinos Cantados</p>
                          <p className="text-sm text-gray-800 bg-white p-3 rounded-lg border border-green-200 truncate">
                            {culto.hinosCantados}
                          </p>
                        </div>
                      )}
                      {culto.aprendizado && (
                        <div>
                          <p className="text-xs font-bold text-green-700 uppercase mb-1">Aprendizado</p>
                          <p className="text-sm text-gray-800 bg-white p-3 rounded-lg border border-green-200 truncate">
                            {culto.aprendizado}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Histórico de Dias de Uso */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-800">Dias de Uso do Sistema</h3>
            </div>

            {diasOrdenados.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Nenhum dia registrado ainda</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {diasOrdenados.map((dia, index) => (
                  <div
                    key={index}
                    className={`rounded-lg p-4 border-2 ${
                      dia.cultoRealizado
                        ? 'bg-green-50 border-green-300'
                        : 'bg-blue-50 border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className={`w-4 h-4 ${dia.cultoRealizado ? 'text-green-600' : 'text-blue-600'}`} />
                      <p className="text-xs font-bold text-gray-700">
                        {new Date(dia.data).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-semibold text-gray-700">
                          {dia.totalCriancas} {dia.totalCriancas === 1 ? 'criança' : 'crianças'}
                        </span>
                      </div>
                      {dia.cultoRealizado && (
                        <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-bold">
                          Culto
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
          >
            Fechar
          </button>
        </div>
      </div>

      {/* Modal de Detalhes do Culto */}
      {cultoDetalhado && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-teal-600 p-4 flex justify-between items-center rounded-t-2xl">
              <div className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">
                  Detalhes do Culto
                </h2>
              </div>
              <button
                onClick={() => setCultoDetalhado(null)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded-lg transition-colors"
                aria-label="Fechar detalhes"
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
                      {formatarData(cultoDetalhado.data)}
                    </p>
                  </div>
                  <div className="bg-white px-6 py-3 rounded-xl border-2 border-purple-200">
                    <div className="flex items-center gap-3">
                      <Users className="w-6 h-6 text-purple-600" />
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase">Crianças Presentes</p>
                        <p className="text-2xl font-black text-purple-600">
                          {cultoDetalhado.totalCriancas}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Palavra Lida */}
              {cultoDetalhado.palavraLida && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Palavra Lida
                  </label>
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {cultoDetalhado.palavraLida}
                    </p>
                  </div>
                </div>
              )}

              {/* Hinos Cantados */}
              {cultoDetalhado.hinosCantados && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Hinos Cantados
                  </label>
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {cultoDetalhado.hinosCantados}
                    </p>
                  </div>
                </div>
              )}

              {/* Aprendizado */}
              {cultoDetalhado.aprendizado && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    O que as Crianças Aprenderam
                  </label>
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {cultoDetalhado.aprendizado}
                    </p>
                  </div>
                </div>
              )}

              {/* Mensagem se não houver informações */}
              {!cultoDetalhado.palavraLida && !cultoDetalhado.hinosCantados && !cultoDetalhado.aprendizado && (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Nenhuma informação adicional registrada para este culto</p>
                </div>
              )}

              {/* Botão Fechar */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setCultoDetalhado(null)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
                >
                  Fechar Detalhes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

