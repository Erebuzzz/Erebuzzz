import React from 'react';
import { LaborsHUD } from '../components/LaborsHUD';
import { PantheonGrid } from '../components/PantheonGrid';
import { GithubContributionCalendar } from '../components/GithubContributionCalendar';
import { TerminalHUD } from '../components/TerminalHUD';

interface PantheonPageProps {
  unlockedBadges: Record<string, boolean>;
  onSelectProject: (id: string) => void;
  onOpenTerminalCmd: (cmd: string) => void;
  onUnlockBadge: (id: string, label: string) => void;
  terminalPrefill: string | null;
  onClearPrefill: () => void;
  theme?: 'dark' | 'light';
}

export const PantheonPage: React.FC<PantheonPageProps> = ({
  unlockedBadges,
  onSelectProject,
  onOpenTerminalCmd,
  onUnlockBadge,
  terminalPrefill,
  onClearPrefill,
  theme = 'dark'
}) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      {/* The Labors of Autonomy HUD */}
      <LaborsHUD
        unlocked={unlockedBadges}
        onSelectProject={onSelectProject}
        onOpenTerminalCmd={onOpenTerminalCmd}
        onUnlockBadge={onUnlockBadge}
      />

      {/* GitHub Contribution Chronicle & Telemetry Matrix */}
      <GithubContributionCalendar theme={theme} />

      {/* Pantheon Constellation Matrix */}
      <PantheonGrid
        onSelectProject={onSelectProject}
        onUnlockBadge={onUnlockBadge}
      />

      {/* Horizon Terminal Telemetry Diagnostic Shell */}
      <TerminalHUD
        onSelectProject={onSelectProject}
        onUnlockBadge={onUnlockBadge}
        prefillCmd={terminalPrefill}
        onClearPrefill={onClearPrefill}
      />

    </div>
  );
};
