'use client';

import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ClearDataModalProps {
  igrejaNome: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ClearDataModal: React.FC<ClearDataModalProps> = ({ 
  igrejaNome, 
  onConfirm, 
  onCancel 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[70]">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            Limpar Dados da Igreja
          </h3>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-3">
            Você está prestes a <strong>apagar permanentemente</strong> todos os dados da igreja:
          </p>
          
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 font-semibold text-center">
              {igrejaNome}
            </p>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Dados que serão apagados:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Todas as crianças cadastradas</li>
              <li>• Histórico completo de cultos</li>
              <li>• Registros de dias de uso</li>
            </ul>
          </div>

          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-semibold text-center">
              ⚠️ Esta ação NÃO pode ser desfeita!
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Apagar Tudo
          </button>
        </div>
      </div>
    </div>
  );
};
