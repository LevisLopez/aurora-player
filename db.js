/* db.js — IndexedDB v17 */
const DB_NAME='AuroraPlayerDB',DB_VERSION=1,STORE='tracks';
let _db=null;
function openDB(){
  return new Promise((res,rej)=>{
    if(_db){res(_db);return;}
    const r=indexedDB.open(DB_NAME,DB_VERSION);
    r.onupgradeneeded=e=>{const db=e.target.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:'id',autoIncrement:true});};
    r.onsuccess=e=>{_db=e.target.result;res(_db);};
    r.onerror=e=>rej(e.target.error);
  });
}
async function dbSaveTrack(data){const db=await openDB();return new Promise((res,rej)=>{const r=db.transaction(STORE,'readwrite').objectStore(STORE).add(data);r.onsuccess=e=>res(e.target.result);r.onerror=e=>rej(e.target.error);});}
async function dbGetAllTracks(){
  const db=await openDB();
  return new Promise((res,rej)=>{
    const r=db.transaction(STORE,'readonly').objectStore(STORE).getAll();
    r.onsuccess=e=>res(e.target.result.map(t=>({id:t.id,title:t.title,artist:t.artist,duration:t.duration,size:t.size,favorite:t.favorite===true})));
    r.onerror=e=>rej(e.target.error);
  });
}
async function dbGetTrack(id){const db=await openDB();return new Promise((res,rej)=>{const r=db.transaction(STORE,'readonly').objectStore(STORE).get(id);r.onsuccess=e=>res(e.target.result);r.onerror=e=>rej(e.target.error);});}
async function dbUpdateTrack(id,updates){const full=await dbGetTrack(id);if(!full)return;const db=await openDB();return new Promise((res,rej)=>{const r=db.transaction(STORE,'readwrite').objectStore(STORE).put({...full,...updates});r.onsuccess=()=>res();r.onerror=e=>rej(e.target.error);});}
async function dbDeleteTrack(id){const db=await openDB();return new Promise((res,rej)=>{const r=db.transaction(STORE,'readwrite').objectStore(STORE).delete(id);r.onsuccess=()=>res();r.onerror=e=>rej(e.target.error);});}
async function dbToggleFavorite(id){const full=await dbGetTrack(id);if(!full)return false;const v=!(full.favorite===true);await dbUpdateTrack(id,{favorite:v});return v;}
async function dbGetTotalSize(){const t=await dbGetAllTracks();return t.reduce((s,x)=>s+(x.size||0),0);}
async function dbCheckDuplicate(title,artist){const t=await dbGetAllTracks();const tl=title.toLowerCase().trim(),al=artist.toLowerCase().trim();return t.find(x=>(x.title||'').toLowerCase().trim()===tl&&(x.artist||'').toLowerCase().trim()===al)||null;}

/* Lyrics DB */
let _ldb=null;
function openLyricsDB(){
  return new Promise((res,rej)=>{
    if(_ldb){res(_ldb);return;}
    const r=indexedDB.open('AuroraLyricsDB',1);
    r.onupgradeneeded=e=>e.target.result.createObjectStore('lyrics',{keyPath:'trackId'});
    r.onsuccess=e=>{_ldb=e.target.result;res(_ldb);};
    r.onerror=e=>rej(e.target.error);
  });
}
async function dbSaveLyrics(trackId,lrcText){const db=await openLyricsDB();return new Promise((res,rej)=>{const r=db.transaction('lyrics','readwrite').objectStore('lyrics').put({trackId,lrcText});r.onsuccess=()=>res();r.onerror=e=>rej(e.target.error);});}
async function dbGetLyrics(trackId){const db=await openLyricsDB();return new Promise((res,rej)=>{const r=db.transaction('lyrics','readonly').objectStore('lyrics').get(trackId);r.onsuccess=e=>res(e.target.result?.lrcText||null);r.onerror=e=>rej(e.target.error);});}
async function dbDeleteLyrics(trackId){const db=await openLyricsDB();return new Promise((res,rej)=>{const r=db.transaction('lyrics','readwrite').objectStore('lyrics').delete(trackId);r.onsuccess=()=>res();r.onerror=e=>rej(e.target.error);});}
