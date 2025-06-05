
const CACHE_NAME = 'connexi-ai-v1';
const urlsToCache = [
  '/',
  '/en',
  '/src/main.tsx',
  '/src/index.css',
  '/lovable-uploads/dbf89901-caf3-4069-a5bc-0ac9cbade5ff.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});
