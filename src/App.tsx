import { useCallback, type DragEvent } from 'react';
import { AppShell } from './components/AppShell';
import { TitleBar } from './components/TitleBar';
import { NowPlayingCard } from './components/NowPlayingCard';
import { PlayerControls } from './components/PlayerControls';
import { DropZone } from './components/DropZone';
import { CenterStageEmpty } from './components/CenterStageEmpty';
import { Playlist } from './components/Playlist';
import { ToastHost } from './components/ToastHost';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useFileImport } from './hooks/useFileImport';
import { useMediaSession } from './hooks/useMediaSession';
import { usePlayerStore } from './stores/playerStore';
import styles from './App.module.css';

export default function App() {
  const tracks = usePlayerStore((s) => s.tracks);
  const { seek, currentTrack } = useAudioPlayer();
  const { importFiles } = useFileImport();

  useKeyboardShortcuts();
  useMediaSession();

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
            {hasPlaylist ? <Playlist /> : <DropZone small />}
          </aside>
          <section className={styles.centerStage}>
            {hasPlaylist
              ? <NowPlayingCard track={currentTrack} />
              : <CenterStageEmpty />}
          </section>
        </main>
        {hasPlaylist && <PlayerControls onSeek={seek} />}
        <ToastHost />
      </AppShell>
    </div>
  );
}
