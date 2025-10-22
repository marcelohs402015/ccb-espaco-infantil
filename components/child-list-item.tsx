'use client';

import { useState } from 'react';
import { Phone, Trash2, Clock, User, AlertCircle, Edit, Bell } from 'lucide-react';
import type { Child } from '@/types';
import { useSpaceStore } from '@/store/use-space-store';

interface ChildListItemProps {
  child: Child;
  onRemove: (id: string) => void;
  onEdit: (child: Child) => void;
}

export const ChildListItem: React.FC<ChildListItemProps> = ({ child, onRemove, onEdit }) => {
  const { updateChild } = useSpaceStore();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleEmergencyClick = (): void => {
    updateChild(child.id, { isChamadoAtivo: true });
  };

  const handleRechamar = (): void => {
    updateChild(child.id, { isChamadoAtivo: true });
  };

  const handleRemove = (): void => {
    setShowConfirmModal(true);
  };

  const handleConfirmRemove = (): void => {
    onRemove(child.id);
    setShowConfirmModal(false);
  };

  const handleCancelRemove = (): void => {
    setShowConfirmModal(false);
  };

  const responsavelLabel = 
    child.tipoResponsavel === 'pai' ? 'Pai' :
    child.tipoResponsavel === 'mae' ? 'Mãe' : 'Responsável';

  return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between">
            {/* Informações principais */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 truncate">
                    {child.nome}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Entrada: {child.horaEntrada}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase">{responsavelLabel}</p>
                  <p className="text-sm font-semibold text-gray-900">{child.nomeResponsavel}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase">Telefone</p>
                  <p className="text-sm font-semibold text-blue-700">{child.celularResponsavel}</p>
                </div>
              </div>
              
              {child.observacoes && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 font-semibold uppercase">Observações</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded border border-gray-200 mt-1">
                    {child.observacoes}
                  </p>
                </div>
              )}

              {child.isChamadoAtivo && (
                <div className="bg-green-50 border-2 border-green-400 rounded-lg p-3 mt-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <AlertCircle className="w-5 h-5 text-green-600 animate-pulse" />
                      <p className="text-sm font-bold text-green-800">
                        Responsável chamado!
                      </p>
                    </div>
                    <button
                      onClick={handleRechamar}
                      className="px-3 py-2 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors shadow-md hover:shadow-lg flex items-center gap-1.5"
                      aria-label="Avisar novamente"
                      title="Avisar novamente - caso não tenha visto"
                    >
                      <Bell className="w-4 h-4" />
                      Avisar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Botões de ação */}
            <div className="flex flex-col gap-2 ml-4">
              {!child.isChamadoAtivo && (
                <button
                  onClick={handleEmergencyClick}
                  className="px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-lg flex items-center justify-center gap-2 min-w-[140px]"
                  aria-label={`Emergência para ${child.nome}`}
                >
                  <Phone className="w-5 h-5" />
                  EMERGÊNCIA
                </button>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(child)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                  aria-label={`Editar ${child.nome}`}
                >
                  <Edit className="w-4 h-4" />
                </button>
                
                <button
                  onClick={handleRemove}
                  className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md hover:shadow-lg"
                  aria-label={`Remover ${child.nome}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Trash2 className="w-6 h-6" />
                Confirmar Remoção
              </h3>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <User className="w-8 h-8 text-red-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">
                  Tem certeza que deseja remover esta criança?
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="font-semibold text-gray-800">{child.nome}</p>
                  <p className="text-sm text-gray-500">Responsável: {child.nomeResponsavel}</p>
                  <p className="text-sm text-gray-500">Entrada: {child.horaEntrada}</p>
                </div>
                <p className="text-sm text-red-600 font-medium">
                  ⚠️ Esta ação não pode ser desfeita
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCancelRemove}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmRemove}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
                >
                  Sim, Remover
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
