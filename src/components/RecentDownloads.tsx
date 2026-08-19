import React from 'react';
import { HistoryItem } from '../types';
import { Clock, Trash2, ArrowRight, ExternalLink, RefreshCw, Film, Sparkles, Copy, Check } from 'lucide-react';
import { YouTubeLogo, FacebookLogo, InstagramLogo, TikTokLogo } from './PlatformLogos';

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

  const renderPlatformBadge = (platformStr: string, urlStr: string) => {
    const p = (platformStr || '').toLowerCase();
    const u = (urlStr || '').toLowerCase();

    if (p.includes('facebook') || p.includes('fb') || u.includes('facebook.com') || u.includes('fb.watch')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-600/20 text-blue-400 border border-blue-500/30">
          <FacebookLogo className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Facebook</span>
        </span>
      );
    }
    if (p.includes('instagram') || p.includes('insta') || u.includes('instagram.com')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
          <InstagramLogo className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Instagram</span>
        </span>
      );
    }
    if (p.includes('tiktok') || u.includes('tiktok.com')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
          <TikTokLogo className="w-3.5 h-3.5 flex-shrink-0" />
          <span>TikTok</span>
        </span>
      );
    }
    if (p.includes('youtube') || p.includes('yt') || u.includes('youtube.com') || u.includes('youtu.be')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
          <YouTubeLogo className="w-3.5 h-3.5 flex-shrink-0" />
          <span>YouTube</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
        <Film className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
        <span>{platformStr || 'Media'}</span>
      </span>
    );
  };

  const formatVideoDuration = (val?: number) => {
    if (!val || val <= 0) return null;
    let num = val;
    if (num > 86400) num = Math.floor(num / 1000);
    num = Math.round(num);
    const hours = Math.floor(num / 3600);
    const minutes = Math.floor((num % 3600) / 60);
    const seconds = num % 60;
    const paddedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    if (hours > 0) {
      const paddedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      return `${hours}:${paddedMinutes}:${paddedSeconds}`;
    }
    return `${minutes}:${paddedSeconds}`;
  };

  const handleCopy = (e: React.MouseEvent, id: string, url: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all duration-300 ${
      isDarkMode 
        ? 'bg-slate-950/60 border-white/10 text-white shadow-2xl backdrop-blur-xl' 
        : 'bg-white/90 border-slate-200 text-slate-900 shadow-xl backdrop-blur-xl'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-inner">
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base tracking-tight font-heading">
                𝐑𝐞𝐜𝐞𝐧𝐭 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐬
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Quick re-fetch from your download history
            </p>
          </div>
        </div>

        <button
          onClick={onClearHistory}
          className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20"
          title="Clear history"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">𝐂𝐥𝐞𝐚𝐫 𝐀𝐥𝐥</span>
        </button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectUrl(item.url)}
            className={`group p-3 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-2.5 cursor-pointer relative overflow-hidden ${
              isDarkMode
                ? 'bg-slate-900/60 border-slate-800 hover:border-indigo-500/60 hover:bg-slate-800/80'
                : 'bg-slate-50/90 border-slate-200/90 hover:border-indigo-400 hover:bg-white shadow-sm'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Thumbnail / Icon */}
              <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-white/10 flex items-center justify-center">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <Film className="w-4 h-4 text-indigo-400" />
                )}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />

                {/* Real Video Duration Overlay */}
                {formatVideoDuration(item.duration) && (
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/90 text-[9px] font-mono font-bold text-white border border-white/20 shadow-md">
                    {formatVideoDuration(item.duration)}
                  </div>
                )}
              </div>

              {/* Title & Info */}
              <div className="min-w-0 flex-1 space-y-1">
                {renderPlatformBadge(item.platform, item.url)}

                <h4 className="text-xs font-bold leading-tight line-clamp-1 group-hover:text-indigo-400 transition-colors">
                  {item.title}
                </h4>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
              <div className="flex items-center gap-2">
                {formatVideoDuration(item.duration) ? (
                  <span className="px-1.5 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 text-[10px] font-mono font-bold flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-indigo-400" />
                    <span>{formatVideoDuration(item.duration)}</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-zinc-400">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
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
                    <Copy className="w-3.5 h-3.5 text-zinc-400 hover:text-white" />
                  )}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveItem(item.id);
                  }}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onSelectUrl(item.url)}
                  className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
                >
                  <span>𝐑𝐞-𝐟𝐞𝐭𝐜𝐡</span>
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
