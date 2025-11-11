'use client';

import React from 'react';
import { PlayerService } from '../services/PlayerService';
import { UnlockableMusicPlayerFactory } from '../factories/UnlockableMusicPlayerFactory';
import { PlayerInfo } from '../types/PlayerTypes';

interface PlayerInfoPanelProps {
  currentPlayer: PlayerInfo | null;
  userName?: string;
  completedSubtopics?: { id: string; title: string }[];
  onClose: () => void;
  onPlayerUpdate: (player: PlayerInfo | null) => void;
}

export default function PlayerInfoPanel({ 
  currentPlayer, 
  userName,
  completedSubtopics,
  onClose, 
  onPlayerUpdate 
}: PlayerInfoPanelProps) {
  const playerService = PlayerService.getInstance();
  const unlockablePlayer = UnlockableMusicPlayerFactory.createPlayerForCurrentUser();
  const playerConfig = unlockablePlayer.getConfig();
  const availableFeatures = unlockablePlayer.getAvailableFeatures();
  const upgradeInfo = UnlockableMusicPlayerFactory.getUpgradeInfo();

  const resetPlayer = () => {
    playerService.resetPlayerData();
    onPlayerUpdate(null);
  };

  return (
    <div className="mb-1 bg-black/80 backdrop-blur-sm rounded-md p-2 shadow-lg border border-gray-700 min-w-[180px]">
      <div className="flex items-center justify-between text-white text-xs mb-1">
        <div className="select-none">
          <h3 className="font-semibold">👤 {userName || currentPlayer?.name || 'No player created'}</h3>
          <div className="text-gray-400 text-xs mt-1">Try completing content in the music topic to unlock more features</div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white select-none"
          title="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
} 