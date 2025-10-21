/**
 * Service Worker para CCB Espaço Infantil
 * Suporte a notificações push e cache offline
 */

const CACHE_NAME = 'ccb-espaco-infantil-v5';
const urlsToCache = [
  '/',
  '/ccb-logo.png',
  '/manifest.json'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Service Worker: Instalado com sucesso');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker: Erro na instalação:', error);
      })
  );
});

// Ativar Service Worker e limpar caches antigos
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker: Ativando...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      // Limpar TODOS os caches para forçar atualização
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('🗑️ Service Worker: Removendo cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Ativado e TODOS os caches limpos');
      return self.clients.claim();
    })
  );
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Ativando...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Ativado com sucesso');
      return self.clients.claim();
    })
  );
});

// Interceptar requisições - APENAS para notificações push
self.addEventListener('fetch', (event) => {
  // Desabilitar cache completamente para evitar erros
  // O Service Worker será usado apenas para notificações push
  return;
});

// Gerenciar notificações push
self.addEventListener('push', (event) => {
  console.log('📱 Service Worker: Notificação push recebida');
  
  let notificationData = {
    title: 'CCB Espaço Infantil',
    body: 'Nova notificação',
    icon: '/ccb-logo.png',
    badge: '/ccb-logo.png',
    tag: 'ccb-notification',
    requireInteraction: true,
    silent: false,
    vibrate: [200, 100, 200],
    actions: [
      {
        action: 'view',
        title: 'Visualizar',
        icon: '/ccb-logo.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/ccb-logo.png'
      }
    ]
  };

  // Se há dados na notificação push
  if (event.data) {
    try {
      const data = event.data.json();
      console.log('📱 Service Worker: Dados da notificação:', data);
      
      if (data.type === 'emergency') {
        notificationData = {
          ...notificationData,
          title: '🚨 EMERGÊNCIA - CCB Espaço Infantil',
          body: `Emergência para ${data.childName}. Responsável: ${data.responsavelName}`,
          tag: `emergency-${data.childId}`,
          requireInteraction: true,
          vibrate: [500, 200, 500, 200, 500],
          actions: [
            {
              action: 'call',
              title: 'Ligar',
              icon: '/ccb-logo.png'
            },
            {
              action: 'view',
              title: 'Visualizar',
              icon: '/ccb-logo.png'
            }
          ],
          data: {
            childId: data.childId,
            childName: data.childName,
            responsavelName: data.responsavelName,
            responsavelPhone: data.responsavelPhone,
            type: 'emergency'
          }
        };
      }
    } catch (error) {
      console.error('❌ Service Worker: Erro ao processar dados da notificação:', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Gerenciar cliques em notificações
self.addEventListener('notificationclick', (event) => {
  console.log('👆 Service Worker: Notificação clicada:', event.action);
  
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const notificationData = event.notification.data;
  
  if (event.action === 'call' && notificationData?.responsavelPhone) {
    // Abrir app para ligar
    event.waitUntil(
      clients.openWindow(`tel:${notificationData.responsavelPhone}`)
    );
  } else {
    // Abrir app
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Se já há uma janela aberta, focar nela
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Se não há janela aberta, abrir nova
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Gerenciar fechamento de notificações
self.addEventListener('notificationclose', (event) => {
  console.log('❌ Service Worker: Notificação fechada:', event.notification.tag);
});

// Mensagens do cliente
self.addEventListener('message', (event) => {
  console.log('💬 Service Worker: Mensagem recebida:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
