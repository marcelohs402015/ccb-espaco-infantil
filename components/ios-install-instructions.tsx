/**
 * Modal de Instruções de Instalação para iOS
 * CCB Espaço Infantil - PWA
 */

'use client';

import { X, Share, Plus, Home } from 'lucide-react';

interface IOSInstallInstructionsProps {
  onClose: () => void;
}

export const IOSInstallInstructions: React.FC<IOSInstallInstructionsProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Instalar no iOS</h2>
                <p className="text-blue-100 text-sm">Siga os passos abaixo</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          {/* Passo 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
              1
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Share className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Toque no botão Compartilhar</h3>
              </div>
              <p className="text-sm text-gray-600">
                Toque no ícone de <strong>Compartilhar</strong> (quadrado com seta para cima) 
                na parte inferior do Safari
              </p>
            </div>
          </div>

          {/* Passo 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
              2
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Adicionar à Tela de Início</h3>
              </div>
              <p className="text-sm text-gray-600">
                Role para baixo e toque em <strong>&quot;Adicionar à Tela de Início&quot;</strong>
              </p>
            </div>
          </div>

          {/* Passo 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
              3
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Home className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Confirmar instalação</h3>
              </div>
              <p className="text-sm text-gray-600">
                Toque em <strong>&quot;Adicionar&quot;</strong> no canto superior direito
              </p>
            </div>
          </div>

          {/* Nota */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>✨ Pronto!</strong> O app aparecerá na sua tela inicial como qualquer 
              outro aplicativo. Você poderá acessá-lo diretamente sem abrir o Safari.
            </p>
          </div>
        </div>

        {/* Botão */}
        <div className="p-6 pt-0">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
};
