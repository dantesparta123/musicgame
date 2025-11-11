import type { EnemyGenerator } from './generators';

export interface GameMapConfig {
  width: number;
  height: number;
  cellSize: number;
  enemyGenerator?: EnemyGenerator;
}

export interface Cell {
  x: number;
  y: number;
  type: 'empty' | 'wall' | 'spawn' | 'goal' | 'enemy';
  value?: number;
}

export interface MapSize {
  cellWidth: number;
  cellHeight: number;
  mapWidth: number;
  mapHeight: number;
  mapStartX: number;
  mapStartY: number;
}

export interface MapCoordinates {
  worldX: number;
  worldY: number;
  screenX: number;
  screenY: number;
} 