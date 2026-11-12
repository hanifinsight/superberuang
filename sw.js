const CACHE='bear-adventure-053';
const FILES=[
  "./",
  "./index.html",
  "./css/style.css",
  "./js/game.js",
  "./manifest.json",
  "./assets/models/bear.glb",
  "./assets/textures/bark.png",
  "./assets/textures/dirt-path.png",
  "./assets/textures/grass.png",
  "./assets/textures/leaves.png",
  "./assets/textures/plaster.png",
  "./assets/textures/roof.png",
  "./assets/textures/stone.png",
  "./assets/textures/water.png",
  "./assets/audio/checkpoint.wav",
  "./assets/audio/coin.wav",
  "./assets/audio/dialog.wav",
  "./assets/audio/forest-ambience.wav",
  "./assets/audio/hurt.wav",
  "./assets/audio/jump.wav",
  "./assets/audio/step.wav"
];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(url.origin!==location.origin)return;
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
  if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}
  return response;
 })));
});
