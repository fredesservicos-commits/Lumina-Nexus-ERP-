const CACHE_NAME = "lumina-nexus-erp-v2";
const STATIC_CACHE = "lumina-nexus-erp-static-v2";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      cache.addAll(["/", "/index.html", "/manifest.json", "/icon.svg", "/icon-192.png", "/icon-512.png"]),
    ),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== STATIC_CACHE && k !== CACHE_NAME)
            .map((k) => caches.delete(k)),
        ),
      ),
    ]),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/index.html")),
    );
    return;
  }

  if (url.pathname.startsWith("/assets/")) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((res) => {
        const clone = res.clone();
        caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
        return res;
      })),
    );
    return;
  }

  if (url.pathname.startsWith("/api/")) return;

  // Se for uma requisição para o Supabase (API), ignore o cache
  if (url.hostname.includes("supabase.co")) {
    return event.respondWith(fetch(request));
  }

  // Comportamento padrão para outros recursos
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).catch(() => new Response("Offline", { status: 503 })))
  );
});
