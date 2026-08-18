import React from 'react';
import { DEVELOPER_DETAILS, LOGO_URL } from '../types';
import { ShieldCheck, Zap, Globe2, Lock, Cpu, Film, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutSectionProps {
  isDarkMode: boolean;
  onGoToDownloader: () => void;
  onGoToDeveloper: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  isDarkMode,
}) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500 max-w-5xl mx-auto">
      
      {/* Hero Header */}
      <div className={`text-center space-y-4 p-8 sm:p-12 rounded-3xl relative overflow-hidden transition-all duration-300 ${
        isDarkMode 
          ? 'glass shadow-2xl' 
          : 'bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 border border-slate-200 shadow-xl'
      }`}>
        <h1 className={`text-3xl sm:text-5xl font-black font-heading tracking-tight max-w-3xl mx-auto ${
          isDarkMode ? 'text-white' : 'text-slate-900'
        }`}>
          About <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">MediaDrop</span>
        </h1>

        <p className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${
          isDarkMode ? 'text-slate-300' : 'text-slate-600'
        }`}>
          MediaDrop is a high-speed, secure, and professional online video & audio downloader. Built with cutting-edge serverless API proxy tech, it lets you extract high-definition media from YouTube, Facebook, Instagram, TikTok and 500+ sites effortlessly.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className={`p-6 rounded-2xl border space-y-3 ${
          isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Super Fast Speeds
          </h3>
          <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Direct multi-threaded download proxies bypass bandwidth throttling to deliver 4K and 1080p media at top connection speeds.
          </p>
        </div>

        <div className={`p-6 rounded-2xl border space-y-3 ${
          isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Protected & Obfuscated API
          </h3>
          <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Server-side token proxy masks upstream API credentials completely so source code inspection remains secure without exposing endpoints.
          </p>
        </div>

        <div className={`p-6 rounded-2xl border space-y-3 ${
          isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <Globe2 className="w-6 h-6" />
          </div>
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Universal Platform Support
          </h3>
          <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Seamlessly fetch media from YouTube, Facebook Reels, Instagram Posts, TikTok (No Watermark), Twitter / X, Vimeo, and sound platforms.
          </p>
        </div>

      </div>

      {/* Technical Specifications */}
      <div className={`p-8 rounded-3xl border space-y-6 ${
        isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-lg'
      }`}>
        <h2 className={`text-2xl font-extrabold font-heading ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Engine Specifications
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>4K & 1080p Resolution Support</p>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Extracts full uncompressed video up to 60 FPS.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>High Bitrate MP3 Extraction</p>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Converts video tracks to crisp 320kbps audio files.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Zero Ad Tracking</p>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>No annoying popups, redirect loops, or forced signups.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
