'use client';

import { AlertCircle, X } from 'lucide-react';
import { useSpaceStore } from '@/store/use-space-store';
import { useEffect } from 'react';
import { playAlertSound } from '@/utils/alert-sound';

export const GlobalAlert: React.FC = () => {
  const { children, updateChild } = useSpaceStore();
  
  const childrenComChamado = children.filter(child => child.isChamadoAtivo);

  useEffect(() => {
    if (childrenComChamado.length > 0) {
      playAlertSound();
    }
  }, [childrenComChamado.length]);

  const handleDismiss = (childId: string): void => {
    updateChild(childId, { isChamadoAtivo: false });
  };

  if (childrenComChamado.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full animate-slideUp my-8">
        <div className="bg-gradient-to-r from-red-600 via-orange-600 to-red-600 p-8 rounded-t-3xl relative animate-pulse-slow">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertCircle className="w-16 h-16 text-white animate-bounce" />
          </div>
          
          <h2 className="text-4xl font-black text-white text-center drop-shadow-lg">
            🔔 ATENÇÃO RESPONSÁVEIS!
          </h2>
          <p className="text-white text-center text-xl font-semibold mt-2">
            {childrenComChamado.length === 1 
              ? 'Por favor, buscar a criança' 
              : `${childrenComChamado.length} crianças precisam ser buscadas`}
          </p>
        </div>
        
        <div className="p-8 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className={`grid gap-4 ${childrenComChamado.length === 1 ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
            {childrenComChamado.map((child) => {
              const responsavelLabel = 
                child.tipoResponsavel === 'pai' ? 'Pai' :
                child.tipoResponsavel === 'mae' ? 'Mãe' : 'Responsável';

              return (
                <div 
                  key={child.id}
                  className="bg-gradient-to-r from-red-50 to-orange-50 border-4 border-red-300 rounded-2xl p-6 relative"
                >
                  <button
                    onClick={() => handleDismiss(child.id)}
                    className="absolute top-3 right-3 text-red-600 hover:bg-red-100 p-1.5 rounded-lg transition-colors"
                    aria-label="Dispensar alerta"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className={childrenComChamado.length === 1 ? "grid md:grid-cols-2 gap-6 pr-8" : "space-y-3 pr-8"}>
                    <div>
                      <p className="text-xs text-red-700 font-bold uppercase mb-1">👶 Criança</p>
                      <p className={childrenComChamado.length === 1 ? "text-3xl font-black text-gray-900" : "text-2xl font-black text-gray-900"}>
                        {child.nome}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-red-700 font-bold uppercase mb-1">{responsavelLabel}</p>
                      <p className={childrenComChamado.length === 1 ? "text-2xl font-bold text-gray-900" : "text-xl font-bold text-gray-900"}>
                        {child.nomeResponsavel}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-red-200 rounded-lg p-4 mt-4">
                    <p className={`text-center font-bold text-red-800 ${childrenComChamado.length === 1 ? 'text-lg' : 'text-sm'}`}>
                      🚨 Compareça ao Espaço Infantil imediatamente
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
            <p className="text-center text-sm text-yellow-800">
              <strong>💡 Atenção:</strong> Este alerta é visível para todos os presentes.
              Clique no <strong>X</strong> para dispensar após comparecer ao espaço infantil.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

