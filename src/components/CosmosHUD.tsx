import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { RepoGraphNode } from '../data/repoGraphs';
import { Project } from '../data/projects';
import { soundManager } from '../utils/audio';
import { ExternalLink, Github, Code, CheckCircle, Activity, Sparkles } from 'lucide-react';

interface CosmosHUDProps {
  selectedNode: RepoGraphNode | null;
  project: Project;
}

export const CosmosHUD: React.FC<CosmosHUDProps> = ({
  selectedNode,
  project
}) => {
  const dossierRef = useRef<HTMLDivElement>(null);
  const metricValuesRef = useRef<Record<string, number>>({});
  const [displayMetrics, setDisplayMetrics] = useState<Record<string, string>>({});

  // Animate numerical telemetry counters on node selection
  useEffect(() => {
    if (!selectedNode) return;

    const targetsObj: Record<string, number> = {};
    const initialDisplay: Record<string, string> = {};

    selectedNode.metrics.forEach((_m, idx) => {
      const key = `m_${idx}`;
      targetsObj[key] = 0;
      initialDisplay[key] = '0';
    });

    metricValuesRef.current = targetsObj;

    const animTargets: Record<string, number> = {};
    selectedNode.metrics.forEach((m, idx) => {
      animTargets[`m_${idx}`] = m.value;
    });

    const animation = anime({
      targets: metricValuesRef.current,
      ...animTargets,
      duration: 750,
      easing: 'easeOutExpo',
      update: () => {
        const nextDisplay: Record<string, string> = {};
        selectedNode.metrics.forEach((m, idx) => {
          const key = `m_${idx}`;
          const val = metricValuesRef.current[key] ?? 0;
          if (m.formatDecimals) {
            nextDisplay[key] = val.toFixed(m.formatDecimals);
          } else {
            nextDisplay[key] = Math.round(val).toLocaleString();
          }
        });
        setDisplayMetrics(nextDisplay);
      }
    });

    // Elastic bounce entrance for inspector card
    if (dossierRef.current) {
      anime({
        targets: dossierRef.current,
        translateY: [16, 0],
        opacity: [0, 1],
        duration: 350,
        easing: 'easeOutCubic'
      });
    }

    return () => {
      animation.pause();
    };
  }, [selectedNode]);

  if (!selectedNode) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-text-dim border-l border-border bg-surface/40">
        <Sparkles className="w-8 h-8 text-amber-500/40 mb-2 animate-pulse" />
        <p className="font-mono text-xs uppercase tracking-wider">
          Click any root, bough, or golden leaf to inspect subsystem telemetry
        </p>
      </div>
    );
  }

  // Botanical type labels
  const botanicalLabels: Record<string, string> = {
    taproot: "Primordial Taproot Nexus",
    bough: "Major Subterranean Bough",
    tendril: "Vascular Root Tendril",
    leaf: "Golden Laurel Leaf",
    bulb: "Amber Seed Pod"
  };

  return (
    <div 
      ref={dossierRef}
      className="h-full flex flex-col justify-between border-l border-border bg-surface/95 backdrop-blur-xl overflow-y-auto p-4 sm:p-5 space-y-4"
    >
      {/* Top Node Identity Header */}
      <div className="space-y-2 border-b border-border/70 pb-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span 
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: selectedNode.color }}
            />
            <span className="font-mono text-[10px] text-amber-500 font-bold uppercase tracking-wider">
              {botanicalLabels[selectedNode.botanicalType] || selectedNode.botanicalType}
            </span>
          </div>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-border bg-surface-elevated text-text-muted capitalize">
            {selectedNode.cluster}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center font-serif text-xl font-bold shrink-0 shadow-lg"
            style={{ 
              backgroundColor: `${selectedNode.color}20`,
              color: selectedNode.color,
              border: `1px solid ${selectedNode.color}70`
            }}
          >
            {selectedNode.mythicSigil}
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-bold text-base text-text leading-tight truncate">
              {selectedNode.label}
            </h3>
            <p className="font-mono text-[11px] text-text-dim truncate">
              {selectedNode.sublabel}
            </p>
          </div>
        </div>
      </div>

      {/* Role & Botanical Invariant Description */}
      <div className="space-y-1.5">
        <div className="font-mono text-[10px] uppercase tracking-wider text-text-dim flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-amber-500" />
          <span>Subsystem Role &amp; Dynamics</span>
        </div>
        <p className="text-xs text-text-muted leading-relaxed font-serif">
          {selectedNode.role}
        </p>
        <p className="text-[11px] text-text-dim leading-relaxed italic">
          {selectedNode.details}
        </p>
      </div>

      {/* Live Animated Numerical Telemetry Grid */}
      <div className="space-y-1.5">
        <div className="font-mono text-[10px] uppercase tracking-wider text-text-dim flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-amber-500" />
          <span>Live Verified Telemetry</span>
        </div>
        <div className="grid grid-cols-2 gap-2 bg-surface-elevated/80 p-3 rounded-xl border border-border shadow-inner">
          {selectedNode.metrics.map((m, idx) => {
            const key = `m_${idx}`;
            const valStr = displayMetrics[key] || '0';
            return (
              <div key={idx} className="flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-wider text-text-dim truncate">
                  {m.label}
                </span>
                <span className="font-mono text-base font-bold text-text flex items-baseline gap-1 mt-0.5">
                  <span>{valStr}</span>
                  <span className="text-[11px] font-normal text-amber-500">{m.unit}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Code Snippet Box (If present) */}
      {selectedNode.codeSnippet && (
        <div className="space-y-1.5">
          <div className="font-mono text-[10px] uppercase tracking-wider text-text-dim flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5 text-amber-500" />
            <span>Vascular Code Pattern</span>
          </div>
          <div className="p-2.5 rounded-lg bg-black/80 border border-border font-mono text-[10px] text-amber-300 overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
            {selectedNode.codeSnippet}
          </div>
        </div>
      )}

      {/* Action Links & Repository Anchors */}
      <div className="pt-2 border-t border-border/80 flex flex-wrap items-center gap-2">
        {project.pypiUrl && (
          <a
            href={project.pypiUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playClick()}
            className="px-2.5 py-1.5 rounded-lg border border-amber-600/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>PyPI</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}

        {project.npmUrl && (
          <a
            href={project.npmUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playClick()}
            className="px-2.5 py-1.5 rounded-lg border border-amber-600/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>npm</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}

        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playClick()}
            className="px-2.5 py-1.5 rounded-lg border border-amber-600/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>Live System</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}

        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playClick()}
            className="px-2.5 py-1.5 rounded-lg border border-border bg-surface-elevated hover:border-amber-600 text-text font-mono text-xs flex items-center gap-1.5 transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>Source</span>
          </a>
        )}
      </div>

    </div>
  );
};
