'use client';

import { useState } from 'react';
import { Phone, Trash2, Clock, User, AlertCircle, Edit, Bell } from 'lucide-react';
import type { Child } from '@/types';
import { ConfirmModal } from './confirm-modal';
import { useSpaceStore } from '@/store/use-space-store';

interface ChildCardProps {
  child: Child;
  onRemove: (id: string) => void;
  onEdit: (child: Child) => void;
}

export const ChildCard: React.FC<ChildCardProps> = ({ child, onRemove, onEdit }) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const { updateChild } = useSpaceStore();

  const handleEmergencyClick = (): void => {
    updateChild(child.id, { isChamadoAtivo: true });
  };

  const handleRechamar = (): void => {
    updateChild(child.id, { isChamadoAtivo: true });
  };

  const handleRemove = (): void => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmRemove = (): void => {
    onRemove(child.id);
    setIsConfirmModalOpen(false);
  };

  const responsavelLabel = 
    child.tipoResponsavel === 'pai' ? 'Pai' :
    child.tipoResponsavel === 'mae' ? 'Mãe' : 'Responsável';

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            {child.nome}
          </h3>
          <div className="flex items-center gap-2 text-blue-50 text-sm mt-1">
            <Clock className="w-4 h-4" />
            Entrada: {child.horaEntrada}
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase">{responsavelLabel}</p>
            <p className="text-sm font-semibold text-gray-900">{child.nomeResponsavel}</p>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase">Telefone</p>
            <p className="text-sm font-semibold text-blue-700">{child.celularResponsavel}</p>
          </div>
          
          {child.observacoes && (
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Observações</p>
              <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded border border-gray-200">
                {child.observacoes}
              </p>
            </div>
          )}

          {child.isChamadoAtivo && (
            <div className="bg-green-50 border-2 border-green-400 rounded-lg p-3">
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
          
          <div className="flex gap-2 pt-2">
            {!child.isChamadoAtivo && (
              <button
                onClick={handleEmergencyClick}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                aria-label={`Emergência para ${child.nome}`}
              >
                <Phone className="w-5 h-5" />
                EMERGÊNCIA
              </button>
            )}
            
            <button
              onClick={() => onEdit(child)}
              className="px-3 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              aria-label={`Editar ${child.nome}`}
            >
              <Edit className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleRemove}
              className="px-3 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md hover:shadow-lg"
              aria-label={`Remover ${child.nome}`}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {isConfirmModalOpen && (
        <ConfirmModal
          title="Remover Criança"
          message={`Deseja realmente remover ${child.nome} do espaço infantil bíblico?`}
          confirmText="Remover"
          cancelText="Cancelar"
          type="error"
          onConfirm={handleConfirmRemove}
          onCancel={() => setIsConfirmModalOpen(false)}
        />
      )}
    </>
  );
};

