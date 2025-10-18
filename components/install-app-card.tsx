/**
 * Card de Instalação PWA
 * CCB Espaço Infantil - Add to Home Screen
 */

'use client';

import { useState } from 'react';
import { Download, X, Smartphone, Zap, Bell, WifiOff } from 'lucide-react';
import { usePWAInstall } from '@/hooks/use-pwa-install';
import { IOSInstallInstructions } from './ios-install-instructions';

export const InstallAppCard: React.FC = () => {
  const { 
    shouldShowPrompt, 
    isIOS, 
    isAndroid,
    isDesktop,
    promptInstall, 
    dismissPrompt,
    isClient
  } = usePWAInstall();

  // Debug
  console.log('🔍 InstallAppCard Debug:', {
    shouldShowPrompt,
    isIOS,
    isAndroid,
    isDesktop,
    isClient
  });

  const [isIOSModalOpen, setIsIOSModalOpen] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstall = async () => {
    if (isIOS) {
      // Mostrar instruções para iOS
      setIsIOSModalOpen(true);
      return;
    }

    // Android/Desktop: Usar prompt nativo
    setIsInstalling(true);
    try {
      await promptInstall();
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    dismissPrompt();
  };

  // Temporariamente sempre mostrar para debug
  if (!isClient) {
    return null;
  }

  const getPlatformText = () => {
    if (isIOS) return 'Como Instalar no iPhone/iPad';
    if (isAndroid) return 'Instalar no Android';
    if (isDesktop) return 'Instalar na Área de Trabalho';
    return 'Instalar Aplicativo';
  };

  return (
    <>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 mb-8 border-2 border-blue-200 animate-fadeIn">
        <div className="flex items-start justify-between gap-4">
          {/* Conteúdo Principal */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  📱 Instalar como Aplicativo
                </h3>
                <p className="text-sm text-gray-600">
                  Acesse rapidamente sem abrir o navegador
                </p>
              </div>
            </div>

            {/* Benefícios */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="flex items-center gap-2 bg-white/50 p-2 rounded-lg">
                <WifiOff className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">Funciona offline</span>
              </div>
              <div className="flex items-center gap-2 bg-white/50 p-2 rounded-lg">
                <Bell className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">Notificações rápidas</span>
              </div>
              <div className="flex items-center gap-2 bg-white/50 p-2 rounded-lg">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">Experiência nativa</span>
              </div>
            </div>

            {/* Botão de Instalação */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleInstall}
                disabled={isInstalling}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-400 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isInstalling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Instalando...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    {getPlatformText()}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Botão Fechar */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 hover:bg-white/50 p-2 rounded-lg transition-colors"
            aria-label="Dispensar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Modal de Instruções iOS */}
      {isIOSModalOpen && (
        <IOSInstallInstructions onClose={() => setIsIOSModalOpen(false)} />
      )}
    </>
  );
};
