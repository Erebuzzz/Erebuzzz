import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { soundManager } from '../utils/audio';

interface HeroAstrolabeProps {
  elevation: number;
  onElevationChange: (val: number) => void;
  onUnlockBadge: (id: string, label: string) => void;
}

export const HeroAstrolabe: React.FC<HeroAstrolabeProps> = ({
  elevation,
  onElevationChange,
  onUnlockBadge
}) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Anime.js entrance choreography
    anime({
      targets: heroRef.current,
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 1000,
      easing: 'easeOutQuart'
    });

    anime({
      targets: '.hero-metric-card',
      opacity: [0, 1],
      translateY: [16, 0],
      delay: anime.stagger(120, { start: 300 }),
      duration: 800,
      easing: 'easeOutQuad'
    });
  }, []);

  const realmLabel = elevation < 70 ? 'Hemera Dawn' : (elevation < 120 ? 'Twilight Threshold' : 'Erebus Zenith');
  const azimuthVal = (250 + elevation * 0.6).toFixed(1);

  return (
    <section ref={heroRef} className="relative pt-8 pb-10 border-b border-dashed border-border" id="hero">
      <div className="flex flex-col gap-6">
        
        {/* Live Telemetry Station Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-text-muted">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse"></span>
            <span className="text-text font-medium">IISER Bhopal DSCL Station</span>
            <span className="text-text-dim">&middot;</span>
            <span className="text-ember-600 dark:text-ember-500 font-semibold">AZIMUTH {azimuthVal}&deg;</span>
            <span className="text-text-dim">&middot;</span>
            <span className="text-text-dim">ELEVATION {elevation.toFixed(1)}&deg;</span>
          </div>

          <div className="px-2.5 py-1 rounded border border-ember-600/40 bg-ember-500/10 text-ember-600 dark:text-ember-400 text-[11px] font-mono tracking-wide">
            Autonomous Systems &middot; Quant Control
          </div>
        </div>

        {/* Mythic Identity Headline */}
        <div>
          <div className="font-mono text-xs text-ember-600 dark:text-ember-500 tracking-wider uppercase mb-1.5 font-semibold">
            Kshitiz (Horizon) &middot; Personification of Erebus &amp; Hemera
          </div>
          <h1
            ref={headlineRef}
            className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-text leading-[1.1] mb-2 shimmer-text"
          >
            Kshitiz Kumar Sinha
          </h1>
          <p className="font-mono text-sm sm:text-base text-text-muted">
            Robotics Control Loops &middot; Multi-Agent AI Compilers &middot; AST Security &middot; Quantitative Alphas
          </p>
        </div>

        {/* Executive Bio Dispatch */}
        <div className="liquid-glass-card p-5 font-mono text-xs sm:text-sm text-text-muted leading-relaxed">
          <span className="text-ember-600 dark:text-ember-500 font-semibold">&gt; whoami</span><br />
          Final-year Electronics and Communication Engineering at <strong>IISER Bhopal</strong> (graduating April 2027). Quantitative Research Consultant at <strong>WorldQuant Brain</strong> (60+ benchmark-approved alphas). Control theory research alum at <strong>DSCL IIT Jodhpur</strong> under Prof. Anoop Jain (multi-robot source localization &amp; formation). Founder of <strong>Unstable Kernel</strong> (Mirage robotics compiler, CodeShield AST verification, and autonomous agent infrastructure).
        </div>

        {/* Interactive Horizon (Kshitiz) Astrolabe Controller */}
        <div className="liquid-glass-card p-4 flex flex-col gap-2.5">
          <div className="flex justify-between items-center font-mono text-xs">
            <span className="text-ember-600 dark:text-ember-500 font-medium flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="inline-block">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20M2 12h20" />
              </svg>
              Celestial Astrolabe Elevation Dial
            </span>
            <span className="text-text-muted">
              {elevation.toFixed(1)}&deg; &middot; {realmLabel}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="180"
            value={elevation}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onElevationChange(val);
              soundManager.playClick();
              onUnlockBadge('cartographer', 'Celestial Cartographer: Tuned Horizon Astrolabe');
            }}
            className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-ember-600"
            aria-label="Celestial Horizon Astrolabe Elevation Slider"
          />

          <div className="flex justify-between font-mono text-[10px] text-text-dim">
            <span>0&deg; Hemera Dawn (Terracotta Ivory)</span>
            <span>90&deg; Twilight Plane</span>
            <span>180&deg; Erebus Starlight (Obsidian Night)</span>
          </div>
        </div>

        {/* High-Level Metric Glass Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="hero-metric-card liquid-glass-card p-4">
            <div className="font-mono text-[11px] text-ember-600 dark:text-ember-500 uppercase font-semibold">
              Quantitative Alpha Research
            </div>
            <div className="font-display font-semibold text-lg text-text mt-1">
              WorldQuant Brain
            </div>
            <div className="font-mono text-xs text-text-muted mt-1">
              60+ approved alpha signals
            </div>
          </div>

          <div className="hero-metric-card liquid-glass-card p-4">
            <div className="font-mono text-[11px] text-cyan-500 uppercase font-semibold">
              Robotics Control Lab
            </div>
            <div className="font-display font-semibold text-lg text-text mt-1">
              DSCL IIT Jodhpur
            </div>
            <div className="font-mono text-xs text-text-muted mt-1">
              Under Prof. Anoop Jain
            </div>
          </div>

          <div className="hero-metric-card liquid-glass-card p-4">
            <div className="font-mono text-[11px] text-emerald-500 uppercase font-semibold">
              Autonomous Systems Lab
            </div>
            <div className="font-display font-semibold text-lg text-text mt-1">
              Unstable Kernel
            </div>
            <div className="font-mono text-xs text-text-muted mt-1">
              Mirage, CodeShield &amp; EIR
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
