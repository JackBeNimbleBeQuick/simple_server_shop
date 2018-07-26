var version = 'v1::';

var appCache = ["/","/shop","/shop/css/main.css","/shop/app.js","/public/imgs/products/b2449_main_.jpg","/public/imgs/products/b2449_thumbnail_.jpg","/public/imgs/products/b2449_images_1_.jpg","/public/imgs/products/b2449_images_2_.jpg","/public/imgs/products/b2449_images_3_.jpg","/public/imgs/products/b2451_main_.jpg","/public/imgs/products/b2451_thumbnail_.jpg","/public/imgs/products/b2451_images_1_.jpg","/public/imgs/products/b2451_images_2_.jpg","/public/imgs/products/b2450_main_.jpg","/public/imgs/products/b2450_thumbnail_.jpg","/public/imgs/products/b2450_images_1_.jpg","/public/imgs/products/b2450_images_2_.jpg","/public/imgs/products/b2452_main_.jpg","/public/imgs/products/b2452_thumbnail_.jpg","/public/imgs/products/b2452_images_1_.jpg","/public/imgs/products/b2452_images_2_.jpg","/public/imgs/products/b2458_main_.jpg","/public/imgs/products/b2458_thumbnail_.jpg","/public/imgs/products/b2458_images_1_.jpg","/public/imgs/products/b2458_images_2_.jpg","/public/imgs/products/b2459_main_.jpg","/public/imgs/products/b2459_thumbnail_.jpg","/public/imgs/products/b2459_images_1_.jpg","/public/imgs/products/b2457_main_.jpg","/public/imgs/products/b2457_thumbnail_.jpg","/public/imgs/products/b2457_images_1_.jpg","/public/imgs/products/b2465_main_.jpg","/public/imgs/products/b2465_thumbnail_.jpg","/public/imgs/products/b2465_images_1_.jpg","/public/imgs/products/b2465_images_2_.jpg","/public/imgs/products/b2467_main_.jpg","/public/imgs/products/b2467_thumbnail_.jpg","/public/imgs/products/b2467_images_1_.jpg","/public/imgs/products/b2460_main_.jpg","/public/imgs/products/b2460_thumbnail_.jpg","/public/imgs/products/b2460_images_1_.jpg"];


self.addEventListener("install", function (event) {
  console.log('WORKER: install event in progress.');

  event.waitUntil(
    caches
      .open(version + 'allCache')
      .then(function (cache) {
        console.log('cache');
        console.log(appCache);
        return cache.addAll(appCache);
      })
      .then(function () {
        console.log('WORKER: install completed');
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(async function() {
    // Feature-detect
    if (self.registration.navigationPreload) {
      // Enable navigation preloads!
      self.registration.navigationPreload.enable();
      self.clients.claim();
      console.log('activate - now ready to fetch');
    }
  }());
});

self.addEventListener("fetch", function (event) {
  // console.log('WORKER: fetch event in progress.');

  if (event.request.method !== 'GET') {
    // console.log('WORKER: fetch event ignored.', event.request.method, event.request.url);
    return;
  }
  event.respondWith(
    caches
      .match(event.request)
      .then(function (cached) {
        var networked = fetch(event.request)
        .then(fetchedFromNetwork, unableToResolve)
        .catch(unableToResolve);
        // console.log('WORKER: fetch event', cached ? '(cached)' : '(network)', event.request.url);
        return cached || networked;
        function fetchedFromNetwork(response) {
          var cacheCopy = response.clone();
          // console.log('WORKER: fetch response from network.', event.request.url);
          caches
            .open(version + 'pages')
            .then(function add(cache) {
              cache.put(event.request, cacheCopy);
            })
            .then(function () {
              // console.log('WORKER: fetch response stored in cache.', event.request.url);
            });

          return response;
        }
        function unableToResolve() {
          console.log('WORKER: fetch request failed in both cache and network.');
          return new Response('<h1>Service Unavailable</h1>', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/html'
            })
          });
        }
      })
  );
});
