import { useEffect } from 'react';
import { usePlayerStore } from '../stores/playerStore';

export function useKeyboardShortcuts() {
  const togglePlay = usePlayerStore((s) => s.togglePlay);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't intercept when typing in inputs or interacting with buttons
      if (
        e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLButtonElement
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [togglePlay]);
}
