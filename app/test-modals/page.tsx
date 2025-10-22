'use client';

import { useAlertStore } from '@/store/use-alert-store';

export default function TestModalsPage() {
  const { showAlert } = useAlertStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Teste de Modais Elegantes
        </h1>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Modais de Alerta
          </h2>
          <p className="text-gray-600 mb-6">
            Clique nos botões abaixo para testar os modais elegantes que substituíram os alerts nativos.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => showAlert({
                title: 'Sucesso!',
                message: 'Operação realizada com sucesso.',
                type: 'success',
              })}
              className="px-6 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
            >
              Testar Modal de Sucesso
            </button>
            
            <button
              onClick={() => showAlert({
                title: 'Erro ao Criar Registro',
                message: 'Erro ao criar registro. Verifique se a data está no formato correto (DD/MM/AAAA).',
                type: 'error',
              })}
              className="px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
            >
              Testar Modal de Erro
            </button>
            
            <button
              onClick={() => showAlert({
                title: 'Valor Inválido',
                message: 'A capacidade deve ser maior que zero',
                type: 'warning',
              })}
              className="px-6 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
            >
              Testar Modal de Aviso
            </button>
            
            <button
              onClick={() => showAlert({
                title: 'Informação',
                message: 'Esta é uma mensagem informativa.',
                type: 'info',
              })}
              className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
            >
              Testar Modal de Info
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Cenários de Teste Reais
          </h2>
          <p className="text-gray-600 mb-6">
            Teste os cenários específicos do sistema:
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => showAlert({
                title: 'Erro - Igreja Não Encontrada',
                message: 'Igreja não encontrada. Recarregue a página e tente novamente.',
                type: 'error',
              })}
              className="w-full px-6 py-3 border-2 border-red-300 text-red-700 font-semibold rounded-lg hover:bg-red-50 transition-colors text-left"
            >
              Igreja Não Encontrada (Store)
            </button>
            
            <button
              onClick={() => showAlert({
                title: 'Erro - Igreja Não Existe',
                message: 'Igreja não existe no banco de dados. Recarregue a página.',
                type: 'error',
              })}
              className="w-full px-6 py-3 border-2 border-red-300 text-red-700 font-semibold rounded-lg hover:bg-red-50 transition-colors text-left"
            >
              Igreja Não Existe no Banco (Store)
            </button>
            
            <button
              onClick={() => showAlert({
                title: 'Erro - Formato de Data Inválido',
                message: 'Formato de data inválido. Use DD/MM/YYYY no formulário.',
                type: 'error',
              })}
              className="w-full px-6 py-3 border-2 border-red-300 text-red-700 font-semibold rounded-lg hover:bg-red-50 transition-colors text-left"
            >
              Formato de Data Inválido (Store)
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
          >
            Voltar para a Página Principal
          </a>
        </div>
      </div>
    </div>
  );
}
