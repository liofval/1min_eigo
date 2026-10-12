const CACHE_NAME = 'daily-english-reading-v21-through-2026-10-15';
const APP_SHELL = [
  "./",
  "./index.html",
  "./archive.html",
  "./level.html",
  "./videos/2026-10-01.html",
  "./videos/2026-10-02.html",
  "./videos/2026-10-03.html",
  "./videos/2026-10-04.html",
  "./videos/2026-10-05.html",
  "./videos/2026-10-06.html",
  "./videos/2026-10-07.html",
  "./videos/2026-10-08.html",
  "./videos/2026-10-09.html",
  "./videos/2026-10-10.html",
  "./videos/2026-10-11.html",
  "./videos/2026-10-12.html",
  "./videos/2026-10-13.html",
  "./videos/2026-10-14.html",
  "./videos/2026-10-15.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./assets/icon.png",
  "./assets/profile-vertical.png",
  "./assets/video-poster.png?v=2026-10-15-through-15",
  "./assets/videos/2026-10-01/video-poster.png?v=2026-10-01-through-15",
  "./assets/videos/2026-10-02/video-poster.png?v=2026-10-02-through-15",
  "./assets/videos/2026-10-03/video-poster.png?v=2026-10-03-through-15",
  "./assets/videos/2026-10-04/video-poster.png?v=2026-10-04-through-15",
  "./assets/videos/2026-10-05/video-poster.png?v=2026-10-05-through-15",
  "./assets/videos/2026-10-06/video-poster.png?v=2026-10-06-through-15",
  "./assets/videos/2026-10-07/video-poster.png?v=2026-10-07-through-15",
  "./assets/videos/2026-10-08/video-poster.png?v=2026-10-08-through-15",
  "./assets/videos/2026-10-09/video-poster.png?v=2026-10-09-through-15",
  "./assets/videos/2026-10-10/video-poster.png?v=2026-10-10-through-15",
  "./assets/videos/2026-10-11/video-poster.png?v=2026-10-11-through-15",
  "./assets/videos/2026-10-12/video-poster.png?v=2026-10-12-through-15",
  "./assets/videos/2026-10-13/video-poster.png?v=2026-10-13-through-15",
  "./assets/videos/2026-10-14/video-poster.png?v=2026-10-14-through-15",
  "./assets/videos/2026-10-15/video-poster.png?v=2026-10-15-through-15",
  "./assets/translation-ja.txt",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }

        const isAsset = event.request.url.includes('/assets/') || event.request.url.includes('/icons/');
        if (isAsset && !event.request.url.endsWith('.mp4')) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }

        return response;
      });
    })
  );
});
