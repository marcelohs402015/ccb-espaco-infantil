'use client';

import { useState } from 'react';
import { X, Settings as SettingsIcon } from 'lucide-react';
import type { Settings } from '@/types';

interface SettingsModalProps {
  settings: Settings;
  onUpdate: (settings: Settings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  settings, 
  onUpdate, 
  onClose 
}) => {
  const [capacidade, setCapacidade] = useState(settings.capacidadeMaxima);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    
    if (capacidade < 1) {
      alert('A capacidade deve ser maior que zero');
      return;
    }

    onUpdate({ capacidadeMaxima: capacidade });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex justify-between items-center rounded-t-2xl">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Configurações</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded-lg transition-colors"
            aria-label="Fechar configurações"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="capacidadeMaxima" className="block text-sm font-semibold text-gray-700 mb-2">
              Capacidade Máxima do Espaço Infantil Bíblico
            </label>
            <input
              type="number"
              id="capacidadeMaxima"
              value={capacidade}
              onChange={(e) => setCapacidade(Number(e.target.value))}
              min="1"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors text-lg font-semibold text-center text-gray-900"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              Define quantas crianças podem estar no espaço ao mesmo tempo
            </p>
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
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

