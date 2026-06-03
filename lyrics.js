/* lyrics.js — Karaoke engine v17 */
const Lyrics = (() => {
  let lines=[], currentLine=-1, trackId=null, lyricsOn=false, fullscreenOn=false;
  const audio = document.getElementById('audio');

  function parseLRC(text){
    const re=/\[(\d{1,3}):(\d{2})\.(\d{1,3})\](.*)/;
    return text.split('\n').reduce((arr,row)=>{
      const m=row.match(re); if(!m)return arr;
      const t=parseInt(m[1])*60+parseInt(m[2])+parseInt(m[3].padEnd(3,'0').slice(0,3))/1000;
      const s=m[4].trim(); if(s)arr.push({time:t,text:s});
      return arr;
    },[]).sort((a,b)=>a.time-b.time);
  }

  async function fetchLRC(title,artist){
    try{
      const q=encodeURIComponent(`${title} ${artist}`);
      const r=await fetch(`https://lrclib.net/api/search?q=${q}`);
      if(!r.ok)return null;
      const d=await r.json(); if(!d.length)return null;
      const m=d.find(x=>x.syncedLyrics&&(x.trackName||'').toLowerCase().includes((title||'').toLowerCase().slice(0,4)))||d.find(x=>x.syncedLyrics)||null;
      return m?.syncedLyrics||null;
    }catch{return null;}
  }

  async function loadLyrics(track){
    if(!track){setStatus('No track playing');lines=[];return;}
    if(trackId===track.id&&lines.length){renderInline();return;}
    trackId=track.id; lines=[];
    const saved=await dbGetLyrics(track.id);
    if(saved){lines=parseLRC(saved);renderInline();if(fullscreenOn)renderFullscreen();return;}
    setStatus('Searching lyrics...');
    const lrc=await fetchLRC(track.title||'',track.artist||'');
    if(lrc){await dbSaveLyrics(track.id,lrc);lines=parseLRC(lrc);renderInline();if(fullscreenOn)renderFullscreen();}
    else showNotFound();
  }

  function setStatus(msg){
    document.getElementById('lyrics-status').textContent=msg;
    document.getElementById('lyrics-status').style.display='block';
    document.getElementById('lyrics-lines').innerHTML='';
    const nf=document.getElementById('lyrics-nofound');if(nf)nf.hidden=true;
  }

  function showNotFound(){
    document.getElementById('lyrics-status').style.display='none';
    document.getElementById('lyrics-lines').innerHTML='';
    const nf=document.getElementById('lyrics-nofound');if(nf)nf.hidden=false;
  }

  function renderInline(){
    document.getElementById('lyrics-status').style.display='none';
    const nf=document.getElementById('lyrics-nofound');if(nf)nf.hidden=true;
    const el=document.getElementById('lyrics-lines');
    el.innerHTML=lines.map((l,i)=>`<div class="lyric-line-inline" data-i="${i}">${esc(l.text)}</div>`).join('');
    document.getElementById('lyrics-expand-btn').hidden=false;
    currentLine=-1; tick();
  }

  function renderFullscreen(){
    const el=document.getElementById('lf-lines');
    if(!el)return;
    el.innerHTML=lines.map((l,i)=>`<div class="lyric-line" data-i="${i}">${esc(l.text)}</div>`).join('');
    el.querySelectorAll('.lyric-line').forEach((div,i)=>{
      div.addEventListener('click',()=>{audio.currentTime=lines[i].time;if(audio.paused)audio.play().catch(()=>{});});
    });
    currentLine=-1; tickFull();
  }

  function tick(){
    if(!lyricsOn||!lines.length)return;
    const t=audio.currentTime;
    let idx=-1;
    for(let i=0;i<lines.length;i++){if(lines[i].time<=t)idx=i;else break;}
    if(idx===currentLine)return;
    currentLine=idx;
    document.querySelectorAll('.lyric-line-inline').forEach((el,i)=>{
      el.classList.toggle('active',i===idx);
      el.classList.toggle('past',i<idx);
    });
  }

  function tickFull(){
    if(!fullscreenOn||!lines.length)return;
    const t=audio.currentTime;
    let idx=-1;
    for(let i=0;i<lines.length;i++){if(lines[i].time<=t)idx=i;else break;}
    document.querySelectorAll('.lyric-line').forEach((el,i)=>{
      el.classList.toggle('active',i===idx);
      el.classList.toggle('past',i<idx);
    });
    const a=document.querySelector('.lyric-line.active');
    if(a)a.scrollIntoView({block:'center',behavior:'smooth'});
  }

  audio.addEventListener('timeupdate',()=>{tick();tickFull();});

  function toggleInline(){
    lyricsOn=!lyricsOn;
    document.getElementById('eq-artwork').hidden=lyricsOn;
    document.getElementById('lyrics-area').hidden=!lyricsOn;
    document.getElementById('btn-toggle-lyrics').classList.toggle('on',lyricsOn);
    if(lyricsOn){
      const track=window.Player?.currentTrack();
      if(track)loadLyrics(track);
    }
  }

  function openFullscreen(){
    fullscreenOn=true;
    const fs=document.getElementById('lyrics-fullscreen');
    fs.hidden=false;
    const track=window.Player?.currentTrack();
    if(track){
      document.getElementById('lf-title').textContent=track.title||'—';
      document.getElementById('lf-artist').textContent=track.artist||'—';
    }
    if(lines.length)renderFullscreen();
    else if(track)loadLyrics(track);
  }

  function closeFullscreen(){
    fullscreenOn=false;
    document.getElementById('lyrics-fullscreen').hidden=true;
  }

  function onTrackChange(track){
    currentLine=-1; lines=[]; trackId=null;
    if(lyricsOn)loadLyrics(track);
    if(fullscreenOn){
      document.getElementById('lf-title').textContent=track?.title||'—';
      document.getElementById('lf-artist').textContent=track?.artist||'—';
      if(track)loadLyrics(track);
    }
  }

  async function uploadLRC(file,tId){
    const text=await file.text();
    const p=parseLRC(text);
    if(!p.length)return false;
    await dbSaveLyrics(tId,text);
    lines=p; renderInline();
    if(fullscreenOn)renderFullscreen();
    return true;
  }

  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

  return{toggleInline,openFullscreen,closeFullscreen,onTrackChange,uploadLRC};
})();
