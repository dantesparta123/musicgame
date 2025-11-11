import type p5 from 'p5';
import type { EnemyConfig } from './types';
import { worldToScreen } from '../tools';
import { GAME_CONSTANTS } from '../GameConstants';

export class Enemy {
  private config: EnemyConfig;
  private gridX: number;
  private gridY: number;
  public virtualX: number = 0;
  public virtualY: number = 0;
  public isAlive: boolean = true;

  constructor(config: EnemyConfig) {
    this.config = config;
    
    const x = config.x || 0;
    const y = config.y || 0;
    
    if (Math.abs(x) <= 5 && Math.abs(y) <= 5) {
      this.gridX = x;
      this.gridY = y;
    } else {
      this.gridX = x / GAME_CONSTANTS.MAP.GRID.CELL_SIZE;
      this.gridY = y / GAME_CONSTANTS.MAP.GRID.CELL_SIZE;
    }
    this.updateVirtualPosition();
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

  getGridPosition(): { x: number; y: number } {
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

  takeDamage(damage: number): boolean {
    this.config.currentHealth = Math.max(0, this.config.currentHealth - damage);
    if (this.config.currentHealth <= 0) {
      this.isAlive = false;
      return true;
    }
    return false;
  }

  heal(amount: number): void {
    this.config.currentHealth = Math.min(this.config.maxHealth, this.config.currentHealth + amount);
  }

  getHealthPercentage(): number {
    return this.config.currentHealth / this.config.maxHealth;
  }

  getEnemyType(): string {
    return this.config.enemyType;
  }

  getSpeed(): number {
    return this.config.speed ?? 2;
  }

  getDamage(): number {
    return this.config.damage;
  }

  getProjectileConfig() {
    return this.config.projectileConfig;
  }

  getSize(cellSize?: number): number {
    const scaleFactor = cellSize ? cellSize / 80 : GAME_CONSTANTS.MAP.GRID.CELL_SIZE / 80;
    return this.config.size * scaleFactor;
  }

  update(playerX: number, playerY: number, deltaTime?: number): void {
    const dt = deltaTime ?? (1 / 60);
    this.config.behavior.update(this, playerX, playerY, dt);
  }

  getBehaviorName(): string {
    return this.config.behavior.getName();
  }

  draw(p: p5, screenX: number, screenY: number) {
    if (!this.isAlive) return;

    const scaleFactor = GAME_CONSTANTS.MAP.GRID.CELL_SIZE / 80;
    const scaledSize = this.config.size * scaleFactor;
    const scaledStrokeWeight = this.config.strokeWeight * scaleFactor;
    
    const points = this.config.shape(scaledSize, this.config.angle || 0);
    
    p.push();
    p.translate(screenX, screenY);

    p.stroke(this.config.strokeColor);
    p.strokeWeight(scaledStrokeWeight);
    p.noFill();
    p.beginShape();
    for (const pt of points) {
      p.vertex(pt.x, pt.y);
    }
    p.endShape();
    
    this.drawHealthBar(p, scaledSize);
    
    p.pop();
  }

  private drawHealthBar(p: p5, scaledSize?: number) {
    const size = scaledSize || this.config.size;
    const barWidth = size * 1.5;
    const scaleFactor = GAME_CONSTANTS.MAP.GRID.CELL_SIZE / 80;
    const barHeight = 4 * scaleFactor;
    const barY = -size / 2 - 10 * scaleFactor;
    
    p.fill(0, 0, 0, 30);
    p.noStroke();
    p.rect(-barWidth / 2, barY, barWidth, barHeight);
    
    p.stroke(0, 0, 0);
    p.strokeWeight(1 * scaleFactor);
    p.noFill();
    p.rect(-barWidth / 2, barY, barWidth, barHeight);
    
    const healthPercentage = this.getHealthPercentage();
    const currentBarWidth = barWidth * healthPercentage;
    
    let healthColor: { r: number; g: number; b: number };
    if (healthPercentage > 0.6) {
      healthColor = { r: 70, g: 130, b: 180 };
    } else if (healthPercentage > 0.3) {
      healthColor = { r: 180, g: 120, b: 70 };
    } else {
      healthColor = { r: 180, g: 70, b: 70 };
    }
    
    p.fill(healthColor.r, healthColor.g, healthColor.b, 200);
    p.noStroke();
    p.rect(-barWidth / 2, barY, currentBarWidth, barHeight);
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

  get health(): number {
    return this.config.currentHealth;
  }

  get maxHealth(): number {
    return this.config.maxHealth;
  }
} 