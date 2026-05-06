import { useState, useEffect } from 'react';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [manualFallback, setManualFallback] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check for forced iOS mode (for testing on desktop)
    const forceIOS = localStorage.getItem('pwa_force_ios') === 'true';
    
    // Detect iOS: user agent contains iPhone/iPad/iPod, OR forceIOS is true
    const iosDevice = forceIOS || /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iosDevice);

    // Already shown?
    const hasShown = localStorage.getItem('pwa_prompt_shown');
    if (hasShown) {
      setShowPrompt(false);
      return;
    }

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Android: listen for beforeinstallprompt
    if (!iosDevice && window.matchMedia('(display-mode: browser)').matches) {
      const handler = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowPrompt(true);
        localStorage.setItem('pwa_prompt_shown', 'true');
      };
      window.addEventListener('beforeinstallprompt', handler);
      window.addEventListener('appinstalled', () => {
        setIsInstalled(true);
        setShowPrompt(false);
      });

      const timer = setTimeout(() => {
        if (!deferredPrompt && !isInstalled && !hasShown) {
          setManualFallback(true);
          localStorage.setItem('pwa_prompt_shown', 'true');
        }
      }, 3000);

      return () => {
        window.removeEventListener('beforeinstallprompt', handler);
        clearTimeout(timer);
      };
    } else {
      // iOS or forced iOS mode – show instructional prompt once
      const timer = setTimeout(() => {
        setShowPrompt(true);
        localStorage.setItem('pwa_prompt_shown', 'true');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [deferredPrompt, isInstalled]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(outcome);
      setDeferredPrompt(null);
      setShowPrompt(false);
    } else {
      alert('You can install this app from your browser’s menu or address bar.');
    }
  };

  const handleLater = () => {
    setShowPrompt(false);
    setManualFallback(false);
    localStorage.setItem('pwa_prompt_shown', 'true');
  };

  // Helper to show console instructions for forcing iOS mode
  useEffect(() => {
    if (!isIOS && !localStorage.getItem('pwa_force_ios')) {
      console.log(
        '💡 Tip: To test iOS "Add to Home Screen" prompt on desktop, run: localStorage.setItem("pwa_force_ios", "true") and refresh.'
      );
    }
  }, []);

  if (isInstalled) return null;
  if (!showPrompt && !manualFallback) return null;

  return (
    <div className="pwa-install-overlay">
      <div className="pwa-install-card">
        <button className="pwa-close-btn" onClick={handleLater}>
          <i className="fas fa-times"></i>
        </button>
        <div className="pwa-install-icon">
          <i className={`fas ${isIOS ? 'fa-share-alt' : 'fa-download'}`}></i>
        </div>
        <h3>{isIOS ? 'Add to Home Screen' : 'Install HopeBridge'}</h3>
        {isIOS ? (
          <>
            <p>For the best experience, add this app to your home screen:</p>
            <ol style={{ textAlign: 'left', margin: '12px 0', paddingLeft: '20px' }}>
              <li>Tap the <strong>Share</strong> icon <i className="fas fa-share-square"></i> (bottom center)</li>
              <li>Scroll down and tap <strong>Add to Home Screen</strong></li>
              <li>Tap <strong>Add</strong> in the top right corner</li>
            </ol>
          </>
        ) : (
          <>
            <p>Install this app for a faster, full‑screen experience.</p>
            <div className="pwa-install-actions">
              <button className="pwa-install-btn" onClick={handleInstall}>
                Install
              </button>
              <button className="pwa-later-btn" onClick={handleLater}>
                Later
              </button>
            </div>
          </>
        )}
        {isIOS && (
          <button className="pwa-later-btn" onClick={handleLater} style={{ marginTop: '12px' }}>
            Don't show again
          </button>
        )}
      </div>
    </div>
  );
};

export default PWAInstallPrompt;