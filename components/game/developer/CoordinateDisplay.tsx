import React from 'react';
import { MapCoordinates } from '../map/types';

interface CoordinateDisplayProps {
  isVisible: boolean;
  coordinates: MapCoordinates | null;
}

const CoordinateDisplay: React.FC<CoordinateDisplayProps> = ({
  isVisible,
  coordinates
}) => {
  if (!isVisible || !coordinates) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-4 rounded-lg font-mono text-sm z-50 border border-gray-600">
      <div className="font-bold text-green-400 mb-2">Click Coordinate Info</div>
      <div className="space-y-1">
        <div>
          <span className="text-blue-400">World Coordinates:</span>
          <span className="ml-2">
            ({coordinates.worldX.toFixed(1)}, {coordinates.worldY.toFixed(1)})
          </span>
        </div>
        <div>
          <span className="text-gray-400">Screen Coordinates:</span>
          <span className="ml-2">
            ({coordinates.screenX}, {coordinates.screenY})
          </span>
        </div>
      </div>
      <div className="text-xs text-gray-400 mt-2">
        Click anywhere on the map to view coordinates
      </div>
    </div>
  );
};

export default CoordinateDisplay; 