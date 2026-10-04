import React from 'react';
import { ExternalLink, Cpu, TrendingUp, Compass } from 'lucide-react';
import { soundManager } from '../utils/audio';

export const OriginLabSection: React.FC = () => {
  return (
    <section className="pt-12 pb-6 border-t border-dashed border-border" id="experience">
      <div className="flex flex-col gap-2 mb-6">
        <div className="font-mono text-xs text-ember-600 dark:text-ember-500 uppercase tracking-wider font-semibold">
          Foundational Lab &amp; Quant Residency
        </div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-text tracking-tight shimmer-text">
          The Origin, Crucible &amp; WorldQuant Residency
        </h2>
        <p className="text-xs sm:text-sm text-text-muted">
          Balancing theoretical dynamical control, quantitative alpha modeling, and systems engineering.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Card 1: Unstable Kernel Lab */}
        <div className="liquid-glass-card p-5 rounded-xl border border-border flex flex-col justify-between hover:border-ember-600/60 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-8 h-8 rounded-lg bg-ember-500/10 border border-ember-600/30 flex items-center justify-center text-ember-600">
                <Cpu className="w-4 h-4" />
              </span>
              <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-surface border border-border text-ember-600 dark:text-ember-400 font-semibold">
                Foundational Lab
              </span>
            </div>
            <h3 className="font-display font-bold text-base text-text mb-1">
              Unstable Kernel Lab
            </h3>
            <p className="font-mono text-xs text-text-dim mb-3">
              Founding Lead &middot; Public-by-Default
            </p>
            <p className="text-xs text-text-muted leading-relaxed">
              Foundational research lab for robotics, autonomy, multi-agent frameworks, and AI-assisted engineering tooling. Student-budget, public-by-default, assembling the stack rather than pretending it is a finished platform. Home of MIRAGE and open-source control architectures.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-border flex items-center justify-between">
            <a
              href="https://github.com/Unstable-Kernel"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playClick()}
              className="font-mono text-xs text-ember-600 dark:text-ember-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>github.com/Unstable-Kernel</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://unstable-kernel.github.io/docs"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playClick()}
              className="font-mono text-[11px] text-text-muted hover:text-text transition-colors"
            >
              Docs &#8599;
            </a>
          </div>
        </div>

        {/* Card 2: WorldQuant Consultancy */}
        <div className="liquid-glass-card p-5 rounded-xl border border-border flex flex-col justify-between hover:border-ember-600/60 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-8 h-8 rounded-lg bg-ember-500/10 border border-ember-600/30 flex items-center justify-center text-ember-600">
                <TrendingUp className="w-4 h-4" />
              </span>
              <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-surface border border-border text-emerald-500 font-semibold">
                Active Consultant
              </span>
            </div>
            <h3 className="font-display font-bold text-base text-text mb-1">
              WorldQuant
            </h3>
            <p className="font-mono text-xs text-text-dim mb-3">
              Quantitative Research Consultant &middot; Part-time
            </p>
            <p className="text-xs text-text-muted leading-relaxed">
              Developing systematic mathematical alphas, cross-asset signal discovery, risk modeling, and predictive financial models. Applying dynamical optimization, statistical factor decomposition, and signal processing to global equities.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-border flex items-center justify-between font-mono text-xs text-text-muted">
            <span>Alpha Generation</span>
            <span className="text-ember-600 font-semibold">Convex Optimization</span>
          </div>
        </div>

        {/* Card 3: IISER Bhopal DSCL */}
        <div className="liquid-glass-card p-5 rounded-xl border border-border flex flex-col justify-between hover:border-ember-600/60 transition-all duration-300 md:col-span-2 lg:col-span-1">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-8 h-8 rounded-lg bg-ember-500/10 border border-ember-600/30 flex items-center justify-center text-ember-600">
                <Compass className="w-4 h-4" />
              </span>
              <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-surface border border-border text-text-muted font-semibold">
                Graduating 2027
              </span>
            </div>
            <h3 className="font-display font-bold text-base text-text mb-1">
              IISER Bhopal
            </h3>
            <p className="font-mono text-xs text-text-dim mb-3">
              B.S. in Electronics &amp; Communication Engineering
            </p>
            <p className="text-xs text-text-muted leading-relaxed">
              Final-year undergrad focusing on dynamic control systems, embedded firmware, Kalman filtering, AST parsers, and computer architecture. Research internship alum at DSCL (Department of Electrical Engineering, IIT Jodhpur).
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-border flex items-center justify-between font-mono text-xs text-text-muted">
            <span>ECE &middot; Autonomous Control</span>
            <span className="text-ember-600 font-semibold">Bhopal, India</span>
          </div>
        </div>

      </div>
    </section>
  );
};
