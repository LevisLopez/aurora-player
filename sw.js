<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no,interactive-widget=resizes-visual"/>
  <meta name="theme-color" content="#0d0d12"/>
  <meta name="apple-mobile-web-app-capable" content="yes"/>
  <title>Aurora Player</title>
  <link rel="manifest" href="manifest.json"/>
  <link rel="icon" href="icons/icon-192.png"/>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"/>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>

<!-- ═══ PLAYER SCREEN ═══ -->
<div id="screen-player" class="screen active">
  <header class="top-bar">
    <span class="app-name">AURORA</span>
    <div class="top-actions">
      <button id="btn-sleep"      class="icon-btn" aria-label="Sleep timer"><i class="ti ti-moon"></i></button>
      <button id="btn-search"     class="icon-btn" aria-label="Search"><i class="ti ti-search"></i></button>
      <button id="btn-open-admin" class="icon-btn" aria-label="Library"><i class="ti ti-settings"></i></button>
    </div>
  </header>

  <div id="sleep-badge" class="sleep-badge" hidden>
    <i class="ti ti-moon"></i>
    <span id="sleep-countdown">--:--</span>
    <button id="sleep-cancel" class="sleep-cancel-btn"><i class="ti ti-x"></i></button>
  </div>

  <div class="track-info">
    <div id="track-title"  class="track-title">No track loaded</div>
    <div id="track-artist" class="track-artist">Add songs to get started</div>
  </div>

  <!-- EQ bars OR lyrics area -->
  <div id="main-visual" class="main-visual">
    <!-- EQ bars (default) -->
    <div id="eq-artwork" class="eq-artwork">
      <div class="eq-bar" style="--d:0.9s"></div>
      <div class="eq-bar" style="--d:0.7s"></div>
      <div class="eq-bar" style="--d:1.1s"></div>
      <div class="eq-bar" style="--d:0.6s"></div>
      <div class="eq-bar" style="--d:0.8s"></div>
      <div class="eq-bar" style="--d:0.5s"></div>
      <div class="eq-bar" style="--d:1.0s"></div>
      <div class="eq-bar" style="--d:0.75s"></div>
      <div class="eq-bar" style="--d:0.65s"></div>
      <div class="eq-bar" style="--d:0.55s"></div>
      <div class="eq-bar" style="--d:0.85s"></div>
      <div class="eq-bar" style="--d:0.95s"></div>
    </div>
    <!-- Lyrics area (shown when active) -->
    <div id="lyrics-area" class="lyrics-area" hidden>
      <div id="lyrics-status" class="lyrics-status"></div>
      <div id="lyrics-lines"  class="lyrics-lines"></div>
      <div id="lyrics-nofound" class="lyrics-nofound" hidden>
        <p>Lyrics not found</p>
        <button id="lyrics-upload-btn" class="lyrics-upload-btn">
          <i class="ti ti-upload"></i> Upload .lrc file
        </button>
      </div>
      <button id="lyrics-expand-btn" class="lyrics-expand-btn" hidden>
        <i class="ti ti-arrows-maximize"></i>
      </button>
    </div>
    <!-- Toggle button -->
    <button id="btn-toggle-lyrics" class="btn-toggle-lyrics" aria-label="Toggle lyrics">
      <i class="ti ti-microphone-2"></i>
    </button>
  </div>

  <div class="progress-section">
    <div id="progress-wrap" class="progress-bar-wrap" role="slider" aria-label="Seek" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
      <div class="progress-track">
        <div id="progress-fill"  class="progress-fill"></div>
        <div id="progress-thumb" class="progress-thumb"></div>
      </div>
    </div>
    <div class="progress-times">
      <span id="time-current">0:00</span>
      <span id="time-total">0:00</span>
    </div>
  </div>

  <div class="controls-row">
    <button id="btn-shuffle" class="ctrl-btn" aria-label="Shuffle"><i class="ti ti-arrows-shuffle"></i></button>
    <button id="btn-prev"    class="ctrl-btn" aria-label="Previous"><i class="ti ti-player-skip-back"></i></button>
    <button id="btn-play"    class="play-btn" aria-label="Play/Pause"><i class="ti ti-player-play" id="play-icon"></i></button>
    <button id="btn-next"    class="ctrl-btn" aria-label="Next"><i class="ti ti-player-skip-forward"></i></button>
    <button id="btn-repeat"  class="ctrl-btn" aria-label="Repeat"><i class="ti ti-repeat"></i></button>
  </div>

  <div class="playlist-section">
    <div class="playlist-tabs">
      <button id="tab-all" class="tab-btn active">ALL</button>
      <button id="tab-fav" class="tab-btn"><i class="ti ti-heart"></i> FAVORITES</button>
      <span id="playlist-count" class="playlist-count">0 songs</span>
    </div>
    <div id="playlist" class="playlist"></div>
    <div id="empty-favorites" class="empty-favorites" hidden>
      <i class="ti ti-heart-off"></i>
      <p>No favorites yet</p>
      <p class="empty-sub">Tap <i class="ti ti-heart"></i> on any song</p>
    </div>
  </div>
</div>

<!-- ═══ LYRICS FULLSCREEN ═══ -->
<div id="lyrics-fullscreen" class="lyrics-fullscreen" hidden>
  <div class="lf-top">
    <div>
      <div id="lf-title"  class="lf-title">—</div>
      <div id="lf-artist" class="lf-artist">—</div>
    </div>
    <button id="btn-lyrics-close" class="icon-btn"><i class="ti ti-chevron-down"></i></button>
  </div>
  <div id="lf-lines" class="lf-lines"></div>
  <div class="lf-mini-player">
    <div class="lf-progress"><div id="lf-progress-fill" class="lf-progress-fill"></div></div>
    <div class="lf-controls">
      <button id="lf-prev"  class="ctrl-btn"><i class="ti ti-player-skip-back"></i></button>
      <button id="lf-play"  class="play-btn"><i class="ti ti-player-play" id="lf-play-icon"></i></button>
      <button id="lf-next"  class="ctrl-btn"><i class="ti ti-player-skip-forward"></i></button>
    </div>
  </div>
</div>

<!-- ═══ SEARCH OVERLAY ═══ -->
<div id="search-overlay" class="search-overlay" hidden>
  <div class="search-top">
    <button id="search-back" class="icon-btn"><i class="ti ti-arrow-left"></i></button>
    <input type="text" id="search-input" class="search-input" placeholder="Search songs or artists..." autocomplete="off"/>
  </div>
  <div id="search-results" class="search-results"></div>
</div>

<!-- ═══ ADMIN SCREEN ═══ -->
<div id="screen-admin" class="screen">
  <header class="top-bar">
    <button id="btn-back"     class="icon-btn"><i class="ti ti-arrow-left"></i></button>
    <span class="app-name">LIBRARY</span>
    <button id="btn-add-song" class="icon-btn add-btn"><i class="ti ti-plus"></i></button>
  </header>
  <input type="file" id="file-input" accept="audio/*,.mp3,.mp4,.m4a,.ogg,.wav,.flac,.aac,.opus,.weba,.webm,.3gp,.amr" multiple hidden/>
  <div class="admin-info">
    <span id="admin-count">0 songs</span>
    <span id="admin-size">0 MB used</span>
  </div>
  <div id="admin-list"  class="admin-list"></div>
  <div id="empty-state" class="empty-state">
    <i class="ti ti-music-off"></i>
    <p>No songs yet</p>
    <p class="empty-sub">Tap <strong>+</strong> to add your first MP3</p>
  </div>
</div>

<!-- ═══ RENAME MODAL ═══ -->
<div id="modal-rename" class="modal-overlay" hidden>
  <div class="modal-box">
    <div class="modal-title">Edit Track Info</div>
    <label class="modal-label">Title</label>
    <input type="text" id="rename-title"  class="modal-input" placeholder="Track title"/>
    <label class="modal-label">Artist</label>
    <input type="text" id="rename-artist" class="modal-input" placeholder="Artist name"/>
    <div class="modal-actions">
      <button id="modal-cancel" class="modal-btn secondary">Cancel</button>
      <button id="modal-save"   class="modal-btn primary">Save</button>
    </div>
  </div>
</div>

<!-- ═══ SLEEP MODAL ═══ -->
<div id="modal-sleep" class="modal-overlay" hidden>
  <div class="modal-box">
    <div class="modal-title"><i class="ti ti-moon" style="color:#a99cf8;margin-right:8px;"></i>Sleep Timer</div>
    <div class="sleep-options">
      <button class="sleep-opt-btn" data-minutes="15">15 min</button>
      <button class="sleep-opt-btn" data-minutes="30">30 min</button>
      <button class="sleep-opt-btn" data-minutes="45">45 min</button>
      <button class="sleep-opt-btn" data-minutes="60">1 hour</button>
      <button class="sleep-opt-btn" data-minutes="90">1.5 hours</button>
      <button class="sleep-opt-btn" data-minutes="120">2 hours</button>
    </div>
    <label class="modal-label">Custom (minutes)</label>
    <div style="display:flex;gap:10px;">
      <input type="number" id="sleep-custom-input" class="modal-input" placeholder="e.g. 25" min="1" max="480" style="flex:1;"/>
      <button id="sleep-custom-set" class="modal-btn primary" style="flex:0 0 auto;padding:11px 18px;">Set</button>
    </div>
    <button id="modal-sleep-cancel" class="modal-btn secondary" style="margin-top:12px;width:100%;">Cancel</button>
  </div>
</div>

<!-- ═══ LRC UPLOAD ═══ -->
<input type="file" id="lrc-file-input" accept=".lrc,.txt" hidden/>

<div id="toast" class="toast" aria-live="polite"></div>
<audio id="audio" preload="auto"></audio>

<script src="db.js"></script>
<script src="sleep.js"></script>
<script src="player.js"></script>
<script src="lyrics.js"></script>
<script src="app.js"></script>
</body>
</html>
