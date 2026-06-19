import { Upload } from 'lucide-react';
import { useFileImport } from '../hooks/useFileImport';
import { getAcceptString } from '../utils/fileTypes';
import { useRef } from 'react';
import styles from './CenterStageEmpty.module.css';

export function CenterStageEmpty() {
  const { importFiles } = useFileImport();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => inputRef.current?.click();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      importFiles(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.mascot}>
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: '100%', height: '100%' }}>
          <ellipse cx="60" cy="68" rx="44" ry="36" fill="#FFD6E7" />
          <ellipse cx="60" cy="62" rx="44" ry="40" fill="#FFE8F3" />
          <ellipse cx="40" cy="72" rx="8" ry="5" fill="#FF8DA1" opacity="0.4" />
          <ellipse cx="80" cy="72" rx="8" ry="5" fill="#FF8DA1" opacity="0.4" />
          <path d="M44 62 Q50 66 54 62" stroke="#3D2C35" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M66 62 Q72 66 76 62" stroke="#3D2C35" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <text x="82" y="40" fontSize="16" fill="#AD56C4" opacity="0.6" fontWeight="bold">Z</text>
          <text x="96" y="30" fontSize="12" fill="#AD56C4" opacity="0.4" fontWeight="bold">z</text>
          <text x="106" y="22" fontSize="10" fill="#AD56C4" opacity="0.3" fontWeight="bold">z</text>
        </svg>
      </div>
      <p className={styles.heading}>No music yet</p>
      <p className={styles.sub}>Drop your files anywhere, or choose them below</p>
      <button className={styles.cta} onClick={handleClick} id="empty-browse-btn">
        <Upload size={15} />
        Open music files
      </button>
      <span className={styles.formats}>MP3 · MP4 · M4A · WAV · FLAC</span>
      <input
        ref={inputRef}
        type="file"
        accept={getAcceptString()}
        multiple
        hidden
        onChange={handleChange}
      />
    </div>
  );
}
