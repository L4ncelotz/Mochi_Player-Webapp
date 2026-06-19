import { useEffect } from 'react';
import { usePlayerStore } from '../stores/playerStore';

export function useKeyboardShortcuts() {
  const togglePlay = usePlayerStore((s) => s.togglePlay);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't intercept when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [togglePlay]);
}
