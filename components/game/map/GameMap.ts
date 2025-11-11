import { GameMapConfig, Cell, MapSize } from './types';
import type { Enemy } from '../enemy/Enemy';
import type { EnemySpawnConfig } from '../enemy/types';
import { GAME_CONSTANTS } from '../GameConstants';

export class GameMap {
  private config: GameMapConfig;
  private cells: Cell[][];
  private scale: number = 1.0;

  constructor(config: GameMapConfig) {
    this.config = config;
    this.cells = this.initializeCells();
  }

  private initializeCells(): Cell[][] {
    const cells: Cell[][] = [];
    
    for (let y = 0; y < this.config.height; y++) {
      cells[y] = [];
      for (let x = 0; x < this.config.width; x++) {
        cells[y][x] = {
          x,
          y,
          type: 'empty',
          value: Math.floor(Math.random() * 100) + 1
        };
      }
    }

    return cells;
  }

  getConfig(): GameMapConfig {
    return this.config;
  }

  getCells(): Cell[][] {
    return this.cells;
  }

  getCell(x: number, y: number): Cell | null {
    if (x >= 0 && x < this.config.width && y >= 0 && y < this.config.height) {
      return this.cells[y][x];
    }
    return null;
  }

  setCellType(x: number, y: number, type: Cell['type']): void {
    if (x >= 0 && x < this.config.width && y >= 0 && y < this.config.height) {
      this.cells[y][x].type = type;
    }
  }

  setCellValue(x: number, y: number, value: number): void {
    if (x >= 0 && x < this.config.width && y >= 0 && y < this.config.height) {
      this.cells[y][x].value = value;
    }
  }

  setScale(scale: number): void {
    this.scale = Math.max(0.1, Math.min(5.0, scale));
  }

  getScale(): number {
    return this.scale;
  }

  calculateMapLayout(canvasWidth: number, canvasHeight: number): MapSize {
    const cellWidth = GAME_CONSTANTS.MAP.GRID.CELL_SIZE;
    const cellHeight = GAME_CONSTANTS.MAP.GRID.CELL_SIZE;
    
    const mapWidth = this.config.width * cellWidth;
    const mapHeight = this.config.height * cellHeight;
    
    const mapStartX = -mapWidth / 2;
    const mapStartY = -mapHeight / 2;

    return {
      cellWidth: cellWidth,
      cellHeight: cellHeight,
      mapWidth: mapWidth,
      mapHeight: mapHeight,
      mapStartX: mapStartX,
      mapStartY: mapStartY
    };
  }

  getCellType(cell: Cell): Cell['type'] {
    return cell.type;
  }

  spawnEnemies(config: EnemySpawnConfig, enemyName?: string, count?: number): Enemy[] {
    if (!this.config.enemyGenerator) {
      console.warn('No enemy generator configured for this map');
      return [];
    }
    
    return this.config.enemyGenerator.generateEnemies(this, config, enemyName, count);
  }

  reset(): void {
    this.cells = this.initializeCells();
    this.scale = 1.0;
  }
} 