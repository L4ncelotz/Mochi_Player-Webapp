import { useCallback } from 'react';
import jsmediatags from 'jsmediatags';
import { usePlayerStore } from '../stores/playerStore';
import { getExtension } from '../utils/fileTypes';
import type { Track } from '../types/music';
import type { AcceptedExtension } from '../utils/fileTypes';

function readTags(file: File): Promise<{ title?: string; artist?: string; coverArt?: string }> {
  return new Promise((resolve) => {
    jsmediatags.read(file, {
      onSuccess: (tag) => {
        const { title, artist, picture } = tag.tags;
        let coverArt: string | undefined;
        if (picture) {
          const bytes = new Uint8Array(picture.data);
          const blob = new Blob([bytes], { type: picture.format });
          coverArt = URL.createObjectURL(blob);
        }
        resolve({ title: title || undefined, artist: artist || undefined, coverArt });
      },
      onError: () => resolve({}),
    });
  });
}

export function useFileImport() {
  const addTracks = usePlayerStore((s) => s.addTracks);
  const showToast = usePlayerStore((s) => s.showToast);

  const importFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const newTracks: Track[] = [];
      let rejected = 0;

      for (const file of fileArray) {
        const ext = getExtension(file.name);
        if (!ext) {
          rejected++;
          continue;
        }

        const objectUrl = URL.createObjectURL(file);
        const tags = await readTags(file);
        const cleanName = file.name.replace(/\.[^/.]+$/, '');

        newTracks.push({
          id: file.name,
          source: 'local',
          fileName: file.name,
          objectUrl,
          title: tags.title || cleanName,
          artist: tags.artist,
          coverArt: tags.coverArt,
          extension: ext as AcceptedExtension,
          addedAt: new Date().toISOString(),
        });
      }

      if (newTracks.length > 0) addTracks(newTracks);
      if (rejected > 0) showToast(`${rejected} unsupported file${rejected > 1 ? 's' : ''} skipped`);
    },
    [addTracks, showToast],
  );

  return { importFiles };
}
