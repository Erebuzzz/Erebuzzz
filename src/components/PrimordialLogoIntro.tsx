import React, { useState, useEffect } from 'react';
import anime from 'animejs';
import { soundManager } from '../utils/audio';

interface PrimordialLogoIntroProps {
  onComplete: () => void;
  forcePlay?: boolean;
}

export const PrimordialLogoIntro: React.FC<PrimordialLogoIntroProps> = ({
  onComplete,
  forcePlay = false
}) => {
  const [visible, setVisible] = useState(() => {
    if (forcePlay) return true;
    try {
      return !sessionStorage.getItem('erebus_intro_played');
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!visible) {
      onComplete();
      return;
    }

    // Play subtle primordial entrance chime
    soundManager.playClick();

    // 1. Entrance timeline: Emergence -> Resonance -> Implosion Collapse
    const tl = anime.timeline({
      easing: 'easeOutExpo',
      complete: () => {
        try {
          sessionStorage.setItem('erebus_intro_played', 'true');
        } catch {
          // Fallback
        }
        setVisible(false);
        onComplete();
      }
    });

    // Phase 1: Logo Emergence
    tl.add({
      targets: '#intro-logo-container',
      scale: [0.65, 1],
      opacity: [0, 1],
      duration: 1000,
      easing: 'easeOutQuart'
    })
    // Phase 2: Concentric Rings Pulse
    .add({
      targets: '.intro-ring',
      scale: [0.8, 1.25],
      opacity: [0.3, 0.8],
      duration: 800,
      easing: 'easeInOutQuad'
    }, '-=400')
    // Phase 3: The Primordial Collapse (Implosion into Singularity)
    .add({
      targets: '#intro-logo-core',
      scale: [1, 1.2, 0.01],
      rotate: [0, 180],
      duration: 650,
      easing: 'easeInBack',
      begin: () => {
        soundManager.playChime();
      }
    }, '+=200')
    // Phase 4: Fullscreen Void Fade Out
    .add({
      targets: '#intro-veil',
      opacity: [1, 0],
      scale: [1, 1.05],
      duration: 500,
      easing: 'easeOutQuad'
    }, '-=150');

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        tl.pause();
        try {
          sessionStorage.setItem('erebus_intro_played', 'true');
        } catch {
          // Fallback
        }
        setVisible(false);
        onComplete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      tl.pause();
    };
  }, [visible, onComplete]);

  if (!visible) return null;

  return (
    <div
      id="intro-veil"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050608] select-none overflow-hidden cursor-pointer"
      onClick={() => {
        try {
          sessionStorage.setItem('erebus_intro_played', 'true');
        } catch {
          // Fallback
        }
        setVisible(false);
        onComplete();
      }}
    >
      {/* Skip button in upper corner */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            try {
              sessionStorage.setItem('erebus_intro_played', 'true');
            } catch {
              // Fallback
            }
            setVisible(false);
            onComplete();
          }}
          className="px-3 py-1.5 rounded-full border border-ember-600/30 bg-ember-600/10 text-ember-500 font-mono text-[11px] hover:bg-ember-600/20 transition-colors"
        >
          <span>Skip [Esc]</span>
        </button>
      </div>

      {/* Center Emblem Container */}
      <div id="intro-logo-container" className="relative flex flex-col items-center justify-center">
        
        {/* Expanding Sacred Rings */}
        <div className="intro-ring absolute w-48 h-48 sm:w-64 sm:h-64 rounded-full border border-amber-500/20 pointer-events-none" />
        <div className="intro-ring absolute w-60 h-60 sm:w-80 sm:h-80 rounded-full border border-dashed border-amber-600/30 pointer-events-none" />

        {/* Ambient Amber Core Glow */}
        <div className="absolute w-36 h-36 rounded-full bg-amber-600/25 blur-2xl pointer-events-none" />

        {/* Geometrical Erebus Emblem Core (Collapses on exit) */}
        <div id="intro-logo-core" className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
          <svg
            className="w-full h-full drop-shadow-[0_0_25px_rgba(234,88,12,0.6)]"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Sacred Hexagon */}
            <polygon
              points="32,4 58,18 58,46 32,60 6,46 6,18"
              stroke="#ea580c"
              strokeWidth="1.8"
              fill="#08090c"
            />
            {/* Top Facet */}
            <polygon
              points="32,10 44,24 32,34 20,24"
              fill="#181c26"
              stroke="#f59e0b"
              strokeWidth="1.2"
            />
            {/* Right Facet */}
            <polygon
              points="32,34 44,24 52,38 32,54"
              fill="#131722"
              stroke="#ea580c"
              strokeWidth="1"
            />
            {/* Left Facet */}
            <polygon
              points="32,34 20,24 12,38 32,54"
              fill="#0d1017"
              stroke="#ea580c"
              strokeWidth="1"
            />
            {/* Center Primordial Flame Diamond */}
            <polygon
              points="32,25 38,33 32,41 26,33"
              fill="#ea580c"
              stroke="#fed7aa"
              strokeWidth="1"
            />
            <circle cx="32" cy="33" r="2" fill="#ffffff" />
          </svg>
        </div>

        {/* Subtitle & Inscription */}
        <div className="mt-8 text-center space-y-1.5">
          <div className="font-mono text-xs sm:text-sm font-bold tracking-[0.25em] text-amber-500 uppercase">
            EREBUS &middot; KSHITIZ
          </div>
          <div className="font-serif text-[11px] sm:text-xs text-text-dim tracking-widest uppercase">
            Ex Nihilo Omnia &middot; Inscribing the Codex
          </div>
        </div>

      </div>
    </div>
  );
};
