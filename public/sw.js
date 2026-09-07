/**
 * ============================================================
 *  KELAJAK EGASI — Service Worker
 *  Maktab kompyuterlarida internet uzilib qolsa ham anketa
 *  ochilishi uchun ilova qobig'i (app shell) keshlanadi.
 *
 *  Strategiya:
 *   - Sahifalar (navigate): avval tarmoq, xato bo'lsa kesh
 *   - Statik fayllar: avval kesh, keyin tarmoq
 *   - API so'rovlari: hech qachon keshlanmaydi
 * ============================================================
 */

const CACHE_VERSION = 'kelajak-egasi-v2';
const OFFLINE_URL = '/offline.html';

/** Oldindan keshlanadigan fayllar */
const PRECACHE_URLS = [
  '/',
  OFFLINE_URL,
  '/manifest.json',
  '/icons/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  // Ixtiyoriy tabrik musiqasi. Fayl qo'yilmagan bo'lsa bu manzil
  // xato beradi — `allSettled` tufayli o'rnatish baribir tugaydi.
  '/tabrik.mp3',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      // Ba'zi manzillar mavjud bo'lmasa ham o'rnatish to'xtamasligi kerak
      .then((cache) => Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Faqat GET so'rovlari keshlanadi
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Boshqa domenlarga va API'ga tegmaymiz
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  // Sahifalar: avval tarmoq, muvaffaqiyatsiz bo'lsa kesh yoki oflayn sahifa
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached || caches.match(OFFLINE_URL))
            .then((cached) => cached || Response.error())
        )
    );
    return;
  }

  // Statik fayllar: avval kesh
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (response.ok && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached || Response.error());
    })
  );
});
