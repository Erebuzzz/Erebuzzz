import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { Flame, Shield, Compass, Sparkles } from 'lucide-react';

interface HeroAstrolabeProps {
  onUnlockBadge?: (id: string, label: string) => void;
}

export const HeroAstrolabe: React.FC<HeroAstrolabeProps> = ({
  onUnlockBadge
}) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Unlock Cartographer Labor upon surveying Horizon Genesis
    if (onUnlockBadge) {
      onUnlockBadge('cartographer', 'Celestial Cartographer: Explored Horizon Genesis');
    }

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
  }, [onUnlockBadge]);

  return (
    <section ref={heroRef} className="relative pt-6 sm:pt-8 pb-10 border-b border-dashed border-border" id="hero">
      <div className="flex flex-col gap-5 sm:gap-6">
        
        {/* Live Telemetry Station Bar (Clean Hellenic Architecture) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 font-mono text-xs text-text-muted">
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse"></span>
            <span className="text-text font-bold tracking-wider">IISER BHOPAL &middot; DSCL IIT JODHPUR</span>
            <span className="text-text-dim">&middot;</span>
            <span className="text-ember-600 dark:text-ember-400 font-semibold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-ember-600 animate-bounce" />
              <span>Prometheus Fire</span>
            </span>
            <span className="text-text-dim">&middot;</span>
            <span className="text-text-dim font-serif italic">Hellenic Autonomous Systems</span>
          </div>

          <div className="self-start sm:self-auto px-3 py-1 rounded-full border border-ember-600/40 bg-ember-500/10 text-ember-600 dark:text-ember-400 text-[11px] font-mono tracking-wide flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3 h-3" />
            <span>Autonomous Control &middot; Quantitative Alpha</span>
          </div>
        </div>

        {/* Mythic Identity Headline */}
        <div>
          <div className="font-mono text-[11px] sm:text-xs text-ember-600 dark:text-ember-500 tracking-wider uppercase mb-1.5 font-semibold flex items-center gap-2">
            <span>&#9889;</span>
            <span>Kshitiz (Horizon) &middot; Personification of Erebus &amp; Hemera</span>
          </div>
          <h1
            ref={headlineRef}
            className="font-display font-bold text-3xl sm:text-5xl md:text-6xl tracking-tight text-text leading-[1.1] mb-3 shimmer-text"
          >
            Kshitiz Kumar Sinha
          </h1>
          <p className="font-mono text-xs sm:text-sm md:text-base text-text-muted leading-relaxed max-w-3xl">
            Robotics Control Loops &middot; Multi-Agent AI Compilers &middot; AST Security &middot; Quantitative Alphas
          </p>
        </div>

        {/* Executive Bio Dispatch on Hellenic Parchment */}
        <div className="liquid-glass-card p-4 sm:p-6 font-mono text-xs sm:text-sm text-text-muted leading-relaxed rounded-2xl border border-border/80 shadow-md">
          <div className="flex items-center gap-2 text-ember-600 dark:text-ember-400 font-semibold mb-2">
            <span>&gt; whoami</span>
            <span className="text-text-dim">&middot;</span>
            <span className="text-[11px] text-text-dim font-normal font-sans">Curator of Autonomous Architectures</span>
          </div>
          <p>
            Final-year Electronics and Communication Engineering at <strong>IISER Bhopal</strong> (graduating April 2027). Quantitative Research Consultant at <strong>WorldQuant Brain</strong> (60+ benchmark-approved alphas). Summer research intern (May - July) at <strong>DSCL (Distributed Systems and Control Laboratory), Department of Electrical Engineering, IIT Jodhpur</strong> under Prof. Anoop Jain (multi-robot source localization &amp; formation). Founder of <strong>Unstable Kernel</strong> (Mirage robotics compiler, CodeShield AST verification, and autonomous agent infrastructure).
          </p>
        </div>

        {/* High-Level Metric Glass Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <div className="hero-metric-card liquid-glass-card p-4 sm:p-5 rounded-xl border border-border/70">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-ember-600 dark:text-ember-500 uppercase font-semibold">
                Quant Alpha Research
              </span>
              <Compass className="w-4 h-4 text-ember-600/60" />
            </div>
            <div className="font-display font-semibold text-lg sm:text-xl text-text mt-1.5">
              WorldQuant Brain
            </div>
            <div className="font-mono text-xs text-text-muted mt-1">
              60+ benchmark-approved alphas
            </div>
          </div>

          <div className="hero-metric-card liquid-glass-card p-4 sm:p-5 rounded-xl border border-border/70">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-cyan-500 uppercase font-semibold">
                Robotics Control Lab
              </span>
              <Flame className="w-4 h-4 text-cyan-500/60" />
            </div>
            <div className="font-display font-semibold text-lg sm:text-xl text-text mt-1.5">
              DSCL IIT Jodhpur
            </div>
            <div className="font-mono text-xs text-text-muted mt-1">
              Research Intern (May - July) &middot; EE Dept &middot; Prof. Anoop Jain
            </div>
          </div>

          <div className="hero-metric-card liquid-glass-card p-4 sm:p-5 rounded-xl border border-border/70 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-emerald-500 uppercase font-semibold">
                Systems &amp; Compilers Lab
              </span>
              <Shield className="w-4 h-4 text-emerald-500/60" />
            </div>
            <div className="font-display font-semibold text-lg sm:text-xl text-text mt-1.5">
              Unstable Kernel
            </div>
            <div className="font-mono text-xs text-text-muted mt-1">
              Mirage, CodeShield &amp; Pixasso
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
