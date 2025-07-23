const CACHE_NAME = "woshite-cache-v2";  // ← v1 → v2 に変更したらスマホでも反映されるで！

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./service-worker.js",  // このファイル名をv1.jsにしてる場合は変更してな
  "./woshite-all.json",
  "./icon-192.png",
  "./icon-512.png",
  "https://fonts.googleapis.com/css2?family=Noto+Serif+JP&display=swap"
];

// インストール時：キャッシュ登録＆即時有効化
self.addEventListener("install", event => {
  self.skipWaiting(); // ← 古いSWを待たず即有効に
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    }).catch(err => {
      console.warn("キャッシュ失敗:", err);
    })
  );
});

// アクティベート時：古いキャッシュ削除＆即反映
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // ← 即時に全タブに反映
  );
});

// fetch時：ネット優先、失敗したらキャッシュ
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
