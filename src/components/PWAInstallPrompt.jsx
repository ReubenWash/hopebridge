import { useState, useEffect } from 'react';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [manualFallback, setManualFallback] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
      setManualFallback(false); // hide fallback if event fires
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
    });

    // Fallback: if event hasn't fired after 3s, show a manual button
    const timer = setTimeout(() => {
      if (!deferredPrompt && !isInstalled) {
        setManualFallback(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(timer);
    };
  }, [deferredPrompt, isInstalled]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(outcome);
      setDeferredPrompt(null);
      setShowPrompt(false);
    } else {
      // For manual fallback (if browser supports direct install from manifest)
      // This is experimental, so we'll just alert to use the browser's menu.
      alert('You can install this app from your browser’s menu or address bar.');
    }
  };

  if (isInstalled) return null;
  if (!showPrompt && !manualFallback) return null;

  return (
    <div className="pwa-install-overlay">
      <div className="pwa-install-card">
        <button className="pwa-close-btn" onClick={() => { setShowPrompt(false); setManualFallback(false); }}>
          <i className="fas fa-times"></i>
        </button>
        <div className="pwa-install-icon">
          <i className="fas fa-download"></i>
        </div>
        <h3>Add HopeBridge to Home Screen</h3>
        <p>Install this app for a faster, full‑screen experience.</p>
        <div className="pwa-install-actions">
          <button className="pwa-install-btn" onClick={handleInstall}>
            Install
          </button>
          <button className="pwa-later-btn" onClick={() => { setShowPrompt(false); setManualFallback(false); }}>
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;