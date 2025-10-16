// 🪷 BAVATU — Service Worker (bv-v4)
// Tác dụng: cache hình ảnh, icon, offline nhẹ, ép cập nhật logo mới

const CACHE = 'bv-v4';

// ⚙️ Danh sách file quan trọng để pre-cache
const PRECACHE = [
  '/bavatu/',
  '/bavatu/index.html',
  '/bavatu/hero-hinh-nen.webp',
  '/bavatu/footer-hinh-nen.webp',
  '/bavatu/logo-khong-nen-2025.png',
  '/bavatu/favicon-96x96.png',
  '/bavatu/apple-touch-icon.png',
  '/bavatu/site.webmanifest'
];

// ✅ Cài đặt & pre-cache file
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PRECACHE)).catch(() => {})
  );
});

// 🧹 Dọn cache cũ khi kích hoạt SW mới
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// 🌐 Chiến lược cache thông minh
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Chỉ áp dụng trong scope /bavatu/
  if (!url.pathname.startsWith('/bavatu/')) return;

  // Ảnh và icon → cache first
  if (/\.(?:png|webp|jpg|jpeg|svg|ico)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then(cached => {
        if (cached) return cached;
        return fetch(req).then(res => {
          const resClone = res.clone();
          caches.open(CACHE).then(c => c.put(req, resClone));
          return res;
        });
      })
    );
    return;
  }

  // HTML/CSS/JS → network first
  if (/\.(?:html|css|js)$/i.test(url.pathname) || req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(res => {
        const resClone = res.clone();
        caches.open(CACHE).then(c => c.put(req, resClone));
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // Các file khác → network ưu tiên, fallback cache
  event.respondWith(fetch(req).catch(() => caches.match(req)));
});
