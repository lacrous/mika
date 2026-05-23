const CACHE_NAME = "mika-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/icon-192.png",
  "/icon-512.png",
];

// Install: cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: serve from cache or network
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip API calls and non-GET requests
  if (request.method !== "GET" || url.pathname.startsWith("/api/") || url.pathname.startsWith("/trpc")) {
    return;
  }

  // Cache-first for static assets, network-first for pages
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

function isStaticAsset(path) {
  return /\.(js|css|png|jpg|jpeg|svg|woff2?|ico)$/.test(path);
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response("Offline - MIKA", {
      status: 503,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
