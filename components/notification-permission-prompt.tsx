/**
 * Componente de Solicitação de Permissão de Notificações
 * CCB Espaço Infantil - PWA
 */

'use client';

import { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useNotification } from '@/hooks/use-notification';

interface NotificationPermissionPromptProps {
  onClose?: () => void;
  onPermissionGranted?: () => void;
}

export const NotificationPermissionPrompt: React.FC<NotificationPermissionPromptProps> = ({
  onClose,
  onPermissionGranted
}) => {
  const { requestPermission, isLoading, error, hasPermission } = useNotification();
  const [showPrompt, setShowPrompt] = useState(false);
  const [hasShownPrompt, setHasShownPrompt] = useState(false);

  // Verificar se deve mostrar o prompt
  useEffect(() => {
    const hasShown = sessionStorage.getItem('ccb-notification-prompt-shown');
    if (!hasShown && !hasPermission) {
      setShowPrompt(true);
    }
  }, [hasPermission]);

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    
    if (granted) {
      setShowPrompt(false);
      setHasShownPrompt(true);
      sessionStorage.setItem('ccb-notification-prompt-shown', 'true');
      onPermissionGranted?.();
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
    setHasShownPrompt(true);
    sessionStorage.setItem('ccb-notification-prompt-shown', 'true');
    onClose?.();
  };

  const handleLater = () => {
    setShowPrompt(false);
    setHasShownPrompt(true);
    sessionStorage.setItem('ccb-notification-prompt-shown', 'true');
    onClose?.();
  };

  if (!showPrompt || hasPermission) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Notificações Importantes</h2>
                <p className="text-blue-100 text-sm">Para emergências e atualizações</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-4">
          {/* Benefícios */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Emergências Instantâneas</h3>
                <p className="text-sm text-gray-600">
                  Receba notificações imediatas quando houver emergências, mesmo com o celular travado
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Atualizações em Tempo Real</h3>
                <p className="text-sm text-gray-600">
                  Fique sempre informado sobre mudanças no espaço infantil
                </p>
              </div>
            </div>
          </div>

          {/* Erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Informação adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Importante:</strong> As notificações são essenciais para a segurança das crianças. 
              Você pode alterar essa configuração a qualquer momento nas configurações do navegador.
            </p>
          </div>
        </div>

        {/* Botões */}
        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={handleLater}
            className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            Depois
          </button>
          <button
            onClick={handleRequestPermission}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-400 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Ativando...
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                Ativar Notificações
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
