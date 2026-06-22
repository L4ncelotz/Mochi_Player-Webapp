import { useCallback, useEffect, type DragEvent } from 'react';
import { AppShell } from './components/AppShell';
import { TitleBar } from './components/TitleBar';
import { NowPlayingCard } from './components/NowPlayingCard';
import { PlayerControls } from './components/PlayerControls';
import { DropZone } from './components/DropZone';
import { CenterStageEmpty } from './components/CenterStageEmpty';
import { Playlist } from './components/Playlist';
import { ToastHost } from './components/ToastHost';
import { MochiDiaryDrawer } from './components/MochiDiaryDrawer';
import { SettingsModal } from './components/SettingsModal';
import { GlobalPlayer } from './components/GlobalPlayer';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useFileImport } from './hooks/useFileImport';
import { useMediaSession } from './hooks/useMediaSession';
import { usePlayerStore } from './stores/playerStore';
import styles from './App.module.css';

export default function App() {
  const tracks = usePlayerStore((s) => s.tracks);
  const currentTrackId = usePlayerStore((s) => s.currentTrackId);
  const setSeekRequest = usePlayerStore((s) => s.setSeekRequest);
  const settings = usePlayerStore((s) => s.settings);
  const currentTrack = tracks.find(t => t.id === currentTrackId);
  const { importFiles } = useFileImport();

  useKeyboardShortcuts();
  useMediaSession();

  // Initialize reduce motion attribute
  useEffect(() => {
    const root = document.getElementById('root');
    if (root) root.dataset.reduceMotion = String(settings.reduceMotion);
  }, []); // Only run once on mount, updates are handled in playerStore

  // Global drop handler (entire app window)
  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files.length > 0) {
        importFiles(e.dataTransfer.files);
      }
    },
    [importFiles],
  );

  const hasPlaylist = tracks.length > 0;

  return (
    <div onDragOver={handleDragOver} onDrop={handleDrop} className={styles.appContainer}>
      <AppShell>
        <TitleBar />
        <main className={styles.mainContent}>
          <aside className={styles.sidebar}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {hasPlaylist ? <Playlist /> : <DropZone />}
            </div>
            <button 
              className={styles.settingsBtn}
              onClick={() => usePlayerStore.getState().toggleSettings()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              <span>Settings</span>
            </button>
          </aside>
          <section className={styles.centerStage}>
            {hasPlaylist
              ? <NowPlayingCard track={currentTrack} />
              : <CenterStageEmpty />}
            <MochiDiaryDrawer />
          </section>
        </main>
        {hasPlaylist && <PlayerControls onSeek={setSeekRequest} />}
        <ToastHost />
        <GlobalPlayer />
        <SettingsModal />
      </AppShell>
    </div>
  );
}
