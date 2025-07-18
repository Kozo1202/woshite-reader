const CACHE_NAME = 'tsurigaki-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './tsurigaki_index.json',
  // もし他の JSON や CSS, JS ファイルがあればここに追加
];

// インストール時にキャッシュする
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('✅ キャッシュ中:', urlsToCache);
      return cache.addAll(urlsToCache);
    })
  );
});

// 有効化：古いキャッシュを削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            console.log('🗑 古いキャッシュ削除:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// フェッチ時にキャッシュがあれば使い、なければ取得
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).catch(() => {
          // オフライン対応で、index.html を返しておく（適宜調整）
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        })
      );
    })
  );
});
