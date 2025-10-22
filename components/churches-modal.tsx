'use client';

import { useState } from 'react';
import { X, Church, Plus, Edit2, Trash2 } from 'lucide-react';
import { useSpaceStore } from '@/store/use-space-store';
import type { Igreja } from '@/types';

interface ChurchesModalProps {
  onClose: () => void;
}

export const ChurchesModal: React.FC<ChurchesModalProps> = ({ onClose }) => {
  const { igrejas, addIgreja, updateIgreja, removeIgreja } = useSpaceStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [igrejaEditando, setIgrejaEditando] = useState<Igreja | null>(null);
  const [formData, setFormData] = useState({ id: '', nome: '' });
  const [erro, setErro] = useState('');

  const handleOpenForm = (igreja?: Igreja): void => {
    if (igreja) {
      setIgrejaEditando(igreja);
      setFormData({ id: igreja.id, nome: igreja.nome });
    } else {
      setIgrejaEditando(null);
      setFormData({ id: '', nome: '' });
    }
    setErro('');
    setIsFormOpen(true);
  };

  const handleCloseForm = (): void => {
    setIsFormOpen(false);
    setIgrejaEditando(null);
    setFormData({ id: '', nome: '' });
    setErro('');
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setErro('');

    // Validações
    if (!formData.id.trim()) {
      setErro('O ID da igreja é obrigatório');
      return;
    }

    if (!formData.nome.trim()) {
      setErro('O nome da igreja é obrigatório');
      return;
    }

    // Verifica se já existe uma igreja com o mesmo ID (apenas ao adicionar)
    if (!igrejaEditando) {
      const idJaExiste = igrejas.some(i => i.id === formData.id.trim());
      if (idJaExiste) {
        setErro('Já existe uma igreja cadastrada com este ID');
        return;
      }
    }

    if (igrejaEditando) {
      // Atualizar
      updateIgreja(igrejaEditando.id, {
        id: formData.id.trim(),
        nome: formData.nome.trim(),
      });
    } else {
      // Adicionar
      const novaIgreja: Igreja = {
        id: formData.id.trim(),
        nome: formData.nome.trim(),
        dataCadastro: new Date().toISOString(),
      };
      addIgreja(novaIgreja);
    }

    handleCloseForm();
  };

  const handleRemove = (id: string): void => {
    removeIgreja(id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 p-4 flex justify-between items-center rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Church className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Gerenciar Igrejas</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Botão Adicionar Nova Igreja */}
          {!isFormOpen && (
            <button
              onClick={() => handleOpenForm()}
              className="w-full mb-6 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg rounded-xl hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <Plus className="w-6 h-6" />
              Adicionar Nova Igreja
            </button>
          )}

          {/* Formulário de Cadastro/Edição */}
          {isFormOpen && (
            <form onSubmit={handleSubmit} className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 mb-6 border-2 border-blue-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {igrejaEditando ? 'Editar Igreja' : 'Nova Igreja'}
              </h3>

              {erro && (
                <div className="bg-red-100 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {erro}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="id" className="block text-sm font-semibold text-gray-700 mb-1">
                    ID da Igreja *
                  </label>
                  <input
                    type="text"
                    id="id"
                    value={formData.id}
                    onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                    disabled={!!igrejaEditando}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Ex: igreja-001, ccb-sp-centro"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Identificador único da igreja (não pode ser alterado após o cadastro)
                  </p>
                </div>

                <div>
                  <label htmlFor="nome" className="block text-sm font-semibold text-gray-700 mb-1">
                    Nome da Igreja *
                  </label>
                  <input
                    type="text"
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-900"
                    placeholder="Ex: CCB São Paulo - Centro, CCB Rio de Janeiro"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
                  >
                    {igrejaEditando ? 'Salvar' : 'Cadastrar'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Lista de Igrejas */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Church className="w-5 h-5 text-blue-600" />
              Igrejas Cadastradas ({igrejas.length})
            </h3>

            {igrejas.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <Church className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Nenhuma igreja cadastrada ainda</p>
                <p className="text-sm text-gray-400 mt-2">
                  Clique no botão acima para adicionar a primeira igreja
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {igrejas.map((igreja) => (
                  <div
                    key={igreja.id}
                    className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Church className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-gray-800">{igreja.nome}</h4>
                            <p className="text-sm text-gray-500">ID: {igreja.id}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400">
                          Cadastrada em: {new Date(igreja.dataCadastro).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenForm(igreja)}
                          className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                          title="Editar igreja"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleRemove(igreja.id)}
                          className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          title="Remover igreja"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
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
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

