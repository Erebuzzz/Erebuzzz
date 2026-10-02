import React from 'react';
import { HeroAstrolabe } from '../components/HeroAstrolabe';
import { OriginLabSection } from '../components/OriginLabSection';

interface GenesisPageProps {
  elevation: number;
  onElevationChange: (val: number) => void;
  onUnlockBadge: (id: string, label: string) => void;
}

export const GenesisPage: React.FC<GenesisPageProps> = ({
  elevation,
  onElevationChange,
  onUnlockBadge
}) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* Hero Astrolabe Section */}
      <HeroAstrolabe
        elevation={elevation}
        onElevationChange={onElevationChange}
        onUnlockBadge={onUnlockBadge}
      />

      {/* Jackie Zhang Inspired "3 Things I Strongly Believe In" Pinned Notes */}
      <section className="pt-2">
        <div className="font-mono text-xs text-ember-600 dark:text-ember-500 uppercase tracking-wider font-semibold mb-3">
          Axioms &middot; Core Philosophy
        </div>
        <h2 className="font-display font-bold text-xl sm:text-2xl text-text tracking-tight mb-6 shimmer-text">
          3 Things I Strongly Believe In
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          
          {/* Note 1 */}
          <div className="relative p-5 rounded-lg border border-border bg-surface shadow-md transform -rotate-1 hover:rotate-0 transition-transform duration-300">
            {/* Masking Tape Header */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-ember-500/20 border border-ember-600/30 backdrop-blur-sm -rotate-2"></div>
            <div className="font-mono text-[11px] text-ember-600 dark:text-ember-400 font-bold mb-1">
              [01] CLARITY
            </div>
            <h3 className="font-display font-bold text-lg text-text mb-2">
              Tirelessly pursue mathematical clarity.
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              If an architecture cannot be proved with an invariant, a Lyapunov function, or an AST graph, it is a liability waiting to surface at 2 AM.
            </p>
          </div>

          {/* Note 2 */}
          <div className="relative p-5 rounded-lg border border-border bg-surface shadow-md transform rotate-1 hover:rotate-0 transition-transform duration-300">
            {/* Masking Tape Header */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-cyan-500/20 border border-cyan-600/30 backdrop-blur-sm rotate-1"></div>
            <div className="font-mono text-[11px] text-cyan-500 font-bold mb-1">
              [02] VERIFICATION
            </div>
            <h3 className="font-display font-bold text-lg text-text mb-2">
              Trust the graph, not the vibes.
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Whether evaluating LLM-generated code taint flows or multi-agent messaging channels, deterministic dataflow graphs outlast prompt heuristics every time.
            </p>
          </div>

          {/* Note 3 */}
          <div className="relative p-5 rounded-lg border border-border bg-surface shadow-md transform -rotate-1.5 hover:rotate-0 transition-transform duration-300">
            {/* Masking Tape Header */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-emerald-500/20 border border-emerald-600/30 backdrop-blur-sm -rotate-1"></div>
            <div className="font-mono text-[11px] text-emerald-500 font-bold mb-1">
              [03] PRAGMATISM
            </div>
            <h3 className="font-display font-bold text-lg text-text mb-2">
              Automate the cleanup ruthlessly.
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              &ldquo;I break things, automate the cleanup, then pretend it was all part of the plan.&rdquo; Rapid experimentation is only viable with bulletproof telemetry.
            </p>
          </div>

        </div>
      </section>

      {/* Origin, Crucible & WorldQuant Residency */}
      <OriginLabSection />

    </div>
  );
};
