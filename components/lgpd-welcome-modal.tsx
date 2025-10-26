'use client';

import { Shield, ArrowRight } from 'lucide-react';

interface LgpdWelcomeModalProps {
  isOpen: boolean;
  onEnter: () => void;
}

export const LgpdWelcomeModal: React.FC<LgpdWelcomeModalProps> = ({ 
  isOpen, 
  onEnter 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[80]">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
        {/* Header com informações da aplicação */}
        <div className="text-center mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm font-semibold text-blue-800 mb-1">
              Aplicação de uso exclusivo da <strong>Congregação Cristã no Brasil</strong>
            </p>
            <p className="text-xs text-blue-700">
              Objetivo: Auxiliar as irmãs que cooperam no Espaço Bíblico Infantil
            </p>
          </div>
        </div>

        {/* Título principal */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-100 rounded-lg">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            Nosso Compromisso com a Sua Privacidade
          </h2>
        </div>
        
        {/* Corpo da mensagem */}
        <div className="mb-8">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-5">
            <p className="text-gray-700 leading-relaxed text-center">
              Para proteger suas informações, em alinhamento com a LGPD e os valores da <strong>Congregação Cristã no Brasil</strong>, este aplicativo remove automaticamente todos os dados da sua sessão ao final de cada dia. 
              <span className="font-semibold text-green-800 block mt-3">
                Sua privacidade é nossa prioridade.
              </span>
            </p>
            <p className="text-gray-600 leading-relaxed text-center mt-4 text-sm">
              No final desta aplicação existe um botão <span className="font-bold text-red-600">LIMPAR DADOS</span> que executa a limpeza dos dados e temos uma rotina de inteligência que analisa se ainda não foi limpo os dados, executa a limpeza para manter a lei de proteção de dados.
            </p>
          </div>
        </div>
        
        {/* Botão de entrada */}
        <div className="flex justify-center">
          <button
            onClick={onEnter}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 min-w-[160px]"
          >
            <span>Entrar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Rodapé com informação adicional */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            CCB - Congregação Cristã no Brasil | Sistema Espaço Infantil
          </p>
        </div>
      </div>
    </div>
  );
};
