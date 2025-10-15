'use client';

import { AlertCircle, X } from 'lucide-react';

interface SelectChurchModalProps {
  onClose: () => void;
}

export const SelectChurchModal: React.FC<SelectChurchModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[70]">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            Igreja Não Selecionada
          </h3>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Para limpar os dados, você precisa primeiro <strong>selecionar uma igreja</strong>.
          </p>
          
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <strong>Como fazer:</strong><br />
              1. Clique no botão &quot;Gerenciar Igrejas&quot;<br />
              2. Selecione a igreja desejada<br />
              3. Volte e clique em &quot;Limpar Dados&quot;
            </p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
};
