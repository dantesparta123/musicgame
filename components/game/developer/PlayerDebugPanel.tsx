import React from 'react';
import { GAME_CONSTANTS } from '../GameConstants';

interface PlayerDebugPanelProps {
  isVisible: boolean;
  playerVirtualX: number;
  playerVirtualY: number;
  playerScreenX: number;
  playerScreenY: number;
  currentBulletType: 'bullet' | 'arrow';
}

const PlayerDebugPanel: React.FC<PlayerDebugPanelProps> = ({
  isVisible,
  playerVirtualX,
  playerVirtualY,
  playerScreenX,
  playerScreenY,
  currentBulletType
}) => {
  if (!isVisible) return null;


  const gridX = playerVirtualX / GAME_CONSTANTS.MAP.GRID.CELL_SIZE;
  const gridY = playerVirtualY / GAME_CONSTANTS.MAP.GRID.CELL_SIZE;

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg font-mono text-sm z-[9999] border border-gray-600">
      <div className="font-bold text-green-400 mb-2">Debug Info</div>
      <div className="space-y-1">
        <div>
          <span className="text-cyan-400">Grid Position:</span>
          <span className="ml-2">
            ({gridX.toFixed(2)}, {(-gridY).toFixed(2)})
          </span>
        </div>
        <div>
          <span className="text-blue-400">Pixel Position:</span>
          <span className="ml-2">
            ({playerVirtualX.toFixed(2)}, {(-playerVirtualY).toFixed(2)})
          </span>
        </div>
        <div>
          <span className="text-yellow-400">Screen Position:</span>
          <span className="ml-2">
            ({playerScreenX.toFixed(1)}, {playerScreenY.toFixed(1)})
          </span>
        </div>
        <div>
          <span className="text-purple-400">Cell Size:</span>
          <span className="ml-2">
            {GAME_CONSTANTS.MAP.GRID.CELL_SIZE}px
          </span>
        </div>
      </div>
      
      <div className="border-t border-gray-600 pt-2 mt-2">
        <span className="text-purple-400">Current Bullet:</span>
        <span className="ml-2">
          {currentBulletType === 'bullet' ? 'Circle Bullet' : 'Arrow Bullet'}
        </span>
      </div>
      
      <div className="text-xs text-gray-400 mt-2">
        Press 1 for Circle Bullet | Press 2 for Arrow Bullet
      </div>
      
      <div className="border-t border-gray-600 pt-2 mt-2">
        <span className="text-cyan-400">Enemy Spawn Shortcuts:</span>
        <div className="text-xs text-gray-400 mt-1">
          Press 3 for Basic Enemy | Press 4 for Idle Enemy
        </div>
        <div className="text-xs text-gray-400">
          Press 5 for Tank Enemy | Press 6 for Boss Enemy
        </div>
      </div>
      
      <div className="text-xs text-gray-400 mt-2">
        Press 'O' to toggle
      </div>
    </div>
  );
};

export default PlayerDebugPanel; 