const Files_to_store = [
    '/',
    '/db.js',
    '/index.js',
    'styles.css',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
]

const DATASTORE = 'my-api-data-v1';
const FILESTORE = 'my-file-cache-v1';

self.addEventListener('install', function(event){
    event.waitUntil(
        caches.open(FILESTORE).then(cache=>{
            console.log('cache opened!')
            return cache.addAll(Files_to_store)
        })
    )
})

self.addEventListener('fetch', function(event){

    if(event.request.url.includes('/api')){
        event.respondWith(
            caches.open(DATASTORE).then(cache=>{
                return fetch(event.request)
                .then(response=>{
                    if(response.status === 200){
                        cache.put(event.request.url, response.clone())
                    }
                    return response
                }).catch(err=>{
                    return cache.match(event.request)
                })
            })
        )
        return
    }
    event.respondWith(
        fetch(event.request).catch(function(){
            return caches.match(event.request)
        })
    )
})