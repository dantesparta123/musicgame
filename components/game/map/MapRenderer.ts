import type p5 from 'p5';
import { GameMap } from './GameMap';
import { MapSize } from './types';
import { GAME_CONSTANTS } from '../GameConstants';

export class MapRenderer {
  static renderGridMap(p: p5, map: GameMap, mapSize: MapSize, offset?: { x: number; y: number }): void {
    const cells = map.getCells();
    
    if (mapSize.cellWidth <= 0 || mapSize.cellHeight <= 0) {
      return;
    }
    
    const offsetX = offset?.x || 0;
    const offsetY = offset?.y || 0;
    
    for (let y = 0; y < cells.length; y++) {
      for (let x = 0; x < cells[y].length; x++) {
        const cell = cells[y][x];
        const cellX = mapSize.mapStartX + x * mapSize.cellWidth + offsetX;
        const cellY = mapSize.mapStartY + y * mapSize.cellHeight + offsetY;
        
        const halfWidth = p.width / 2;
        const halfHeight = p.height / 2;
        if (cellX + mapSize.cellWidth < -halfWidth || cellX > halfWidth || 
            cellY + mapSize.cellHeight < -halfHeight || cellY > halfHeight) {
          continue;
        }
        
        const cellColor = MapRenderer.getCellColor(cell.type);
        
        p.fill(cellColor);
        p.noStroke();
        p.rect(cellX, cellY, mapSize.cellWidth, mapSize.cellHeight);
        
        p.stroke(GAME_CONSTANTS.MAP.COLORS.GRID_LINE);
        const scaleFactor = GAME_CONSTANTS.MAP.GRID.CELL_SIZE / 80;
        p.strokeWeight(Math.max(0.5, scaleFactor));
        p.noFill();
        p.rect(cellX, cellY, mapSize.cellWidth, mapSize.cellHeight);
      }
    }
  }



  private static getCellColor(cellType: string): number {
    switch (cellType) {
      case 'wall':
        return GAME_CONSTANTS.MAP.COLORS.WALL;
      case 'spawn':
        return GAME_CONSTANTS.MAP.COLORS.SPAWN;
      case 'goal':
        return GAME_CONSTANTS.MAP.COLORS.GOAL;
      case 'enemy':
        return GAME_CONSTANTS.MAP.COLORS.ENEMY;
      default:
        return GAME_CONSTANTS.MAP.COLORS.EMPTY;
    }
  }
} 