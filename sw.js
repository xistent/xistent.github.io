const chng = `
    Tinker with this string in order to push updates to your app
`;

const vn = "version-s1";

var appCash = [
    '/index.html',
    '/lib/skyroute.css',
    '/lib/skyroute.js'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(vn).then((cache) => {
            return cache.addAll(appCash);
        })
    );
});

self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);
    // e.waitUntil(pauseReq);
    if (e.request.mode === "navigate" && url.origin === location.origin && (!url.pathname.includes("."))) {
        e.respondWith(pauseReq(url));
    } else {
        (appCash.includes(url.pathname)) ? e.respondWith(caches.match(url)) : e.respondWith(fetch(url));
    }
});


var readDB=(dbDef,key,dex)=>{return new Promise((resolve,reject)=>{req=indexedDB.open(dbDef.dbName,dbDef.dbVer);req.onsuccess=(ev)=>{req=ev.target.result;var trx=req.transaction([dbDef.dbStore]).objectStore(dbDef.dbStore);trx=trx.get(key);trx.onsuccess=(r)=>{routesSW=r.target.result;resolve()}
trx.onerror=(e)=>{reject(e)}}})}
var routesSW=0;self.addEventListener('message',(event)=>{if(event.data.action==='skipWaiting'){self.skipWaiting()}else if(event.data.action==='clearOld'){event.waitUntil(caches.keys().then((keys)=>Promise.all(keys.map((k)=>{if(!vn.includes(k)){return caches.delete(k)}}))).then(()=>{console.log('[App Updated]')}))}else if(event.data.action==='rescanPath'){console.log("rebuilding paths");dbScan()}});var dbScan=()=>{return new Promise((r)=>{
readDB(dbDef,1).then(e=>{r()})})}
var pauseReq=async(url)=>{if(routesSW===0){await dbScan()}
if(routesSW[url.pathname.slice(1)]){return caches.match("/index.html")}else{return fetch(url)}};var dbDef={dbName:"SkyRoutes",dbVer:1,dbStore:"routes"}