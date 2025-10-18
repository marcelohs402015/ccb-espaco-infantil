/**
 * Indicador de Sincronização em Tempo Real
 * CCB Espaço Infantil
 */

'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, Bell, BellOff } from 'lucide-react';

interface SyncIndicatorProps {
  isConnected?: boolean;
  isSyncing?: boolean;
  lastSync?: Date | null;
  autoRefreshActive?: boolean;
  nextRefresh?: Date | null;
  notificationsEnabled?: boolean;
  isPWAInstalled?: boolean;
}

export const SyncIndicator: React.FC<SyncIndicatorProps> = ({
  isConnected = true,
  isSyncing = false,
  lastSync,
  autoRefreshActive = false,
  nextRefresh,
  notificationsEnabled = false,
  isPWAInstalled = false
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const formatLastSync = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) {
      return `${seconds}s atrás`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes}min atrás`;
    } else {
      return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  return (
    <div className="relative">
      <div
        className="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 cursor-pointer transition-all hover:bg-white hover:shadow-lg"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Ícone de Status */}
        <div className="relative">
          {isSyncing ? (
            <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
          ) : isConnected ? (
            <Wifi className="w-4 h-4 text-green-600" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-600" />
          )}
          
          {/* Indicador de pulso para conexão ativa */}
          {isConnected && !isSyncing && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          )}
        </div>

        {/* Texto do Status */}
        <span className="text-xs font-medium text-gray-700">
          {isSyncing ? 'Sincronizando...' : isConnected ? 'Online' : 'Offline'}
          {autoRefreshActive && !isSyncing && (
            <span className="ml-1 text-green-600">•</span>
          )}
        </span>

        {/* Indicador de Notificações */}
        <div className="ml-2">
          {notificationsEnabled ? (
            <Bell className="w-3 h-3 text-green-600" />
          ) : (
            <BellOff className="w-3 h-3 text-gray-400" />
          )}
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-50">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>
                {isConnected ? 'Conectado em tempo real' : 'Modo offline'}
              </span>
            </div>
            {lastSync && (
              <div className="text-gray-300">
                Última sincronização: {formatLastSync(lastSync)}
              </div>
            )}
            <div className="text-gray-300">
              {isSyncing ? 'Atualizando dados...' : 'Dados sincronizados'}
            </div>
            {autoRefreshActive && (
              <div className="text-green-300">
                Auto-refresh ativo (5s)
              </div>
            )}
            {nextRefresh && (
              <div className="text-gray-300">
                Próximo refresh: {formatLastSync(nextRefresh)}
              </div>
            )}
            <div className={`${notificationsEnabled ? 'text-green-300' : 'text-gray-300'}`}>
              Notificações: {notificationsEnabled ? 'Ativadas' : 'Desativadas'}
            </div>
            <div className={`${isPWAInstalled ? 'text-green-300' : 'text-gray-300'}`}>
              PWA: {isPWAInstalled ? 'Instalado' : 'Não instalado'}
            </div>
          </div>
          
          {/* Seta do tooltip */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
};
