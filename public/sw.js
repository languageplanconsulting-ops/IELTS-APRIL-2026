/*
 * English Plan service worker — deliberately tiny.
 *
 * It exists so phones treat the site as an installable app. It does NOT cache
 * the app itself: every page load still comes fresh from the network, so a
 * deploy reaches students immediately and nobody gets stuck on an old build.
 * The only thing it stores is a small "you're offline" page, shown when a
 * student opens the home-screen app with no internet.
 */
const OFFLINE_CACHE = 'ep-offline-v1'
const OFFLINE_URL = '/offline.html'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(OFFLINE_CACHE)
      .then((cache) => cache.addAll([OFFLINE_URL, '/app-icons/icon-192.png']))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== OFFLINE_CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  // Only page navigations get the offline fallback. Everything else (API calls,
  // audio, video, scripts) goes straight to the network untouched.
  if (request.mode !== 'navigate') return
  event.respondWith(
    fetch(request).catch(async () => {
      const cached = await caches.match(OFFLINE_URL)
      return cached || Response.error()
    }),
  )
})
