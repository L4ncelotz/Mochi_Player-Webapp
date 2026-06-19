import { useEffect, useState } from 'react';
import { CompactWidget } from './CompactWidget';
import { RegularWidget } from './RegularWidget';
import { LargeWidget } from './LargeWidget';
import styles from './Widget.module.css';

export interface WidgetState {
  isPlaying: boolean;
  track?: {
    title: string;
    artist?: string;
    coverArt?: string;
  };
}

export function WidgetApp() {
  const [state, setState] = useState<WidgetState>({ isPlaying: false });
  const [style, setStyle] = useState<'compact' | 'regular' | 'large'>('compact');

  useEffect(() => {
    // Parse style from URL
    const params = new URLSearchParams(window.location.search);
    const styleParam = params.get('style');
    if (styleParam === 'regular' || styleParam === 'large') {
      setStyle(styleParam);
    }

    // Set up BroadcastChannel listener
    const bc = new BroadcastChannel('mochi_player');
    bc.onmessage = (event) => {
      if (event.data?.type === 'STATE_UPDATE') {
        setState(event.data.payload);
      }
    };

    // Ask main window for current state (in case we opened the widget late)
    bc.postMessage({ type: 'REQUEST_STATE' });

    return () => bc.close();
  }, []);

  if (!state.track && !state.isPlaying) {
    // Default empty state before first sync
    return <div className={styles.empty}>Mochi Widget Ready</div>;
  }

  return (
    <div className={styles.widgetContainer}>
      {style === 'compact' && <CompactWidget state={state} />}
      {style === 'regular' && <RegularWidget state={state} />}
      {style === 'large' && <LargeWidget state={state} />}
    </div>
  );
}
