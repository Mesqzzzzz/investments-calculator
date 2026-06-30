const CACHE_NAME = 'wealthiers-v10';
const ASSETS = [
  './',
  './index.html',
  './style.css?v=10',
  './app.js?v=10',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Instalação - Caching de todos os ficheiros estáticos
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activação - Limpar caches obsoletas
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - Carregar recursos com suporte offline (Network First para Localhost, Cache First para Produção)
self.addEventListener('fetch', (e) => {
  const url = e.request.url;
  const isLocal = url.includes('localhost') || url.includes('127.0.0.1');

  if (isLocal) {
    // Network-First para desenvolvimento rápido
    e.respondWith(
      fetch(e.request)
        .then((response) => {
          if (response.status === 200 && response.type === 'basic') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(e.request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(e.request);
        })
    );
  } else {
    // Cache-First para recursos de produção de terceiros (como Chart.js)
    e.respondWith(
      caches.match(e.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(e.request).then((response) => {
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(e.request, clone);
            });
          }
          return response;
        });
      })
    );
  }
});
