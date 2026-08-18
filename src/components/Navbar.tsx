import React from 'react';
import { LOGO_URL } from '../types';
import { Sun, Moon, Info, ShieldCheck, Download, Code2 } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'about' | 'developer';
  setActiveTab: (tab: 'home' | 'about' | 'developer') => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-50 pt-2 sm:pt-4 px-2 sm:px-6 transition-all duration-300">
      <div className={`max-w-7xl mx-auto rounded-2xl sm:rounded-3xl px-3 sm:px-6 py-2.5 transition-all duration-300 ${
        isDarkMode 
          ? 'ios-glass text-white' 
          : 'ios-glass-light text-slate-900 shadow-xl shadow-slate-300/30'
      }`}>
        <div className="flex items-center justify-between h-12 sm:h-16 gap-2">
          
          {/* Logo & Brand Name - Compact on Mobile */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition duration-300"></div>
              <img 
                src={LOGO_URL} 
                alt="MediaDrop Logo" 
                className="relative w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl object-cover border border-white/30 shadow-lg group-hover:scale-105 transition duration-300"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className={`text-base sm:text-2xl font-black tracking-tight font-heading ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent' 
                    : 'bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 bg-clip-text text-transparent'
                }`}>
                  MediaDrop
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-extrabold tracking-widest uppercase bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white rounded-full shadow-md shadow-indigo-500/20">
                  iOS 26
                </span>
              </div>
              <span className={`hidden md:block text-[10px] font-bold tracking-widest uppercase ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
                Ultra HD Media Engine
              </span>
            </div>
          </div>

          {/* Navigation Links - iOS Liquid Glass Pill Navigation */}
          <nav className={`flex items-center gap-1 sm:gap-1.5 p-1 rounded-2xl border ${
            isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-100/80 border-black/5'
          }`}>
            <button
              onClick={() => setActiveTab('home')}
              title="Downloader"
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-extrabold text-xs sm:text-sm tracking-wide transition-all duration-300 ${
                activeTab === 'home'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]' 
                  : isDarkMode
                    ? 'text-zinc-300 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline sm:inline">Home</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              title="About"
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-extrabold text-xs sm:text-sm tracking-wide transition-all duration-300 ${
                activeTab === 'about'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]' 
                  : isDarkMode
                    ? 'text-zinc-300 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline sm:inline">About</span>
            </button>

            <button
              onClick={() => setActiveTab('developer')}
              title="Developer"
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-extrabold text-xs sm:text-sm tracking-wide transition-all duration-300 ${
                activeTab === 'developer'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-600/30 scale-[1.02]' 
                  : isDarkMode
                    ? 'text-pink-400 bg-pink-500/10 border border-pink-500/20 hover:text-white hover:bg-pink-500/20'
                    : 'text-pink-600 bg-pink-50 border border-pink-200 hover:bg-pink-100'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline sm:inline">Dev</span>
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(prev => !prev)}
              aria-label="Toggle Theme"
              className={`p-2 sm:p-2.5 rounded-xl transition-all duration-300 active:scale-95 border ${
                isDarkMode 
                  ? 'bg-indigo-950/60 border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/60 shadow-lg shadow-indigo-500/10' 
                  : 'bg-amber-50/90 border-amber-200/80 text-amber-600 hover:bg-amber-100 shadow-md shadow-amber-500/10'
              }`}
              title={isDarkMode ? "Dark Mode (Moon)" : "Light Mode (Sun)"}
            >
              {isDarkMode ? (
                <Moon className="w-4 h-4 sm:w-4 sm:h-4 text-indigo-300 fill-indigo-400/20" />
              ) : (
                <Sun className="w-4 h-4 sm:w-4 sm:h-4 text-amber-500 fill-amber-400/20" />
              )}
            </button>
          </nav>

        </div>
      </div>
    </header>
  );
};
