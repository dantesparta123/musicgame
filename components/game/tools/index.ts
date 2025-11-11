import { GAME_CONSTANTS } from '../GameConstants';

export function pixelToGrid(pixelX: number, pixelY: number): { x: number; y: number } {
  return {
    x: pixelX / GAME_CONSTANTS.MAP.GRID.CELL_SIZE,
    y: pixelY / GAME_CONSTANTS.MAP.GRID.CELL_SIZE
  };
}

export function gridToPixel(gridX: number, gridY: number): { x: number; y: number } {
  return {
    x: gridX * GAME_CONSTANTS.MAP.GRID.CELL_SIZE,
    y: gridY * GAME_CONSTANTS.MAP.GRID.CELL_SIZE
  };
}

export function getGridDistance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = (x2 - x1) / GAME_CONSTANTS.MAP.GRID.CELL_SIZE;
  const dy = (y2 - y1) / GAME_CONSTANTS.MAP.GRID.CELL_SIZE;
  return Math.sqrt(dx * dx + dy * dy);
}

export function getPixelDistance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

export * from './MatrixUtils'; 