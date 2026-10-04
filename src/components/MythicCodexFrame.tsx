import React from 'react';
import { soundManager } from '../utils/audio';
import { MythicStampGutter } from './MythicStampGutter';
import { FloatingDoodles } from './FloatingDoodles';

export type PageRoute = 'genesis' | 'pantheon' | 'mnemosyne' | 'hermes';

interface MythicCodexFrameProps {
  activePage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  unlockedCount: number;
  totalLabors: number;
  theme: 'dark' | 'light';
  children: React.ReactNode;
}

export const MythicCodexFrame: React.FC<MythicCodexFrameProps> = ({
  activePage,
  onNavigate,
  unlockedCount,
  totalLabors,
  theme,
  children
}) => {
  const isDark = theme === 'dark';

  const tabs: { id: PageRoute; title: string; subtitle: string; icon: string }[] = [
    { id: 'genesis', title: 'Genesis', subtitle: 'Origin & Lab', icon: '&#9678;' },
    { id: 'pantheon', title: 'Pantheon', subtitle: 'Architectures', icon: '&#9876;' },
    { id: 'mnemosyne', title: 'Mnemosyne', subtitle: 'Poetry, Art & Me', icon: '&#10022;' },
    { id: 'hermes', title: 'Hermes', subtitle: 'Connect & Dispatch', icon: '&#10070;' }
  ];

  return (
    <div className="relative w-full max-w-6xl mx-auto my-4 sm:my-8 px-2 sm:px-4 lg:px-6">
      
      {/* Ancient Greek Mythological Stamp Gutters (Left & Right Margins) */}
      <MythicStampGutter side="left" theme={theme} />
      <MythicStampGutter side="right" theme={theme} />

      {/* Floating Interactive Margin Doodles */}
      <FloatingDoodles theme={theme} />

      {/* The Master Codex / Manuscript Container */}
      <div 
        className="relative rounded-2xl sm:rounded-3xl border transition-all duration-300 shadow-2xl overflow-hidden"
        style={{
          backgroundColor: isDark ? 'rgba(14, 17, 24, 0.94)' : 'rgba(250, 246, 240, 0.96)',
          borderColor: isDark ? 'rgba(234, 88, 12, 0.35)' : 'rgba(194, 65, 12, 0.35)',
          boxShadow: isDark 
            ? '0 12px 40px -4px rgba(0, 0, 0, 0.8), 0 0 20px -2px rgba(234, 88, 12, 0.15)'
            : '0 12px 40px -4px rgba(194, 65, 12, 0.12), 0 0 20px -2px rgba(194, 65, 12, 0.08)'
        }}
      >
        {/* Embossed Ancient Bronze Corner Ornaments */}
        <div className="absolute top-0 left-0 w-8 h-8 pointer-events-none z-20 opacity-70">
          <svg viewBox="0 0 32 32" className="w-full h-full text-amber-600">
            <path d="M0,0 L24,0 L24,4 L4,4 L4,24 L0,24 Z" fill="currentColor" />
            <circle cx="8" cy="8" r="2" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none z-20 opacity-70 transform rotate-90">
          <svg viewBox="0 0 32 32" className="w-full h-full text-amber-600">
            <path d="M0,0 L24,0 L24,4 L4,4 L4,24 L0,24 Z" fill="currentColor" />
            <circle cx="8" cy="8" r="2" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-8 h-8 pointer-events-none z-20 opacity-70 transform -rotate-90">
          <svg viewBox="0 0 32 32" className="w-full h-full text-amber-600">
            <path d="M0,0 L24,0 L24,4 L4,4 L4,24 L0,24 Z" fill="currentColor" />
            <circle cx="8" cy="8" r="2" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none z-20 opacity-70 transform rotate-180">
          <svg viewBox="0 0 32 32" className="w-full h-full text-amber-600">
            <path d="M0,0 L24,0 L24,4 L4,4 L4,24 L0,24 Z" fill="currentColor" />
            <circle cx="8" cy="8" r="2" fill="currentColor" />
          </svg>
        </div>

        {/* Leather Spine & Binding Top Header */}
        <div 
          className="relative px-4 sm:px-8 py-3.5 border-b flex flex-wrap items-center justify-between gap-3"
          style={{
            backgroundColor: isDark ? '#11141b' : '#f2ede4',
            borderColor: isDark ? 'rgba(234, 88, 12, 0.25)' : 'rgba(194, 65, 12, 0.25)'
          }}
        >
          {/* Terracotta Hanging Bookmark Ribbon on Left */}
          <div 
            className="hidden sm:block absolute -top-1 left-8 w-6 h-12 rounded-b-md shadow-md transform -translate-y-2 pointer-events-none z-30"
            style={{
              backgroundColor: isDark ? '#ea580c' : '#c2410c'
            }}
          >
            <div className="w-full h-full relative">
              <div 
                className="absolute bottom-0 left-0 right-0 h-2 bg-transparent"
                style={{
                  clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                  backgroundColor: isDark ? '#11141b' : '#f2ede4'
                }}
              />
            </div>
          </div>

          {/* Codex Folio Metadata & Wax Seal */}
          <div className="flex items-center gap-2.5 sm:ml-10">
            <div className="w-5 h-5 rounded-full bg-amber-600/20 border border-amber-600/40 flex items-center justify-center text-[10px] text-amber-600 font-serif">
              &#9889;
            </div>
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-ember-600 dark:text-ember-400 font-bold flex items-center gap-1.5">
              CODEX EREBUS &middot; TOMUS IV
            </span>
            <span className="text-text-dim">&middot;</span>
            <span className="font-mono text-[10px] text-text-muted hidden md:inline">
              IISER Bhopal &middot; DSCL IIT Jodhpur &middot; WorldQuant Brain
            </span>
          </div>

          {/* Top Codex Navigation Tabs with Clean Path Linking */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1">
            {tabs.map((tab) => {
              const isActive = activePage === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    soundManager.playClick();
                    onNavigate(tab.id);
                  }}
                  className={`relative px-3 sm:px-4 py-1.5 rounded-lg font-mono text-xs transition-all duration-200 flex items-center gap-1.5 particle-trigger whitespace-nowrap ${
                    isActive
                      ? 'bg-ember-500/15 text-ember-600 dark:text-ember-400 font-bold border border-ember-600 shadow-[0_0_12px_rgba(234,88,12,0.18)]'
                      : 'text-text-muted hover:text-text hover:bg-surface border border-transparent'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span dangerouslySetInnerHTML={{ __html: tab.icon }} />
                  <span>{tab.title}</span>
                  <span className="hidden lg:inline text-[10px] text-text-dim font-normal">
                    ({tab.subtitle})
                  </span>
                  {tab.id === 'pantheon' && unlockedCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full bg-ember-600/20 text-ember-600 dark:text-ember-400 text-[10px]">
                      {unlockedCount}/{totalLabors}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Greek Meandros Ornamental Frieze Divider */}
        <div 
          className="h-2 w-full overflow-hidden opacity-30 select-none border-b border-border/30"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 4px, currentColor 4px, currentColor 8px)`
          }}
        />

        {/* Parchment Inner Content Bed (with Hellenic marble parchment texture) */}
        <div className="p-4 sm:p-8 lg:p-10 hellenic-parchment min-h-[600px]">
          {children}
        </div>

        {/* Greek Meandros Ornamental Bottom Divider */}
        <div 
          className="h-1.5 w-full overflow-hidden opacity-25 select-none border-t border-border/30"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 6px, currentColor 6px, currentColor 12px)`
          }}
        />

        {/* Manuscript Footer Trim */}
        <div 
          className="px-4 sm:px-8 py-3 border-t flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-text-dim"
          style={{
            backgroundColor: isDark ? '#0b0d12' : '#f7f2ea',
            borderColor: isDark ? 'rgba(234, 88, 12, 0.2)' : 'rgba(194, 65, 12, 0.2)'
          }}
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-ember-600"></span>
            <span>Folio: /{activePage}</span>
            <span>&middot;</span>
            <span>Inscribed by Kshitiz Kumar Sinha</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">Sigillum Erebos</span>
            <span>&middot;</span>
            <span>Scroll IV &copy; 2026</span>
          </div>
        </div>

      </div>

    </div>
  );
};
