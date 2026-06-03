/* app.js — v17 */
const $=id=>document.getElementById(id);

/* DOM */
const screenPlayer=$('screen-player'),screenAdmin=$('screen-admin');
const trackTitle=$('track-title'),trackArtist=$('track-artist');
const progressFill=$('progress-fill'),progressThumb=$('progress-thumb');
const progressWrap=$('progress-wrap'),timeCurrent=$('time-current'),timeTotal=$('time-total');
const playIcon=$('play-icon'),btnPlay=$('btn-play'),btnPrev=$('btn-prev'),btnNext=$('btn-next');
const btnShuffle=$('btn-shuffle'),btnRepeat=$('btn-repeat'),btnOpenAdmin=$('btn-open-admin');
const btnSearch=$('btn-search'),searchOverlay=$('search-overlay'),searchInput=$('search-input');
const searchResults=$('search-results'),searchBack=$('search-back');
const playlistEl=$('playlist'),playlistCount=$('playlist-count');
const tabAll=$('tab-all'),tabFav=$('tab-fav'),emptyFavorites=$('empty-favorites');
const btnBack=$('btn-back'),btnAddSong=$('btn-add-song'),fileInput=$('file-input');
const adminList=$('admin-list'),adminCount=$('admin-count'),adminSize=$('admin-size'),emptyState=$('empty-state');
const modalRename=$('modal-rename'),renameTitle=$('rename-title'),renameArtist=$('rename-artist');
const modalCancel=$('modal-cancel'),modalSave=$('modal-save'),toastEl=$('toast');
const btnSleepOpen=$('btn-sleep'),modalSleep=$('modal-sleep'),modalSleepCancel=$('modal-sleep-cancel');
const sleepCustomInput=$('sleep-custom-input'),sleepCustomSet=$('sleep-custom-set');
const btnToggleLyrics=$('btn-toggle-lyrics'),btnLyricsExpand=$('lyrics-expand-btn');
const btnLyricsClose=$('btn-lyrics-close'),lrcFileInput=$('lrc-file-input');
const lyricsUploadBtn=$('lyrics-upload-btn');
const lfPlay=$('lf-play'),lfPrev=$('lf-prev'),lfNext=$('lf-next'),lfPlayIcon=$('lf-play-icon');
const lfProgressFill=$('lf-progress-fill');

let activeTab='all',renamingId=null,toastTimer=null;

/* Toast */
function showToast(msg,ms=2500){toastEl.textContent=msg;toastEl.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toastEl.classList.remove('show'),ms);}

/* Screens */
function showScreen(n){screenPlayer.classList.toggle('active',n==='player');screenAdmin.classList.toggle('active',n==='admin');}
btnOpenAdmin.addEventListener('click',()=>{renderAdminList();showScreen('admin');});
btnBack.addEventListener('click',()=>showScreen('player'));

/* Player callbacks */
Player.onTrackChange=track=>{
  trackTitle.textContent=track?(track.title||'Unknown'):'No track loaded';
  trackArtist.textContent=track?(track.artist||'Unknown'):'Add songs to get started';
  Lyrics.onTrackChange(track);
  renderPlaylist();
};
Player.onPlayState=playing=>{
  playIcon.className=playing?'ti ti-player-pause':'ti ti-player-play';
  if(lfPlayIcon)lfPlayIcon.className=playing?'ti ti-player-pause':'ti ti-player-play';
};
Player.onProgress=(ratio,current,total)=>{
  const pct=(ratio*100).toFixed(2)+'%';
  progressFill.style.width=pct;progressThumb.style.left=pct;
  timeCurrent.textContent=Player.formatTime(current);timeTotal.textContent=Player.formatTime(total);
  if(lfProgressFill)lfProgressFill.style.width=pct;
};
Player.onQueueChange=()=>renderPlaylist();

/* Transport */
btnPlay.addEventListener('click',()=>Player.togglePlay());
btnPrev.addEventListener('click',()=>Player.prev());
btnNext.addEventListener('click',()=>Player.next(true));
btnShuffle.addEventListener('click',()=>{btnShuffle.classList.toggle('on',Player.toggleShuffle());showToast(Player.shuffleOn?'Shuffle on':'Shuffle off');});
btnRepeat.addEventListener('click',()=>{
  const mode=Player.cycleRepeat(),icon=btnRepeat.querySelector('i');
  btnRepeat.classList.toggle('on',mode!=='none');
  icon.className=mode==='one'?'ti ti-repeat-once':'ti ti-repeat';
  if(mode!=='none')showToast(mode==='all'?'Repeat all':'Repeat one');
});

/* Seek */
function seekFrom(e){const r=progressWrap.getBoundingClientRect(),x=(e.touches?e.touches[0].clientX:e.clientX)-r.left;Player.seek(Math.min(Math.max(x/r.width,0),1));}
progressWrap.addEventListener('click',seekFrom);
progressWrap.addEventListener('touchstart',seekFrom,{passive:true});

/* Lyrics toggle */
btnToggleLyrics.addEventListener('click',()=>Lyrics.toggleInline());
if(btnLyricsExpand)btnLyricsExpand.addEventListener('click',()=>Lyrics.openFullscreen());
if(btnLyricsClose)btnLyricsClose.addEventListener('click',()=>Lyrics.closeFullscreen());
if(lyricsUploadBtn)lyricsUploadBtn.addEventListener('click',()=>lrcFileInput.click());
lrcFileInput.addEventListener('change',async()=>{
  const file=lrcFileInput.files[0];if(!file)return;
  const track=Player.currentTrack();if(!track){showToast('No track playing');return;}
  const ok=await Lyrics.uploadLRC(file,track.id);
  lrcFileInput.value='';showToast(ok?'Lyrics loaded!':'Invalid .lrc file');
});

/* Lyrics fullscreen mini controls */
if(lfPlay)lfPlay.addEventListener('click',()=>Player.togglePlay());
if(lfPrev)lfPrev.addEventListener('click',()=>Player.prev());
if(lfNext)lfNext.addEventListener('click',()=>Player.next(true));

/* Search */
btnSearch.addEventListener('click',()=>{searchOverlay.hidden=false;searchInput.value='';searchResults.innerHTML='<div class="search-empty">Type to search...</div>';setTimeout(()=>searchInput.focus(),100);});
searchBack.addEventListener('click',()=>{searchOverlay.hidden=true;});
searchInput.addEventListener('input',()=>{
  const q=searchInput.value.toLowerCase().trim();
  if(!q){searchResults.innerHTML='<div class="search-empty">Type to search...</div>';return;}
  const cur=Player.currentTrack();
  const list=Player.tracks.filter(t=>(t.title||'').toLowerCase().includes(q)||(t.artist||'').toLowerCase().includes(q));
  if(!list.length){searchResults.innerHTML='<div class="search-empty">No results found</div>';return;}
  searchResults.innerHTML=list.map((t,i)=>`<div class="playlist-item ${t.id===cur?.id?'active':''}" data-id="${t.id}" role="button" tabindex="0">
    <span class="pl-num">${i+1}</span>
    <div class="pl-info"><div class="pl-title">${esc(t.title||'Unknown')}</div><div class="pl-artist">${esc(t.artist||'Unknown')}</div></div>
    <button class="fav-btn ${t.favorite?'on':''}" data-id="${t.id}"><i class="ti ti-heart${t.favorite?'-filled':''}"></i></button>
    <span class="pl-dur">${t.duration?Player.formatTime(t.duration):'—'}</span>
  </div>`).join('');
  searchResults.querySelectorAll('.playlist-item').forEach(el=>{
    el.addEventListener('click',e=>{if(e.target.closest('.fav-btn'))return;Player.playById(parseInt(el.dataset.id,10));searchOverlay.hidden=true;});
  });
  searchResults.querySelectorAll('.fav-btn').forEach(btn=>{
    btn.addEventListener('click',async e=>{e.stopPropagation();const id=parseInt(btn.dataset.id,10),v=!(btn.classList.contains('on'));await dbToggleFavorite(id);const t=Player.tracks.find(t=>t.id===id);if(t)t.favorite=v;renderPlaylist();searchInput.dispatchEvent(new Event('input'));showToast(v?'♥ Added':'Removed from Favorites');});
  });
});

/* Tabs */
tabAll.addEventListener('click',()=>{if(activeTab==='all')return;activeTab='all';tabAll.classList.add('active');tabFav.classList.remove('active');Player.setFavoritesOnly(false);});
tabFav.addEventListener('click',()=>{if(activeTab==='favorites')return;activeTab='favorites';tabFav.classList.add('active');tabAll.classList.remove('active');Player.setFavoritesOnly(true);});

/* Playlist */
function renderPlaylist(){
  const cur=Player.currentTrack();
  let list=[...Player.tracks];
  if(activeTab==='favorites')list=list.filter(t=>t.favorite===true);
  playlistCount.textContent=activeTab==='favorites'?`${list.length} favorite${list.length!==1?'s':''}`:`${list.length} song${list.length!==1?'s':''}`;
  const noFavs=activeTab==='favorites'&&list.length===0;
  emptyFavorites.hidden=!noFavs;playlistEl.style.display=noFavs?'none':'';
  if(!list.length){playlistEl.innerHTML='';return;}
  playlistEl.innerHTML=list.map((t,idx)=>{
    const active=t.id===cur?.id,fav=t.favorite===true;
    const num=active?'<div class="playing-bars"><span></span><span></span><span></span></div>':`<span class="pl-num">${idx+1}</span>`;
    return `<div class="playlist-item ${active?'active':''}" data-id="${t.id}" role="button" tabindex="0">
      ${num}
      <div class="pl-info"><div class="pl-title">${esc(t.title||'Unknown')}</div><div class="pl-artist">${esc(t.artist||'Unknown')}</div></div>
      <button class="fav-btn ${fav?'on':''}" data-id="${t.id}"><i class="ti ti-heart${fav?'-filled':''}"></i></button>
      <span class="pl-dur">${t.duration?Player.formatTime(t.duration):'—'}</span>
    </div>`;
  }).join('');
  playlistEl.querySelectorAll('.playlist-item').forEach(el=>{el.addEventListener('click',e=>{if(e.target.closest('.fav-btn'))return;Player.playById(parseInt(el.dataset.id,10));});});
  playlistEl.querySelectorAll('.fav-btn').forEach(btn=>{
    btn.addEventListener('click',async e=>{e.stopPropagation();const id=parseInt(btn.dataset.id,10),v=!(btn.classList.contains('on'));await dbToggleFavorite(id);const t=Player.tracks.find(t=>t.id===id);if(t)t.favorite=v;if(activeTab==='favorites')Player.setFavoritesOnly(true);renderPlaylist();showToast(v?'♥ Added to Favorites':'Removed from Favorites');});
  });
  const a=playlistEl.querySelector('.playlist-item.active');if(a)a.scrollIntoView({block:'nearest',behavior:'smooth'});
}

/* Admin */
async function renderAdminList(){
  const tracks=Player.tracks,sz=await dbGetTotalSize();
  adminCount.textContent=`${tracks.length} song${tracks.length!==1?'s':''}`;
  adminSize.textContent=`${(sz/1024/1024).toFixed(1)} MB used`;
  emptyState.classList.toggle('visible',tracks.length===0);
  if(!tracks.length){adminList.innerHTML='';return;}
  adminList.innerHTML=tracks.map(t=>`<div class="admin-item" data-id="${t.id}">
    <div class="admin-thumb"><i class="ti ti-music"></i></div>
    <div class="admin-info-col"><div class="admin-title">${esc(t.title||'Unknown')}</div><div class="admin-artist">${esc(t.artist||'Unknown')}</div></div>
    <div class="admin-actions">
      <button class="admin-btn edit-btn" data-id="${t.id}"><i class="ti ti-pencil"></i></button>
      <button class="admin-btn delete delete-btn" data-id="${t.id}"><i class="ti ti-trash"></i></button>
    </div>
  </div>`).join('');
  adminList.querySelectorAll('.edit-btn').forEach(b=>b.addEventListener('click',()=>openRenameModal(parseInt(b.dataset.id,10))));
  adminList.querySelectorAll('.delete-btn').forEach(b=>b.addEventListener('click',()=>deleteSong(parseInt(b.dataset.id,10))));
}

/* File import */
btnAddSong.addEventListener('click',()=>fileInput.click());
fileInput.addEventListener('change',async()=>{
  const files=Array.from(fileInput.files);if(!files.length)return;
  const EXTS=/\.(mp3|mp4|m4a|ogg|oga|opus|wav|flac|aac|weba|webm|3gp|amr)$/i;
  let added=0,skipped=0,dups=[];
  for(const file of files){
    const mime=file.type||'';
    const ok=mime.startsWith('audio/')||mime.startsWith('video/mp4')||mime.startsWith('video/m4v')||EXTS.test(file.name)||mime===''||mime==='application/octet-stream';
    if(!ok){skipped++;continue;}
    const name=file.name.replace(/\.[^/.]+$/,'');
    let title=name,artist='Unknown';
    const dash=name.indexOf(' - ');if(dash!==-1){artist=name.slice(0,dash).trim();title=name.slice(dash+3).trim();}
    const dup=await dbCheckDuplicate(title,artist);if(dup){dups.push(title);continue;}
    const dur=await getAudioDuration(file);
    await dbSaveTrack({title,artist,blob:file,duration:dur,size:file.size,favorite:false});
    added++;
  }
  fileInput.value='';
  if(dups.length)showToast(`Already exists: ${dups.slice(0,2).join(', ')}${dups.length>2?'...':''}`,4000);
  if(added>0){await Player.refreshLibrary();renderAdminList();renderPlaylist();showToast(`${added} song${added>1?'s':''} added`);}
  else if(!dups.length)showToast('No supported audio files found');
});
function getAudioDuration(file){return new Promise(res=>{const url=URL.createObjectURL(file),a=new Audio();a.src=url;a.addEventListener('loadedmetadata',()=>{URL.revokeObjectURL(url);res(isFinite(a.duration)?a.duration:0);});a.addEventListener('error',()=>{URL.revokeObjectURL(url);res(0);});});}

/* Delete & Rename */
async function deleteSong(id){if(!confirm('Remove this song?'))return;await dbDeleteTrack(id);await dbDeleteLyrics(id);await Player.refreshLibrary();renderAdminList();renderPlaylist();showToast('Song removed');}
function openRenameModal(id){const t=Player.tracks.find(t=>t.id===id);if(!t)return;renamingId=id;renameTitle.value=t.title||'';renameArtist.value=t.artist||'';modalRename.hidden=false;renameTitle.focus();}
modalCancel.addEventListener('click',()=>{modalRename.hidden=true;renamingId=null;});
modalRename.addEventListener('click',e=>{if(e.target===modalRename){modalRename.hidden=true;renamingId=null;}});
modalSave.addEventListener('click',async()=>{if(!renamingId)return;await dbUpdateTrack(renamingId,{title:renameTitle.value.trim()||'Unknown',artist:renameArtist.value.trim()||'Unknown'});await Player.refreshLibrary();renderAdminList();renderPlaylist();modalRename.hidden=true;renamingId=null;showToast('Track updated');});

/* Sleep Timer */
btnSleepOpen.addEventListener('click',()=>{if(SleepTimer.active){SleepTimer.cancel();showToast('Sleep timer cancelled');return;}modalSleep.hidden=false;});
modalSleepCancel.addEventListener('click',()=>modalSleep.hidden=true);
modalSleep.addEventListener('click',e=>{if(e.target===modalSleep)modalSleep.hidden=true;});
document.querySelectorAll('.sleep-opt-btn').forEach(btn=>btn.addEventListener('click',()=>{SleepTimer.start(parseInt(btn.dataset.minutes,10));modalSleep.hidden=true;showToast(`Sleep timer: ${btn.textContent}`);}));
sleepCustomSet.addEventListener('click',()=>{const v=parseInt(sleepCustomInput.value,10);if(!v||v<1||v>480){showToast('Enter 1–480 minutes');return;}SleepTimer.start(v);modalSleep.hidden=true;sleepCustomInput.value='';showToast(`Sleep timer: ${v} min`);});

/* Util */
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

/* Init */
(async()=>{Player.setupMediaSession();await Player.loadLibrary();renderPlaylist();})();
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
