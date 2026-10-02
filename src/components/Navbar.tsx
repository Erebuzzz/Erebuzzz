import React, { useState } from 'react';
import { Volume2, VolumeX, Moon, Sun, Github, Terminal as TerminalIcon, Menu, X, Compass, Shield, Cpu, Layers } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface NavbarProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  unlockedCount: number;
  totalLabors: number;
  onOpenTerminal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  unlockedCount,
  totalLabors,
  onOpenTerminal
}) => {
  const [audioMuted, setAudioMuted] = useState(soundManager.isMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleToggleAudio = () => {
    const isMuted = soundManager.toggleMute();
    setAudioMuted(isMuted);
    if (!isMuted) {
      soundManager.playClick();
    }
  };

  const handleThemeClick = () => {
    soundManager.playClick();
    onToggleTheme();
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-bg/85 border-b border-border transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand & Geometrical Erebus Emblem */}
          <a 
            href="#hero" 
            className="flex items-center gap-2.5 sm:gap-3 group"
            onClick={() => soundManager.playClick()}
          >
            {/* Geometrical SVG Emblem of Mythological God Erebus */}
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-border bg-surface flex items-center justify-center group-hover:border-ember-600 transition-colors shadow-sm">
              <svg 
                className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:scale-105" 
                viewBox="0 0 64 64" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Outer Sacred Hexagonal Boundary */}
                <polygon 
                  points="32,4 58,18 58,46 32,60 6,46 6,18" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  className="text-ember-600 dark:text-ember-500 opacity-80"
                />
                {/* Erebus Visor & Brow Facets */}
                <polygon 
                  points="32,10 44,24 32,34 20,24" 
                  fill={theme === 'dark' ? '#1f242d' : '#e5dcce'} 
                  stroke="currentColor" 
                  strokeWidth="1.2"
                  className="text-ember-600 dark:text-ember-400"
                />
                {/* Left Shadow Wing */}
                <polygon 
                  points="32,34 20,24 12,38 32,54" 
                  fill={theme === 'dark' ? '#0e1118' : '#faf6f0'} 
                  stroke="currentColor" 
                  strokeWidth="1"
                  className="text-border-bright"
                />
                {/* Right Shadow Wing */}
                <polygon 
                  points="32,34 44,24 52,38 32,54" 
                  fill={theme === 'dark' ? '#141720' : '#f2ede4'} 
                  stroke="currentColor" 
                  strokeWidth="1"
                  className="text-border-bright"
                />
                {/* Primordial Ember Core / The Inner Horizon */}
                <polygon 
                  points="32,26 37,33 32,40 27,33" 
                  fill="#ea580c" 
                  stroke="#fed7aa" 
                  strokeWidth="0.8"
                />
                {/* Central Singularity */}
                <circle cx="32" cy="33" r="1.5" fill="#ffffff" />
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="font-display font-bold text-sm tracking-tight text-text group-hover:text-ember-600 transition-colors">
                Erebuzzz
              </span>
              <span className="font-mono text-[9px] sm:text-[10px] text-text-muted tracking-wide">
                Kshitiz &middot; Horizon
              </span>
            </div>
          </a>

          {/* Desktop Navigation Anchor Links */}
          <nav className="hidden md:flex items-center gap-6 font-mono text-xs">
            <a 
              href="#labors" 
              onClick={() => soundManager.playClick()}
              className="text-text-muted hover:text-ember-600 transition-colors flex items-center gap-1.5"
            >
              <span>Labors</span>
              {unlockedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-ember-600/10 text-ember-600 dark:text-ember-400 text-[10px] border border-ember-600/30">
                  {unlockedCount}/{totalLabors}
                </span>
              )}
            </a>
            <a 
              href="#experience" 
              onClick={() => soundManager.playClick()}
              className="text-text-muted hover:text-ember-600 transition-colors"
            >
              Origin &amp; Lab
            </a>
            <a 
              href="#builds" 
              onClick={() => soundManager.playClick()}
              className="text-text-muted hover:text-ember-600 transition-colors"
            >
              Pantheon
            </a>
            <a 
              href="#terminal" 
              onClick={() => {
                soundManager.playClick();
                onOpenTerminal();
              }}
              className="text-text-muted hover:text-ember-600 transition-colors flex items-center gap-1"
            >
              <TerminalIcon className="w-3.5 h-3.5" />
              <span>Terminal</span>
            </a>
            <a 
              href="https://unstable-kernel.github.io/docs" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => soundManager.playClick()}
              className="text-text-muted hover:text-ember-600 transition-colors"
            >
              Docs &#8599;
            </a>
          </nav>

          {/* Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Sound Synthesizer Toggle */}
            <button
              onClick={handleToggleAudio}
              className="w-9 h-9 sm:w-8 sm:h-8 rounded-md border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text hover:border-border-bright transition-colors"
              title={audioMuted ? "Unmute audio synthesizer" : "Mute audio synthesizer"}
              aria-label="Toggle audio effects"
            >
              {audioMuted ? (
                <VolumeX className="w-4 h-4 text-text-dim" />
              ) : (
                <Volume2 className="w-4 h-4 text-ember-600 dark:text-ember-500" />
              )}
            </button>

            {/* Theme Toggle (Erebus vs Hemera) */}
            <button
              onClick={handleThemeClick}
              className="w-9 h-9 sm:w-8 sm:h-8 rounded-md border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text hover:border-border-bright transition-colors"
              title={theme === 'dark' ? "Switch to Hemera Dawn (Light)" : "Switch to Erebus Zenith (Dark)"}
              aria-label="Toggle visual theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-ember-500" />
              ) : (
                <Moon className="w-4 h-4 text-ember-700" />
              )}
            </button>

            {/* GitHub Link */}
            <a
              href="https://github.com/Erebuzzz"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playClick()}
              className="hidden sm:flex w-8 h-8 rounded-md border border-border bg-surface items-center justify-center text-text-muted hover:text-text hover:border-border-bright transition-colors"
              title="GitHub Profile"
              aria-label="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => {
                soundManager.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="flex md:hidden w-9 h-9 rounded-md border border-border bg-surface items-center justify-center text-text-muted hover:text-text transition-colors"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-ember-600" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Tactical Mobile Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-surface-elevated/95 backdrop-blur-xl px-4 py-5 animate-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col gap-3 font-mono text-sm">
              <a 
                href="#hero" 
                onClick={() => {
                  soundManager.playClick();
                  closeMobileMenu();
                }}
                className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-surface hover:border-ember-600 text-text transition-colors"
              >
                <Compass className="w-4 h-4 text-ember-600" />
                <span>Celestial Horizon Dial</span>
              </a>

              <a 
                href="#labors" 
                onClick={() => {
                  soundManager.playClick();
                  closeMobileMenu();
                }}
                className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-surface hover:border-ember-600 text-text transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-ember-600" />
                  <span>The Labors of Autonomy</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-ember-600/10 text-ember-600 dark:text-ember-400 text-xs border border-ember-600/30">
                  {unlockedCount}/{totalLabors}
                </span>
              </a>

              <a 
                href="#experience" 
                onClick={() => {
                  soundManager.playClick();
                  closeMobileMenu();
                }}
                className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-surface hover:border-ember-600 text-text transition-colors"
              >
                <Cpu className="w-4 h-4 text-ember-600" />
                <span>Origin, Lab &amp; WorldQuant</span>
              </a>

              <a 
                href="#builds" 
                onClick={() => {
                  soundManager.playClick();
                  closeMobileMenu();
                }}
                className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-surface hover:border-ember-600 text-text transition-colors"
              >
                <Layers className="w-4 h-4 text-ember-600" />
                <span>Pantheon Constellation</span>
              </a>

              <a 
                href="#terminal" 
                onClick={() => {
                  soundManager.playClick();
                  closeMobileMenu();
                  onOpenTerminal();
                }}
                className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-surface hover:border-ember-600 text-text transition-colors"
              >
                <TerminalIcon className="w-4 h-4 text-ember-600" />
                <span>Horizon Terminal Shell</span>
              </a>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-text-muted">
                <a
                  href="https://github.com/Erebuzzz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 p-2 rounded hover:text-text transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub Profile</span>
                </a>
                <a
                  href="https://unstable-kernel.github.io/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-ember-600 dark:text-ember-400 font-semibold"
                >
                  Lab Docs &#8599;
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Mobile Floating Thumb Quick Navigation Dock */}
      <nav 
        className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 md:hidden flex items-center gap-1 p-1.5 rounded-full liquid-glass-card border border-ember-600/40 bg-surface-elevated/95 backdrop-blur-xl shadow-2xl"
        aria-label="Mobile quick actions"
      >
        <a
          href="#hero"
          onClick={() => soundManager.playClick()}
          className="p-2.5 rounded-full hover:bg-ember-500/10 text-text-muted hover:text-ember-600 transition-colors"
          title="Hero Horizon"
          aria-label="Hero Horizon"
        >
          <Compass className="w-4 h-4" />
        </a>

        <a
          href="#labors"
          onClick={() => soundManager.playClick()}
          className="relative p-2.5 rounded-full hover:bg-ember-500/10 text-text-muted hover:text-ember-600 transition-colors"
          title="Labors Quest"
          aria-label="Labors Quest"
        >
          <Shield className="w-4 h-4" />
          {unlockedCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-ember-600 animate-pulse"></span>
          )}
        </a>

        <a
          href="#builds"
          onClick={() => soundManager.playClick()}
          className="p-2.5 rounded-full hover:bg-ember-500/10 text-text-muted hover:text-ember-600 transition-colors"
          title="Pantheon Projects"
          aria-label="Pantheon Projects"
        >
          <Layers className="w-4 h-4" />
        </a>

        <button
          onClick={() => {
            soundManager.playClick();
            onOpenTerminal();
          }}
          className="p-2.5 rounded-full hover:bg-ember-500/10 text-text-muted hover:text-ember-600 transition-colors"
          title="Terminal Shell"
          aria-label="Terminal Shell"
        >
          <TerminalIcon className="w-4 h-4" />
        </button>

        <button
          onClick={handleThemeClick}
          className="p-2.5 rounded-full hover:bg-ember-500/10 text-text-muted hover:text-ember-600 transition-colors"
          title="Toggle Theme"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-ember-500" /> : <Moon className="w-4 h-4 text-ember-700" />}
        </button>
      </nav>
    </>
  );
};
