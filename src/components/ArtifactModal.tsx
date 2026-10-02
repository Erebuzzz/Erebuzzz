import React, { useEffect } from 'react';
import { Project } from '../data/projects';
import { soundManager } from '../utils/audio';
import { X, ExternalLink, Github, Layers, Cpu, CheckCircle } from 'lucide-react';

interface ArtifactModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ArtifactModal: React.FC<ArtifactModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundManager.playClick();
        onClose();
      }
    };

    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      soundManager.playChime();
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          soundManager.playClick();
          onClose();
        }
      }}
    >
      <div 
        className="liquid-glass-card w-full max-w-3xl max-h-[92vh] sm:max-h-[90vh] flex flex-col rounded-xl border border-ember-600/40 shadow-2xl bg-surface-elevated overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-5 border-b border-border bg-surface">
          <div className="flex flex-col pr-2">
            <div className="font-mono text-[10px] sm:text-[11px] text-ember-600 dark:text-ember-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <span>&#9889;</span> Architectural Blueprint: {project.mythicCodename}
            </div>
            <h2 id="modal-title" className="font-display font-bold text-base sm:text-xl text-text mt-0.5 truncate">
              {project.title}
            </h2>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-lg border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text hover:border-ember-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-4 sm:space-y-6">
          
          {/* Tagline & Metric Banner */}
          <div className="p-3 sm:p-3.5 rounded-lg border border-ember-600/30 bg-ember-500/10 flex flex-wrap items-center justify-between gap-2.5">
            <p className="text-xs sm:text-sm font-medium text-text">
              {project.tagline}
            </p>
            {project.metric && (
              <span className="font-mono text-[11px] sm:text-xs px-2.5 py-0.5 sm:py-1 rounded bg-ember-600 text-white font-bold tracking-tight shadow-sm">
                {project.metric}
              </span>
            )}
          </div>

          {/* Thesis Section */}
          <div>
            <h3 className="font-mono text-xs text-ember-600 dark:text-ember-500 uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-1.5 sm:mb-2">
              <Cpu className="w-3.5 h-3.5" />
              Core Problem &amp; System Thesis
            </h3>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              {project.blueprint.thesis}
            </p>
          </div>

          {/* Architecture Pipeline Flow */}
          <div>
            <h3 className="font-mono text-xs text-ember-600 dark:text-ember-500 uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-1.5 sm:mb-2">
              <Layers className="w-3.5 h-3.5" />
              Dataflow Pipeline Architecture
            </h3>
            <div className="p-3 sm:p-3.5 rounded-lg border border-border bg-bg-sunken font-mono text-[11px] sm:text-xs text-text-muted overflow-x-auto leading-relaxed whitespace-pre-wrap">
              {project.blueprint.pipeline}
            </div>
          </div>

          {/* Technical Highlights */}
          <div>
            <h3 className="font-mono text-xs text-ember-600 dark:text-ember-500 uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-1.5 sm:mb-2">
              <CheckCircle className="w-3.5 h-3.5" />
              Key Technical Highlights
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {project.blueprint.highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-text-muted">
                  <span className="text-ember-600 font-mono mt-0.5">&gt;</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack Breakdown */}
          <div>
            <h3 className="font-mono text-xs text-text-muted uppercase tracking-wider font-semibold mb-1.5 sm:mb-2">
              Stack Specification
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {project.blueprint.stack.split(',').map((tech, i) => (
                <span 
                  key={i} 
                  className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded border border-border bg-surface font-mono text-[11px] sm:text-xs text-text"
                >
                  {tech.trim()}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Bottom Footer / Links */}
        <div className="p-3 sm:p-5 border-t border-border bg-surface flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {project.pypiUrl && (
              <a
                href={project.pypiUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                className="px-2.5 py-1.5 sm:px-3 rounded-md border border-ember-600/50 bg-ember-500/10 font-mono text-xs text-ember-600 dark:text-ember-400 font-semibold hover:bg-ember-500/20 transition-colors flex items-center gap-1.5"
              >
                <span>PyPI Package</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {project.npmUrl && (
              <a
                href={project.npmUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                className="px-2.5 py-1.5 sm:px-3 rounded-md border border-ember-600/50 bg-ember-500/10 font-mono text-xs text-ember-600 dark:text-ember-400 font-semibold hover:bg-ember-500/20 transition-colors flex items-center gap-1.5"
              >
                <span>npm Package</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                className="px-2.5 py-1.5 sm:px-3 rounded-md border border-border bg-surface font-mono text-xs text-text hover:border-ember-600 transition-colors flex items-center gap-1.5"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Source</span>
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                className="px-2.5 py-1.5 sm:px-3 rounded-md border border-border bg-surface font-mono text-xs text-text hover:border-ember-600 transition-colors flex items-center gap-1.5"
              >
                <span>Live System</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {project.docsUrl && project.docsUrl !== project.liveUrl && (
              <a
                href={project.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                className="px-2.5 py-1.5 sm:px-3 rounded-md border border-border bg-surface font-mono text-xs text-text-muted hover:text-text transition-colors flex items-center gap-1"
              >
                <span>Docs</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-full sm:w-auto px-4 py-2 sm:py-1.5 text-center rounded-md border border-border bg-surface hover:bg-surface-elevated font-mono text-xs text-text-muted hover:text-text transition-colors"
          >
            Close Esc
          </button>
        </div>
      </div>
    </div>
  );
};
