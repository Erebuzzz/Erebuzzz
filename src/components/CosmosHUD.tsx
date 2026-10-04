import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { RepoGraph, RepoGraphNode } from '../data/repoGraphs';
import { Project } from '../data/projects';
import { soundManager } from '../utils/audio';
import { 
  RotateCcw, 
  ExternalLink, 
  Maximize2, 
  Minimize2,
  FileText,
  Activity,
  Compass
} from 'lucide-react';

interface CosmosHUDProps {
  graph: RepoGraph;
  project: Project;
  selectedNode: RepoGraphNode | null;
  onSelectNode: (node: RepoGraphNode) => void;
  activeCluster: string | null;
  onSelectCluster: (cluster: string | null) => void;
  onResetView: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onSwitchToCodex: () => void;
  theme?: 'dark' | 'light';
}

export const CosmosHUD: React.FC<CosmosHUDProps> = ({
  graph,
  project,
  selectedNode,
  onSelectNode,
  activeCluster,
  onSelectCluster,
  onResetView,
  isFullscreen,
  onToggleFullscreen,
  onSwitchToCodex
}) => {
  const dossierRef = useRef<HTMLDivElement>(null);
  const metricValuesRef = useRef<Record<string, number>>({});
  const [displayMetrics, setDisplayMetrics] = useState<Record<string, string>>({});

  // Get unique clusters present in this graph
  const clusters = Array.from(new Set(graph.nodes.map(n => n.cluster)));

  // Animate numerical counters whenever selectedNode changes
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

    // Also animate dossier slide-in with elastic bounce
    if (dossierRef.current) {
      anime({
        targets: dossierRef.current,
        translateY: [24, 0],
        opacity: [0, 1],
        duration: 450,
        easing: 'easeOutElastic(1, .8)'
      });
    }

    return () => {
      animation.pause();
    };
  }, [selectedNode]);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-5 select-none z-20">
      
      {/* Top Bar HUD */}
      <div className="flex flex-wrap items-start justify-between gap-3 pointer-events-auto">
        
        {/* Left: Mythic Codex Title & Epigraph */}
        <div className="p-3 sm:p-3.5 rounded-xl border border-amber-600/30 bg-surface/80 backdrop-blur-md shadow-xl max-w-md">
          <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs text-amber-500 uppercase tracking-widest font-bold">
            <span className="animate-pulse">&#9670;</span>
            <span>{graph.mythicTitle}</span>
          </div>
          <h2 className="font-display font-bold text-sm sm:text-lg text-text mt-0.5 leading-tight">
            {graph.title}
          </h2>
          <p className="text-[11px] sm:text-xs text-text-muted mt-1 italic font-serif leading-snug">
            &ldquo;{graph.epigraph}&rdquo;
          </p>
        </div>

        {/* Right: Controls & View Switches */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-surface/80 backdrop-blur-md p-1.5 rounded-xl border border-border shadow-lg">
          <button
            onClick={() => {
              soundManager.playClick();
              onResetView();
            }}
            title="Re-center Apollo Spotlight & Camera"
            className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-elevated transition-colors border border-transparent hover:border-border flex items-center gap-1.5 text-xs font-mono"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Re-center</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onSwitchToCodex();
            }}
            title="Switch to Manuscript Codex blueprint"
            className="px-2.5 py-1.5 rounded-lg text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 transition-colors border border-amber-500/30 flex items-center gap-1.5 text-xs font-mono font-semibold"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Manuscript Codex</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onToggleFullscreen();
            }}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Cosmos"}
            className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-elevated transition-colors border border-transparent hover:border-border"
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Cluster Navigation Pill Bar */}
      <div className="my-auto pointer-events-auto flex flex-col gap-1.5 self-start bg-surface/80 backdrop-blur-md p-2 rounded-xl border border-border shadow-lg max-w-[170px] sm:max-w-none">
        <div className="font-mono text-[9px] uppercase tracking-wider text-text-dim px-1 font-semibold flex items-center gap-1">
          <Compass className="w-3 h-3 text-amber-500" />
          <span>Subsystems</span>
        </div>
        <div className="flex flex-wrap sm:flex-col gap-1">
          <button
            onClick={() => {
              soundManager.playClick();
              onSelectCluster(null);
            }}
            className={`px-2 py-1 rounded text-left font-mono text-[10px] sm:text-xs transition-colors ${
              activeCluster === null
                ? 'bg-amber-600 text-white font-bold shadow-sm'
                : 'text-text-muted hover:text-text hover:bg-surface-elevated'
            }`}
          >
            All Clusters ({graph.nodes.length})
          </button>
          {clusters.map((c) => (
            <button
              key={c}
              onClick={() => {
                soundManager.playClick();
                onSelectCluster(activeCluster === c ? null : c);
              }}
              className={`px-2 py-1 rounded text-left font-mono text-[10px] sm:text-xs uppercase tracking-tight transition-colors capitalize ${
                activeCluster === c
                  ? 'bg-amber-600 text-white font-bold shadow-sm'
                  : 'text-text-muted hover:text-text hover:bg-surface-elevated'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Quick Node List */}
        <div className="pt-1 mt-1 border-t border-border/60 hidden sm:flex flex-col gap-0.5 max-h-36 overflow-y-auto">
          {graph.nodes
            .filter((n) => !activeCluster || n.cluster === activeCluster)
            .map((n) => (
              <button
                key={n.id}
                onClick={() => {
                  soundManager.playClick();
                  onSelectNode(n);
                }}
                className={`px-1.5 py-0.5 rounded text-left font-mono text-[9px] truncate transition-colors flex items-center gap-1 ${
                  selectedNode?.id === n.id
                    ? 'text-amber-500 font-bold bg-amber-500/10'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                <span className="text-[10px]">{n.mythicSigil}</span>
                <span className="truncate">{n.label}</span>
              </button>
            ))}
        </div>
      </div>

      {/* Bottom Area: Selected Node Tactical Dossier & Live Telemetry */}
      <div className="flex flex-col lg:flex-row items-end justify-between gap-3 pointer-events-auto mt-auto">
        
        {/* Overall Repo Stats Bar */}
        <div className="hidden sm:flex items-center gap-4 bg-surface/85 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-border shadow-lg">
          <div className="flex items-center gap-1.5 text-xs font-mono text-amber-500 font-bold">
            <Activity className="w-3.5 h-3.5" />
            <span>Telemetry</span>
          </div>
          <div className="flex items-center gap-3 divide-x divide-border/60">
            {graph.stats.map((s, idx) => (
              <div key={idx} className={idx > 0 ? "pl-3" : ""}>
                <div className="text-[9px] font-mono uppercase tracking-wider text-text-dim">
                  {s.label}
                </div>
                <div className="font-mono text-xs font-bold text-text">
                  {s.value} <span className="text-[10px] font-normal text-text-muted">{s.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Node Dossier Card */}
        {selectedNode && (
          <div 
            ref={dossierRef}
            className="w-full sm:max-w-md bg-surface/90 backdrop-blur-xl border border-amber-600/40 rounded-xl p-3.5 sm:p-4 shadow-2xl space-y-3"
          >
            {/* Dossier Header */}
            <div className="flex items-start justify-between gap-2 border-b border-border/80 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-serif text-lg font-bold shadow-inner"
                  style={{ 
                    backgroundColor: `${selectedNode.color}20`,
                    color: selectedNode.color,
                    border: `1px solid ${selectedNode.color}60`
                  }}
                >
                  {selectedNode.mythicSigil}
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-text-dim flex items-center gap-1.5">
                    <span 
                      className="w-1.5 h-1.5 rounded-full animate-ping"
                      style={{ backgroundColor: selectedNode.color }}
                    />
                    <span className="capitalize">{selectedNode.cluster}</span> &middot; {selectedNode.sublabel}
                  </div>
                  <h3 className="font-display font-bold text-sm sm:text-base text-text leading-tight">
                    {selectedNode.label}
                  </h3>
                </div>
              </div>

              <span 
                className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: `${selectedNode.color}15`,
                  color: selectedNode.color,
                  border: `1px solid ${selectedNode.color}40`
                }}
              >
                {selectedNode.geometryType}
              </span>
            </div>

            {/* Role & Details */}
            <p className="text-xs text-text-muted leading-relaxed">
              {selectedNode.role}
            </p>

            {/* Live Numerical Telemetry Counters */}
            <div className="grid grid-cols-2 gap-2 bg-surface-elevated/70 p-2.5 rounded-lg border border-border">
              {selectedNode.metrics.map((m, idx) => {
                const key = `m_${idx}`;
                const valStr = displayMetrics[key] || '0';
                return (
                  <div key={idx} className="flex flex-col">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-text-dim">
                      {m.label}
                    </span>
                    <span className="font-mono text-sm sm:text-base font-bold text-text flex items-baseline gap-1">
                      <span>{valStr}</span>
                      <span className="text-[10px] font-normal text-amber-500">{m.unit}</span>
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Optional Code Snippet */}
            {selectedNode.codeSnippet && (
              <div className="p-2 rounded-md bg-black/60 border border-border font-mono text-[10px] text-amber-300 overflow-x-auto whitespace-pre leading-relaxed">
                {selectedNode.codeSnippet}
              </div>
            )}

            {/* Links / Action row */}
            <div className="flex items-center justify-between pt-1 text-[11px] font-mono">
              <span className="text-text-dim text-[10px]">
                Tip: Click another node or drag to orbit
              </span>
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playClick()}
                  className="text-amber-500 hover:text-amber-400 font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Inspect Source</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
