let static_cache_name = "pwa";

self.addEventListener("install", function(e){
    e.waitUntil(
        caches.open( static_cache_name ).then( function(cache){
            return cache.addAll( ["/"]);
        })
    );
});

self.addEventListener("fetch", function(event){
    console.log( event.request.url );

    event.respondWith(
    // event.response(
        caches.match( event.request ).then( function(response){
            return response || fetch(event.request);
        })
    );
});