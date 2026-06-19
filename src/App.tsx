import { useCallback, type DragEvent } from 'react';
import { AppShell } from './components/AppShell';
import { TitleBar } from './components/TitleBar';
import { NowPlayingCard } from './components/NowPlayingCard';
import { PlayerControls } from './components/PlayerControls';
import { DropZone } from './components/DropZone';
import { Playlist } from './components/Playlist';
import { ToastHost } from './components/ToastHost';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useFileImport } from './hooks/useFileImport';
import { usePlayerStore } from './stores/playerStore';

export default function App() {
  const tracks = usePlayerStore((s) => s.tracks);
  const { seek, currentTrack } = useAudioPlayer();
  const { importFiles } = useFileImport();

  useKeyboardShortcuts();

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
    <div onDragOver={handleDragOver} onDrop={handleDrop}>
      <AppShell>
        <TitleBar />
        {hasPlaylist ? (
          <>
            <NowPlayingCard track={currentTrack} />
            <PlayerControls onSeek={seek} />
            <Playlist />
          </>
        ) : (
          <DropZone />
        )}
        <ToastHost />
      </AppShell>
    </div>
  );
}
