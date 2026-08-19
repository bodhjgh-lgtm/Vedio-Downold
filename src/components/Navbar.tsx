import React from 'react';
import { LOGO_URL } from '../types';
import { Sun, Moon, Info, Download, Code2, History, Clock } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'history' | 'about' | 'developer';
  setActiveTab: (tab: 'home' | 'history' | 'about' | 'developer') => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  recentCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  recentCount = 0,
}) => {
  return (
    <header className="relative z-50 pt-2 sm:pt-4 px-2 sm:px-6">
      <div className={`max-w-7xl mx-auto rounded-2xl sm:rounded-3xl px-3 sm:px-6 py-2 transition-colors duration-150 ${
        isDarkMode 
          ? 'ios-glass text-white' 
          : 'ios-glass-light text-slate-900 shadow-xl shadow-slate-300/30'
      }`}>
        <div className="flex items-center justify-between h-12 sm:h-16 gap-2">
          
          {/* Logo & Brand Name - Matches user screenshot */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl blur-md opacity-80 group-hover:opacity-100 transition duration-150"></div>
              <img 
                src={LOGO_URL} 
                alt="MediaDrop Logo" 
                className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl object-cover border border-white/30 shadow-lg group-hover:scale-105 transition duration-150"
              />
            </div>
            <span className={`text-lg sm:text-2xl font-black tracking-tight font-heading ${
              isDarkMode 
                ? 'text-white' 
                : 'text-slate-900'
            }`}>
              𝐌𝐞𝐝𝐢𝐚𝐃𝐫𝐨𝐩
            </span>
          </div>

          {/* Right Navigation Capsule Pill - Matches User Image Exactly */}
          <nav className={`flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border transition-colors duration-150 ${
            isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100/90 border-slate-200 shadow-sm'
          }`}>
            
            {/* 1. Downloader Tab */}
            <button
              onClick={() => setActiveTab('home')}
              title="Downloader"
              className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl font-extrabold text-xs sm:text-sm transition-all duration-150 flex items-center justify-center ${
                activeTab === 'home'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/40 scale-105' 
                  : isDarkMode
                    ? 'text-zinc-300 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
              }`}
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* 2. History / Recent Tab */}
            <button
              onClick={() => setActiveTab('history')}
              title="Recent History"
              className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl font-extrabold text-xs sm:text-sm transition-all duration-150 flex items-center justify-center relative ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/40 scale-105' 
                  : isDarkMode
                    ? 'text-zinc-300 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
              }`}
            >
              <History className="w-4 h-4 sm:w-5 sm:h-5" />
              {recentCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-md">
                  {recentCount}
                </span>
              )}
            </button>

            {/* 3. About / Info Tab */}
            <button
              onClick={() => setActiveTab('about')}
              title="About"
              className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl font-extrabold text-xs sm:text-sm transition-all duration-150 flex items-center justify-center ${
                activeTab === 'about'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/40 scale-105' 
                  : isDarkMode
                    ? 'text-zinc-300 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
              }`}
            >
              <Info className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* 4. Developer Tab - Red tinted border button matching screenshot */}
            <button
              onClick={() => setActiveTab('developer')}
              title="Developer XC"
              className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl font-extrabold text-xs sm:text-sm transition-all duration-150 flex items-center justify-center ${
                activeTab === 'developer'
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-600/30 scale-105' 
                  : isDarkMode
                    ? 'text-rose-400 bg-rose-950/40 border border-rose-500/30 hover:bg-rose-900/40 hover:text-white'
                    : 'text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100'
              }`}
            >
              <Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
            </button>

            {/* 5. Theme Toggle Button - Matching screenshot */}
            <button
              onClick={() => setIsDarkMode(prev => !prev)}
              aria-label="Toggle Theme"
              className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl transition-all duration-150 active:scale-95 border ${
                isDarkMode 
                  ? 'bg-slate-900/80 border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/60' 
                  : 'bg-amber-50/90 border-amber-200/80 text-amber-600 hover:bg-amber-100'
              }`}
              title={isDarkMode ? "Dark Mode (Moon)" : "Light Mode (Sun)"}
            >
              {isDarkMode ? (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-300" />
              ) : (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
              )}
            </button>

          </nav>

        </div>
      </div>
    </header>
  );
};
