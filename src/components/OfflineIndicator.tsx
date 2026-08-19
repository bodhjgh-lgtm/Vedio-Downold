import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw, X } from 'lucide-react';

interface OfflineIndicatorProps {
  isDarkMode?: boolean;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ isDarkMode = true }) => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
      ? navigator.onLine
      : true
  );
  const [showRestoredBanner, setShowRestoredBanner] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setDismissed(false);
      setShowRestoredBanner(true);
      const timer = setTimeout(() => {
        setShowRestoredBanner(false);
      }, 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleCheckConnection = () => {
    if (typeof navigator !== 'undefined') {
      setIsOnline(navigator.onLine);
      if (navigator.onLine) {
        setShowRestoredBanner(true);
        setTimeout(() => setShowRestoredBanner(false), 3000);
      }
    }
  };

  // Render restored online banner briefly at top
  if (isOnline && showRestoredBanner) {
    return (
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] max-w-sm w-[90%] sm:w-auto animate-in slide-in-from-top-10 fade-in duration-500 ease-out">
        <div className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-emerald-500/95 text-white backdrop-blur-2xl border border-emerald-400/50 shadow-2xl shadow-emerald-900/40 text-xs sm:text-sm font-bold select-none tracking-wide">
          <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
          <Wifi className="w-4 h-4 text-white" />
          <span>Internet Connection Restored</span>
        </div>
      </div>
    );
  }

  // If online or user dismissed the warning, don't show
  if (isOnline || dismissed) {
    return null;
  }

  // Render offline warning banner sliding down from top
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] max-w-md w-[92%] sm:w-auto animate-in slide-in-from-top-12 fade-in duration-500 ease-out">
      <div
        className={`flex items-center justify-between gap-3.5 px-4 sm:px-5 py-3.5 rounded-2xl border-2 backdrop-blur-3xl shadow-2xl transition-all ${
          isDarkMode
            ? 'bg-amber-950/90 border-amber-500/60 text-amber-100 shadow-amber-950/80 ring-1 ring-amber-500/30'
            : 'bg-amber-50/95 border-amber-400 text-amber-950 shadow-amber-900/20 ring-1 ring-amber-400/40'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-80"></span>
            <div className="relative p-2 rounded-xl bg-amber-500/25 text-amber-400 border border-amber-500/40 shadow-inner">
              <WifiOff className="w-4 h-4" />
            </div>
          </div>
          <div className="text-left">
            <p className="text-xs sm:text-sm font-black tracking-tight">You are currently offline</p>
            <p className="text-[11px] opacity-80 leading-tight">
              Check your internet or network connection.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleCheckConnection}
            title="Retry connection check"
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
              isDarkMode
                ? 'bg-amber-500/25 hover:bg-amber-500/40 text-amber-300 border border-amber-500/30'
                : 'bg-amber-200 hover:bg-amber-300 text-amber-950 border border-amber-300'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Retry</span>
          </button>
          <button
            onClick={() => setDismissed(true)}
            title="Dismiss notification"
            className="p-1.5 rounded-xl opacity-70 hover:opacity-100 hover:bg-black/10 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
