import React from 'react';
import { HistoryItem } from '../types';
import { Clock, Trash2, ArrowRight, ExternalLink, RefreshCw, Film, Sparkles, Copy, Check } from 'lucide-react';

interface RecentDownloadsProps {
  items: HistoryItem[];
  isDarkMode: boolean;
  onSelectUrl: (url: string) => void;
  onClearHistory: () => void;
  onRemoveItem: (id: string) => void;
}

export const RecentDownloads: React.FC<RecentDownloadsProps> = ({
  items,
  isDarkMode,
  onSelectUrl,
  onClearHistory,
  onRemoveItem,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!items || items.length === 0) return null;

  const handleCopy = (e: React.MouseEvent, id: string, url: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-300 ${
      isDarkMode 
        ? 'bg-slate-900/80 border-slate-800 text-white shadow-xl' 
        : 'bg-white border-slate-200 text-slate-900 shadow-md'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/50 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base tracking-tight font-heading">
              Recent Downloads
            </h3>
            <p className="text-[11px] text-slate-400">
              Quick access to your last 5 fetched links
            </p>
          </div>
        </div>

        <button
          onClick={onClearHistory}
          className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10"
          title="Clear recent history"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear History</span>
        </button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectUrl(item.url)}
            className={`group p-3 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-3 cursor-pointer ${
              isDarkMode
                ? 'bg-slate-800/60 border-slate-700/80 hover:border-indigo-500/50 hover:bg-slate-800'
                : 'bg-slate-50 border-slate-200 hover:border-indigo-400 hover:bg-white shadow-sm'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Thumbnail / Icon */}
              <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-slate-950 flex-shrink-0 border border-slate-700/50 flex items-center justify-center">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback icon if image fails to load
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <Film className="w-5 h-5 text-indigo-400" />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
              </div>

              {/* Title & Info */}
              <div className="min-w-0 flex-1 space-y-1">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                  {item.platform || 'Video'}
                </span>

                <h4 className="text-xs font-bold leading-tight line-clamp-2 group-hover:text-indigo-400 transition-colors">
                  {item.title}
                </h4>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/40 text-xs">
              <span className="text-[10px] font-mono text-slate-400">
                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>

              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => handleCopy(e, item.id, item.url)}
                  className={`p-1.5 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                    isDarkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
                  }`}
                  title="Copy Link"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveItem(item.id);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onSelectUrl(item.url)}
                  className="px-2.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
                >
                  <span>Fetch</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
