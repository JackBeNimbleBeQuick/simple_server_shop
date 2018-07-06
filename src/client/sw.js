//Array of versioned app components
let cacheVersion = {
  version: 'appShop.0001',
  cache: ['./app.js'],
};

self.addEventListener('install', event => {
  console.log(`Install version ${cacheVersion.version}`);
  event.waitUntil( preCache() )
});

// self.addEventListener('activate', event => {
//   console.log(event);
//   // event.respondWith( preCache() )
// });

self.addEventListener('fetch', event => {
  event.respondWith( fromCache() )
});

//** methods
preCache = () => {
  return caches.open(cacheVersion.cache).then( cache => {
    return cache.addAll(cacheVersion.cache);
  });
}

fromCache = (request) => {
  // let url = new URL(request.url);
  caches.match( request ).then(response => {
    if(response){
      return response;
    } else  {
      return fetch(request).then( (res) => {     //fetch from internet
      return caches.open( cacheVersion.cache )
        .then( ( cache ) => {
          cache.put(request.url, res.clone());    //save the response for future
          return res;   // return the fetched data
        })
      })
      .catch( (err) => { // fallback mechanism
        return caches.open(CACHE_CONTAINING_ERROR_MESSAGES)
          .then( (cache ) => {
            return cache.match('/app.js');
          });
      });
    }
  })
}
