import React, { useState, useEffect, useCallback } from 'react';
import { LuDownload, LuRefreshCw, LuX } from 'react-icons/lu';

const DISMISS_KEY = 'ando_install_dismissed';

const PwaBanners = () => {
  const [installEvent, setInstallEvent] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [swRegistration, setSwRegistration] = useState(null);

  useEffect(() => {
    const onBeforeInstall = (e) => {
      e.preventDefault();
      if (localStorage.getItem(DISMISS_KEY)) return;
      setInstallEvent(e);
      setShowInstall(true);
    };
    const onInstalled = () => {
      setShowInstall(false);
      setInstallEvent(null);
    };
    const onSwUpdate = (e) => setSwRegistration(e.detail);

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    window.addEventListener('ando-sw-update', onSwUpdate);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
      window.removeEventListener('ando-sw-update', onSwUpdate);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!installEvent) return;
    installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
    setShowInstall(false);
  }, [installEvent]);

  const handleDismissInstall = () => {
    localStorage.setItem(DISMISS_KEY, '1');
    setShowInstall(false);
  };

  const handleRefresh = () => {
    if (swRegistration?.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    navigator.serviceWorker?.addEventListener('controllerchange', () => {
      window.location.reload();
    });
    setSwRegistration(null);
  };

  if (!swRegistration && !(showInstall && installEvent)) return null;

  return (
    <div style={{
      position: 'fixed', top: 12, left: 0, right: 0, zIndex: 10001,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      padding: '0 1rem', pointerEvents: 'none',
    }}>
      {swRegistration && (
        <div style={toastStyle}>
          <span style={{ fontSize: '0.85rem', color: '#e8e8e8', fontWeight: 500 }}>
            A new version of Ando is ready.
          </span>
          <button onClick={handleRefresh} style={toastBtnPrimary}>
            <LuRefreshCw size={13} /> Refresh
          </button>
        </div>
      )}

      {showInstall && installEvent && (
        <div style={toastStyle}>
          <span style={{ fontSize: '0.85rem', color: '#e8e8e8', fontWeight: 500 }}>
            Install Ando for quicker access.
          </span>
          <button onClick={handleInstall} style={toastBtnPrimary}>
            <LuDownload size={13} /> Install
          </button>
          <button
            onClick={handleDismissInstall}
            aria-label="Dismiss"
            style={toastBtnGhost}
          >
            <LuX size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

const toastStyle = {
  pointerEvents: 'auto',
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  background: 'rgba(14,14,14,0.97)',
  border: '1px solid #262626',
  borderRadius: 12,
  padding: '0.65rem 0.7rem 0.65rem 1rem',
  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  maxWidth: 420,
  width: '100%',
};

const toastBtnPrimary = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  background: 'linear-gradient(135deg, #e2231a, #ff4d3d)',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '0.4rem 0.75rem',
  fontSize: '0.8rem',
  fontWeight: 600,
  cursor: 'pointer',
  flexShrink: 0,
  whiteSpace: 'nowrap',
};

const toastBtnGhost = {
  background: 'none',
  border: 'none',
  color: '#555',
  cursor: 'pointer',
  padding: 4,
  flexShrink: 0,
  display: 'flex',
};

export default PwaBanners;
