import React from 'react';
import { soundManager } from '../utils/audio';

interface LaborsHUDProps {
  unlocked: Record<string, boolean>;
  onSelectProject: (id: string) => void;
  onOpenTerminalCmd: (cmd: string) => void;
  onUnlockBadge: (id: string, label: string) => void;
}

export const LaborsHUD: React.FC<LaborsHUDProps> = ({
  unlocked,
  onSelectProject,
  onOpenTerminalCmd,
  onUnlockBadge
}) => {
  const count = Object.keys(unlocked).length;

  const badges = [
    {
      id: 'cartographer',
      num: '01',
      title: 'Cartographer',
      desc: 'Tune Astrolabe',
      action: () => {
        onUnlockBadge('cartographer', 'Celestial Cartographer: Tuned Horizon Astrolabe');
      }
    },
    {
      id: 'argo',
      num: '02',
      title: 'Argo Helmsman',
      desc: 'LQR-MPC 4.7ms',
      action: () => {
        onSelectProject('lqrmpc');
        onUnlockBadge('argo', 'Argo Helmsman: Inspected 4.7ms LQR-MPC Stack');
      }
    },
    {
      id: 'aegis',
      num: '03',
      title: 'Aegis Warden',
      desc: 'CodeShield AST',
      action: () => {
        onSelectProject('codeshield');
        onUnlockBadge('aegis', 'Aegis Warden: Inspected AST Taint Graphs');
      }
    },
    {
      id: 'hermes',
      num: '04',
      title: 'Hermes Post',
      desc: 'SynCine WebRTC',
      action: () => {
        onSelectProject('syncine');
        onUnlockBadge('hermes', 'Hermes Dispatcher: Verified WebRTC Mesh');
      }
    },
    {
      id: 'delphi',
      num: '05',
      title: 'Delphic Oracle',
      desc: 'Quant Routine',
      action: () => {
        onOpenTerminalCmd('quant');
        onUnlockBadge('delphi', 'Delphic Initiate: Tested Quant Telemetry');
      }
    },
    {
      id: 'hephaestus',
      num: '06',
      title: 'Hephaestus',
      desc: 'Mirage Engine',
      action: () => {
        onSelectProject('mirage');
        onUnlockBadge('hephaestus', 'Hephaestus Apprentice: Analyzed Mirage Multi-Agent Framework');
      }
    }
  ];

  return (
    <div className="liquid-glass-card p-4 sm:p-5 mt-6 border-dashed" id="labors">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div className="font-mono text-xs text-ember-600 dark:text-ember-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
          <span>&#9876;</span> The Labors of Autonomy
        </div>
        <div className="font-mono text-xs text-text-muted">
          <span className="text-ember-600 dark:text-ember-400 font-bold">{count}</span> / 6 Unlocked
        </div>
      </div>

      <p className="text-xs text-text-muted mt-2 mb-3">
        Interact with the workstation, explore system blueprints, or run terminal routines to earn mythic telemetry badges.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
        {badges.map((b) => {
          const isUnlocked = !!unlocked[b.id];
          return (
            <button
              key={b.id}
              onClick={() => {
                soundManager.playClick();
                b.action();
              }}
              className={`p-2.5 rounded-lg border text-left flex flex-col gap-1 transition-all duration-200 particle-trigger ${
                isUnlocked
                  ? 'border-ember-600 bg-ember-500/10 shadow-[0_0_12px_rgba(234,88,12,0.18)] opacity-100'
                  : 'border-border bg-surface hover:border-ember-600/50 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="font-mono text-[10px] text-ember-600 dark:text-ember-400">
                [{b.num}] {isUnlocked ? '&#10003;' : '&#9675;'}
              </div>
              <div className="font-display font-semibold text-xs text-text truncate">
                {b.title}
              </div>
              <div className="font-mono text-[10px] text-text-muted truncate">
                {b.desc}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
