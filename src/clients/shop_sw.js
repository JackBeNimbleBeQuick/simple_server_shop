var version = 'v1::';

var appCache = ___CACHE_INSERT___;


self.addEventListener("install", function (event) {
  console.log('WORKER: install event in progress.');

  event.waitUntil(
    caches
      .open(version + 'allCache')
      .then(function (cache) {
        // console.log('cache');
        // console.log(appCache);
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

  if (event.request.method !== 'GET' ||  /(socket.io)/.test(event.request.url) ) {
    console.log('WORKER: IGNORE fetch event.', event.request.method, event.request.url);
    return;
  }
  event.respondWith(
    caches
      .match(event.request)
      .then(function (cached) {
        var networked = fetch(event.request)
        .then(fetchedFromNetwork, unableToResolve)
        .catch(unableToResolve);

        console.log('WORKER: fetch event', cached ? '(cached)' : '(network)', event.request.url);
        console.log(event.request.url);
        console.log(cached ? cached.url : 'NOT cached');
        return cached || networked;

        function fetchedFromNetwork(response) {
          var cacheCopy = response.clone();
          // console.log('WORKER: fetch response from network.', event.request.url);
          caches
            .open(version + 'allCache')
            .then(function add(cache) {
              console.log('WORKER: PUT into cache.', event.request.url);
              cache.put(event.request, cacheCopy);
            });
            // .then(function () {
            //   // console.log('WORKER: fetch response stored in cache.', event.request.url);
            // });

          return response;
        }

        function unableToResolve() {
          console.log('WORKER: Catch Network off line')
        }
      })
  );
});
