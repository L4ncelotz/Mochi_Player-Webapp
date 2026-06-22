import { X, Monitor, Volume2, FastForward } from 'lucide-react';
import { usePlayerStore } from '../stores/playerStore';
import styles from './SettingsModal.module.css';

export function SettingsModal() {
  const { isSettingsOpen, toggleSettings, settings, updateSettings } = usePlayerStore();

  if (!isSettingsOpen) return null;

  return (
    <div className={styles.overlay} onClick={toggleSettings}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Settings</h2>
          <button className={styles.closeBtn} onClick={toggleSettings}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.settingGroup}>
            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <Monitor size={18} className={styles.icon} />
                <div>
                  <div className={styles.settingTitle}>Reduce Motion</div>
                  <div className={styles.settingDesc}>Disable background animations and floating elements</div>
                </div>
              </div>
              <label className={styles.switch}>
                <input 
                  type="checkbox" 
                  checked={settings.reduceMotion}
                  onChange={(e) => updateSettings({ reduceMotion: e.target.checked })}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <FastForward size={18} className={styles.icon} />
                <div>
                  <div className={styles.settingTitle}>Autoplay Next</div>
                  <div className={styles.settingDesc}>Automatically play the next track in queue or playlist</div>
                </div>
              </div>
              <label className={styles.switch}>
                <input 
                  type="checkbox" 
                  checked={settings.autoplayNext}
                  onChange={(e) => updateSettings({ autoplayNext: e.target.checked })}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <Volume2 size={18} className={styles.icon} />
                <div>
                  <div className={styles.settingTitle}>Default Volume</div>
                  <div className={styles.settingDesc}>Starting volume when you open the app</div>
                </div>
              </div>
              <div className={styles.volumeControl}>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05"
                  value={settings.defaultVolume}
                  onChange={(e) => updateSettings({ defaultVolume: parseFloat(e.target.value) })}
                  className={styles.volumeSlider}
                  style={{ '--fill': `${settings.defaultVolume * 100}%` } as React.CSSProperties}
                />
                <span className={styles.volumeText}>{Math.round(settings.defaultVolume * 100)}%</span>
              </div>
            </div>
          </div>
          
          <div className={styles.footer}>
            <span className={styles.version}>Mochi Player v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
