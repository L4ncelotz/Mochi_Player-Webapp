import { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';

interface PiPWindow extends Window {
  documentPictureInPicture?: any;
}

export function useDocumentPiP() {
  const [pipWindow, setPipWindow] = useState<PiPWindow | null>(null);

  const openPiP = useCallback(async (width: number, height: number) => {
    // Check if API is supported
    if (!('documentPictureInPicture' in window)) {
      console.warn('Document Picture-in-Picture API is not supported in this browser.');
      return;
    }

    try {
      // Open the PiP window
      const dpip = (window as any).documentPictureInPicture;
      const pip = await dpip.requestWindow({ width, height });

      // Copy all stylesheets
      [...document.styleSheets].forEach((styleSheet) => {
        try {
          const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
          const style = document.createElement('style');
          style.textContent = cssRules;
          pip.document.head.appendChild(style);
        } catch (e) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.type = styleSheet.type;
          link.media = styleSheet.media;
          link.href = styleSheet.href;
          pip.document.head.appendChild(link);
        }
      });

      // Handle PiP close
      pip.addEventListener('pagehide', () => {
        setPipWindow(null);
      });

      setPipWindow(pip);
    } catch (err) {
      console.error('Failed to open PiP window:', err);
    }
  }, []);

  const closePiP = useCallback(() => {
    if (pipWindow) {
      pipWindow.close();
      setPipWindow(null);
    }
  }, [pipWindow]);

  const PiPPortal = ({ children }: { children: React.ReactNode }) => {
    if (!pipWindow) return null;
    return createPortal(children, pipWindow.document.body);
  };

  return {
    isSupported: 'documentPictureInPicture' in window,
    isOpen: !!pipWindow,
    openPiP,
    closePiP,
    PiPPortal,
  };
}
