import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertTriangle, Info, X, Sparkles } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
  isDarkMode: boolean;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss, isDarkMode }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 sm:top-7 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 max-w-md w-[calc(100%-2rem)] pointer-events-none items-center">
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto w-full p-4 rounded-2xl shadow-2xl border flex flex-col gap-2 transition-all duration-300 animate-in fade-in slide-in-from-top-8 relative overflow-hidden backdrop-blur-2xl ${
              isDarkMode
                ? 'ios-glass text-white border-white/20 shadow-black/60'
                : 'ios-glass-light text-slate-900 border-white/80 shadow-indigo-500/15'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                    isError
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : isInfo
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {isError ? (
                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                  ) : isInfo ? (
                    <Info className="w-5 h-5 text-blue-500" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  )}
                </div>

                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs sm:text-sm font-bold tracking-tight">
                    {toast.message}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onDismiss(toast.id)}
                className={`p-1.5 rounded-xl transition-all duration-200 flex-shrink-0 ${
                  isDarkMode
                    ? 'text-slate-400 hover:text-white hover:bg-white/10'
                    : 'text-slate-400 hover:text-slate-900 hover:bg-black/5'
                }`}
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Auto-dismiss shrinking progress bar */}
            <div className="w-full bg-black/10 rounded-full h-1 overflow-hidden">
              <div 
                className={`h-full rounded-full animate-[shrink_4s_linear_forwards] ${
                  isError ? 'bg-rose-500' : isInfo ? 'bg-blue-500' : 'bg-emerald-500'
                }`} 
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
