this.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('v1').then(function(cache) {
        return cache.addAll([
          '/index.html',
          '/assets/css/style.css',
          '/assets/js/data.js',
          '/assets/js/script.js',
          '/assets/fonts/material-design-icons/font/MaterialIcons-Regular.ttf',
          '/assets/frameworks/materialize/css/materialize.min.css',
          '/assets/frameworks/materialize/js/materialize.min.js',
        ]);
      })
    );
  });

  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });
  