// sw.js — BAVATU (bv-v4)
const CACHE_NAME = 'bv-v4';
const ASSETS = [
  '/bavatu/',

  // Trang & CSS inline
  '/bavatu/index.html',

  // Ảnh hero/footer/logo
  '/bavatu/hero-hinh-nen.webp?v=4',
  '/bavatu/footer-hinh-nen.webp?v=4',
  '/bavatu/logo-khong-nen-2025.png?v=1',

  // Menu & story (tuỳ anh có file nào thì thêm vào)
  '/bavatu/menu-khoang-thu-thai.png',
  '/bavatu/menu-an-duong-than.png',
  '/bavatu/menu-tinh-than-lac.png',
  '/bavatu/menu-tai-nguyen-sinh.png',
  '/bavatu/menu-huong-nhien-tinh.png',
  '/bavatu/menu-an-my-nhan.png',
  '/bavatu/story-1.webp','/bavatu/story-2.webp','/bavatu/story-3.webp',
  '/bavatu/story-4.webp','/bavatu/story-5.webp','/bavatu/story-6.webp','/bavatu/story-7.webp',

  // Favicon / manifest
  '/bavatu/favicon-512.png?v=4',
  '/bavatu/apple-touch-icon.png?v=4',
  '/bavatu/safari-pinned-tab.svg?v=4',
  '/bavatu/manifest.webmanifest',
  '/bavatu/site.webmanifest',

  // Âm thanh intro
  '/bavatu/bavatu-drop.mp3?v=5',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  // Only cache GET within scope
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(req).then(cached =>
      cached ||
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(req, copy));
        return res;
      }).catch(() => cached) // offline fallback
    )
  );
});
