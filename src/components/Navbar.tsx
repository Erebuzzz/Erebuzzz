import React from 'react';
import { Volume2, VolumeX, Moon, Sun, Github, Terminal as TerminalIcon } from 'lucide-react';
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
  const [audioMuted, setAudioMuted] = React.useState(soundManager.isMuted());

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

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-bg/80 border-b border-border transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Geometrical Erebus Emblem */}
        <a 
          href="#hero" 
          className="flex items-center gap-3 group"
          onClick={() => soundManager.playClick()}
        >
          {/* Geometrical SVG Emblem of Mythological God Erebus */}
          <div className="relative w-9 h-9 rounded-lg border border-border bg-surface flex items-center justify-center group-hover:border-ember-600 transition-colors shadow-sm">
            <svg 
              className="w-6 h-6 transition-transform duration-300 group-hover:scale-105" 
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
            <span className="font-mono text-[10px] text-text-muted tracking-wide">
              Kshitiz &middot; Horizon
            </span>
          </div>
        </a>

        {/* Navigation Anchor Links */}
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
        <div className="flex items-center gap-2">
          
          {/* Sound Synthesizer Toggle */}
          <button
            onClick={handleToggleAudio}
            className="w-8 h-8 rounded-md border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text hover:border-border-bright transition-colors"
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
            className="w-8 h-8 rounded-md border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text hover:border-border-bright transition-colors"
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
            className="w-8 h-8 rounded-md border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text hover:border-border-bright transition-colors"
            title="GitHub Profile"
            aria-label="GitHub Profile"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>

      </div>
    </header>
  );
};
