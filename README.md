# Aurora English

Aurora English is an offline-first karaoke player redesigned for English learning. The main screen prioritizes large synced lyrics, word-by-word highlighting, and a clean interface with most options grouped inside Settings.

## What changed in this version

- Cleaner main screen focused on lyrics instead of music-player decoration.
- Large karaoke text that scrolls upward and highlights line-by-line and word-by-word.
- One fullscreen karaoke mode: double tap the lyrics area. Controls are hidden by default; tap once to show the timeline, play/pause, previous/next, and Back. Tap the lyric area again to hide them.
- Settings gear groups themes, night mode, sleep timer, filters, playlists, Top 10, lyrics upload, backup import/export, and library management.
- Many color themes plus a very dark Night Mode for sleeping.
- Android/browser Back behavior now closes the active screen, panel, modal, or fullscreen view before leaving the app.
- Each song row has a three-dot menu for Favorites, playlists, edit, play, and delete.
- Main screen includes Add songs and Online search.
- Online search uses public audio sources and also supports direct legal audio URLs. Some sites may block direct importing; in that case, download the file manually and use Add songs.
- Existing songs are preserved because the app keeps the same IndexedDB database name: `AuroraPlayerDB`.

## How to run locally

Use a local web server from this folder:

```bash
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Publishing

Upload all files in this folder to GitHub Pages or any static hosting service. Do not rename the main files unless you also update `index.html` and `sw.js`.

## Lyrics

Synced lyrics use `.lrc` files. Enhanced LRC word timing like `<00:12.34>` is supported when available. If a normal line-timed LRC is used, Aurora estimates word timing so the karaoke still highlights word by word.
