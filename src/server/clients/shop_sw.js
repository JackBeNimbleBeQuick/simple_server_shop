var version = 'v1::';

var appCache = ["/","/shop","/shop/app.js","/shop/css/main.css","/public/css/main.css","/public/favicon.ico","/public/imgs/products/b2449_main_.jpg","/public/imgs/products/b2449_thumbnail_.jpg","/public/imgs/products/b2449_images_1_.jpg","/public/imgs/products/b2449_images_2_.jpg","/public/imgs/products/b2449_images_3_.jpg","/public/imgs/products/b2451_main_.jpg","/public/imgs/products/b2451_thumbnail_.jpg","/public/imgs/products/b2451_images_1_.jpg","/public/imgs/products/b2451_images_2_.jpg","/public/imgs/products/b2450_main_.jpg","/public/imgs/products/b2450_thumbnail_.jpg","/public/imgs/products/b2450_images_1_.jpg","/public/imgs/products/b2450_images_2_.jpg","/public/imgs/products/b2459_main_.jpg","/public/imgs/products/b2459_thumbnail_.jpg","/public/imgs/products/b2459_images_1_.jpg","/public/imgs/products/b2465_main_.jpg","/public/imgs/products/b2465_thumbnail_.jpg","/public/imgs/products/b2465_images_1_.jpg","/public/imgs/products/b2465_images_2_.jpg","/public/imgs/products/b2457_main_.jpg","/public/imgs/products/b2457_thumbnail_.jpg","/public/imgs/products/b2457_images_1_.jpg","/public/imgs/products/b2458_main_.jpg","/public/imgs/products/b2458_thumbnail_.jpg","/public/imgs/products/b2458_images_1_.jpg","/public/imgs/products/b2458_images_2_.jpg","/public/imgs/products/b2452_main_.jpg","/public/imgs/products/b2452_thumbnail_.jpg","/public/imgs/products/b2452_images_1_.jpg","/public/imgs/products/b2452_images_2_.jpg","/public/imgs/products/b2460_main_.jpg","/public/imgs/products/b2460_thumbnail_.jpg","/public/imgs/products/b2460_images_1_.jpg","/public/imgs/products/b2467_main_.jpg","/public/imgs/products/b2467_thumbnail_.jpg","/public/imgs/products/b2467_images_1_.jpg"];


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

//@NOTE future boiler plate

// var credentialCheck = (token:string, providers: Array<string>) => {
//   if ('credentials' in navigator) {
//     (navigator.credentials as any).get({
//       password: true,
//       federated: {
//         providers: providers
//       },
//       unmediated: true,
//     }).then((cred:any) =>{
//       if (cred) {
//         let form = new FormData();
//         form.append('email', cred.id);
//         form.append('password', cred.password);
//         form.append('csrf_token', token);
//         return fetch('/signin', {
//           method: 'POST',
//           credentials: 'include',
//           body: form
//         });
//       } else {
//         // Fallback to sign-in form
//       }
//     }).then( (res:any) => {
//       if (res.status === 200) {
//         return res.json();
//       } else {
//         throw 'Auth failed';
//       }
//     }).then( (profile:any)=> {
//       console.log('Auth succeeded', profile);
//     });
//   }
//
// }
