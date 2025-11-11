import { GAME_CONSTANTS } from '../GameConstants';

export interface Position {
  x: number;
  y: number;
}

export class PlayerPosition {
  private gridX: number;
  private gridY: number;
  public virtualX: number = 0;
  public virtualY: number = 0;
  public screenX: number = 0;
  public screenY: number = 0;
  public speed: number;

  constructor(x: number = 0, y: number = 0, speed: number = 3) {
    this.gridX = x / GAME_CONSTANTS.MAP.GRID.CELL_SIZE;
    this.gridY = y / GAME_CONSTANTS.MAP.GRID.CELL_SIZE;
    this.speed = speed;
    this.updateVirtualPosition();
  }

  move(dirX: number, dirY: number, deltaTime: number) {
    const moveGrid = this.speed * deltaTime;
    this.gridX += dirX * moveGrid;
    this.gridY += dirY * moveGrid;
    this.updateVirtualPosition();
    this.screenX = 0;
    this.screenY = 0;
  }

  setVirtualPosition(x: number, y: number) {
    this.virtualX = x;
    this.virtualY = y;
    this.updateGridPosition();
  }

  setGridPosition(gridX: number, gridY: number) {
    this.gridX = gridX;
    this.gridY = gridY;
    this.updateVirtualPosition();
  }

  setScreenPosition(x: number, y: number) {
    this.screenX = x;
    this.screenY = y;
  }

  getMapOffset(): Position {
    return {
      x: -this.virtualX,
      y: -this.virtualY
    };
  }

  getGridPosition(): Position {
    return {
      x: this.gridX,
      y: this.gridY
    };
  }

  updateVirtualPosition(): void {
    this.virtualX = this.gridX * GAME_CONSTANTS.MAP.GRID.CELL_SIZE;
    this.virtualY = this.gridY * GAME_CONSTANTS.MAP.GRID.CELL_SIZE;
  }

  private updateGridPosition(): void {
    this.gridX = this.virtualX / GAME_CONSTANTS.MAP.GRID.CELL_SIZE;
    this.gridY = this.virtualY / GAME_CONSTANTS.MAP.GRID.CELL_SIZE;
  }
  get x(): number {
    return this.virtualX;
  }

  get y(): number {
    return this.virtualY;
  }

  set x(value: number) {
    this.virtualX = value;
    this.updateGridPosition();
  }

  set y(value: number) {
    this.virtualY = value;
    this.updateGridPosition();
  }
} 