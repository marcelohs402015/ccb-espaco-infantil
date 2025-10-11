'use client';

import { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import type { Child, ResponsavelType } from '@/types';
import { AlertModal } from './alert-modal';

interface AddChildFormProps {
  onAdd: (child: Child) => void;
  onClose: () => void;
  childToEdit?: Child | null;
}

export const AddChildForm: React.FC<AddChildFormProps> = ({ onAdd, onClose, childToEdit }) => {
  const [nome, setNome] = useState(childToEdit?.nome || '');
  const [nomeResponsavel, setNomeResponsavel] = useState(childToEdit?.nomeResponsavel || '');
  const [tipoResponsavel, setTipoResponsavel] = useState<ResponsavelType>(childToEdit?.tipoResponsavel || 'mae');
  const [celularResponsavel, setCelularResponsavel] = useState(childToEdit?.celularResponsavel || '');
  const [observacoes, setObservacoes] = useState(childToEdit?.observacoes || '');
  const [alertModal, setAlertModal] = useState<{ title: string; message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  const formatarCelular = (valor: string): string => {
    // Remove tudo que não é número
    const apenasNumeros = valor.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    const limitado = apenasNumeros.slice(0, 11);
    
    // Aplica a máscara (XX) XXXXX-XXXX
    if (limitado.length <= 2) {
      return limitado;
    } else if (limitado.length <= 7) {
      return `(${limitado.slice(0, 2)}) ${limitado.slice(2)}`;
    } else {
      return `(${limitado.slice(0, 2)}) ${limitado.slice(2, 7)}-${limitado.slice(7)}`;
    }
  };

  const handleCelularChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const valorFormatado = formatarCelular(e.target.value);
    setCelularResponsavel(valorFormatado);
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    
    if (!nome.trim()) {
      setAlertModal({
        title: 'Campo Obrigatório',
        message: 'Por favor, preencha o nome da criança.',
        type: 'warning'
      });
      return;
    }

    if (!nomeResponsavel.trim()) {
      setAlertModal({
        title: 'Campo Obrigatório',
        message: 'Por favor, preencha o nome do responsável.',
        type: 'warning'
      });
      return;
    }

    if (!celularResponsavel.trim()) {
      setAlertModal({
        title: 'Campo Obrigatório',
        message: 'Por favor, preencha o celular do responsável.',
        type: 'warning'
      });
      return;
    }

    const child: Child = {
      id: childToEdit?.id || Date.now().toString(),
      nome: nome.trim(),
      nomeResponsavel: nomeResponsavel.trim(),
      tipoResponsavel,
      celularResponsavel: celularResponsavel.trim(),
      observacoes: observacoes.trim(),
      horaEntrada: childToEdit?.horaEntrada || new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    onAdd(child);
    onClose();
  };

  const isEditing = !!childToEdit;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-center rounded-t-2xl">
            <div className="flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">
                {isEditing ? 'Editar Criança' : 'Cadastrar Criança'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded-lg transition-colors"
              aria-label="Fechar formulário"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-semibold text-gray-700 mb-1">
                Nome da Criança *
              </label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-900"
                placeholder="Nome completo"
                required
              />
            </div>

            <div>
              <label htmlFor="nomeResponsavel" className="block text-sm font-semibold text-gray-700 mb-1">
                Nome do Responsável *
              </label>
              <input
                type="text"
                id="nomeResponsavel"
                value={nomeResponsavel}
                onChange={(e) => setNomeResponsavel(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-900"
                placeholder="Nome completo do responsável"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de Responsável *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tipoResponsavel"
                    value="pai"
                    checked={tipoResponsavel === 'pai'}
                    onChange={(e) => setTipoResponsavel(e.target.value as ResponsavelType)}
                    className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Pai</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tipoResponsavel"
                    value="mae"
                    checked={tipoResponsavel === 'mae'}
                    onChange={(e) => setTipoResponsavel(e.target.value as ResponsavelType)}
                    className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Mãe</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tipoResponsavel"
                    value="outro"
                    checked={tipoResponsavel === 'outro'}
                    onChange={(e) => setTipoResponsavel(e.target.value as ResponsavelType)}
                    className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Outro</span>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="celularResponsavel" className="block text-sm font-semibold text-gray-700 mb-1">
                Celular do Responsável *
              </label>
              <input
                type="tel"
                id="celularResponsavel"
                value={celularResponsavel}
                onChange={handleCelularChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-900"
                placeholder="(00) 00000-0000"
                maxLength={15}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Digite apenas os números. Formatação automática.
              </p>
            </div>

            <div>
              <label htmlFor="observacoes" className="block text-sm font-semibold text-gray-700 mb-1">
                Observações sobre a Criança
              </label>
              <textarea
                id="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none text-gray-900"
                placeholder="Ex: Alérgico a amendoim, precisa de atenção especial..."
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
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
              >
                {isEditing ? 'Salvar' : 'Cadastrar'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {alertModal && (
        <AlertModal
          title={alertModal.title}
          message={alertModal.message}
          type={alertModal.type}
          onClose={() => setAlertModal(null)}
        />
      )}
    </>
  );
};

