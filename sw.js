const C="chatly-v5";
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(["./","index.html","manifest.json"])).catch(()=>{}))});
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>clients.claim())));
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;const u=new URL(e.request.url);if(u.origin!==location.origin)return;
e.respondWith(fetch(e.request.url,{cache:"no-store"}).then(r=>{const k=r.clone();caches.open(C).then(c=>c.put(e.request,k));return r}).catch(()=>caches.match(e.request)))});
self.addEventListener("push",e=>{
  let d={};try{d=e.data?e.data.json():{}}catch(_){}
  e.waitUntil((async()=>{
    const list=await self.clients.matchAll({type:"window",includeUncontrolled:true});
    if(list.some(c=>c.visibilityState==="visible"&&c.focused))return;
    const call=/\u{1F4DE}|\u{1F4F9}/u.test((d.body||"")+(d.title||""));
    const o={body:d.body||"New message",icon:"icon-192.png",badge:"icon-192.png",tag:d.tag||"chatly",renotify:true,data:{room:d.room||""}};
    if(call){o.tag="chatly-call";o.requireInteraction=true;o.vibrate=[500,250,500,250,500,250,500,250,500];o.body=(d.body||"Incoming call")+" - tap to answer"}
    await self.registration.showNotification(d.title||"Chatly",o)
  })())
});
self.addEventListener("notificationclick",e=>{e.notification.close();e.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(list=>{if(list.length)return list[0].focus();return clients.openWindow("./")}))});
