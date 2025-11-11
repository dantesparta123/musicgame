import type p5 from 'p5';
import type { ProjectileConfig, ProjectileState, Effect, ProjectileOwner, RGBColor } from './types';
import type { ProjectileBehavior } from './behaviors/ProjectileBehavior';
import { playExplosion } from '../../sound/soundEffects/soundManager';
import { GAME_CONSTANTS } from '../../GameConstants';

export class Projectile {
  public readonly damage: number;
  public readonly speed: number;
  public readonly size: number;
  public readonly color: RGBColor;
  public readonly strokeWeight: number;
  public readonly shape: any;
  public readonly range: number;
  public readonly effects: Effect[];
  public readonly hitEffect?: (x: number, y: number, cellSize?: number) => any | null;
  public readonly owner: ProjectileOwner;

  public gridX: number;
  public gridY: number;
  public virtualX: number;
  public virtualY: number;
  public velocity: { x: number; y: number };
  public direction: { x: number; y: number };
  public distanceTraveled: number = 0;
  public gridDistanceTraveled: number = 0;
  public isActive: boolean = true;
  public angle: number = 0;

  private behavior: ProjectileBehavior;
  private onHitHandler?: (projectile: Projectile, target: any) => void;
  public projectileManager?: any;

  constructor(
    config: ProjectileConfig,
    startPosition: { x: number; y: number },
    direction: { x: number; y: number },
    behavior: ProjectileBehavior,
    onHitHandler?: (projectile: Projectile, target: any) => void,
    projectileManager?: any
  ) {
    this.damage = config.damage;
    this.speed = config.speed;
    this.size = config.size;
    this.color = config.color;
    this.strokeWeight = config.strokeWeight;
    this.shape = config.shape;
    this.range = config.range;
    this.effects = config.effects;
    this.hitEffect = config.hitEffect;
    this.owner = config.owner;

    this.gridX = startPosition.x;
    this.gridY = startPosition.y;
    this.virtualX = 0;
    this.virtualY = 0;
    this.direction = { ...direction };
    this.velocity = {
      x: this.direction.x * this.speed,
      y: this.direction.y * this.speed
    };

    this.angle = Math.atan2(this.direction.y, this.direction.x) + Math.PI/2;

    this.behavior = behavior;
    this.onHitHandler = onHitHandler;
    this.projectileManager = projectileManager;
  }

  updateVirtualPosition(cellSize: number = 50): void {
    this.virtualX = this.gridX * cellSize;
    this.virtualY = this.gridY * cellSize;
  }

  updateVelocity(cellSize: number = 80): void {
    const scaleFactor = cellSize / 80;
    const dynamicSpeed = this.speed * scaleFactor;
    this.velocity.x = this.direction.x * dynamicSpeed;
    this.velocity.y = this.direction.y * dynamicSpeed;
  }

  getGridPosition(): { x: number; y: number } {
    return { x: this.gridX, y: this.gridY };
  }

  setGridPosition(x: number, y: number): void {
    this.gridX = x;
    this.gridY = y;
  }

  update(deltaTime: number = 1, cellSize: number = 80): void {
    if (!this.isActive) return;

    this.behavior.update(this, deltaTime, cellSize);

    const gridDistance = Math.sqrt(
      (this.direction.x * this.speed * deltaTime) ** 2 +
      (this.direction.y * this.speed * deltaTime) ** 2
    );
    this.gridDistanceTraveled += gridDistance;
    
    const pixelDistance = gridDistance * cellSize;
    this.distanceTraveled += pixelDistance;

    if (this.gridDistanceTraveled >= this.range) {
      this.destroy();
    }
  }

  draw(p: p5, screenX?: number, screenY?: number, cellSize?: number): void {
    if (!this.isActive) return;
  
    const scaleFactor = cellSize ? cellSize / 80 : GAME_CONSTANTS.MAP.GRID.CELL_SIZE / 80;
    const dynamicSize = this.size * scaleFactor;
    const dynamicStrokeWeight = this.strokeWeight * scaleFactor;
  
    let drawColor: RGBColor = this.color;
  
    p.stroke(drawColor.r, drawColor.g, drawColor.b);
    p.strokeWeight(dynamicStrokeWeight);
    p.noFill();
    
    const points = this.shape(dynamicSize, this.angle);

    const segments = 20;
    const curveLength = segments + 1;
  
    for (let start = 0; start < points.length; start += curveLength) {
      p.beginShape();
      for (let i = 0; i < curveLength && start + i < points.length; i++) {
        const pt = points[start + i];
        p.vertex(pt.x, pt.y);
      }
      p.endShape();
    }
  }
  

  checkCollision(enemies: any[], cellSize?: number): any | null {
    if (!this.isActive) return null;

    if (this.owner !== 'player') return null;

    const scaleFactor = cellSize ? cellSize / 80 : GAME_CONSTANTS.MAP.GRID.CELL_SIZE / 80;
    const dynamicSize = this.size * scaleFactor;

    for (const enemy of enemies) {
      const dx = this.virtualX - enemy.virtualX;
      const dy = this.virtualY - enemy.virtualY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < (dynamicSize + enemy.getSize(cellSize)) / 2) {
        return enemy;
      }
    }
    
    return null;
  }

  onHit(target: any): void {
    if (this.onHitHandler) {
      this.onHitHandler(this, target);
      return;
    }
    if (target.takeDamage) {
      target.takeDamage(this.damage);
    }

    this.effects.forEach(effect => {
      effect.apply(target);
    });

    playExplosion();

    this.destroy();
  }

  destroy(): void {
    this.isActive = false;
  }

  getState(): ProjectileState {
    return {
      position: { x: this.virtualX, y: this.virtualY },
      velocity: { ...this.velocity },
      direction: { ...this.direction },
      distanceTraveled: this.distanceTraveled,
      gridDistanceTraveled: this.gridDistanceTraveled,
      isActive: this.isActive,
      owner: this.owner
    };
  }

  setPosition(x: number, y: number): void {
    this.gridX = x;
    this.gridY = y;
  }

  setVirtualPosition(x: number, y: number): void {
    this.virtualX = x;
    this.virtualY = y;
  }

  setVelocity(x: number, y: number): void {
    this.velocity.x = x;
    this.velocity.y = y;
  }

  setDirection(x: number, y: number): void {
    this.direction.x = x;
    this.direction.y = y;
  }

  getSize(cellSize?: number): number {
    const scaleFactor = cellSize ? cellSize / 80 : GAME_CONSTANTS.MAP.GRID.CELL_SIZE / 80;
    return this.size * scaleFactor;
  }

  getDamage(): number {
    return this.damage;
  }

  getRange(cellSize?: number): number {
    return this.range;
  }

  getOwner(): ProjectileOwner {
    return this.owner;
  }
  get x(): number {
    return this.virtualX;
  }

  get y(): number {
    return this.virtualY;
  }

  set x(value: number) {
    this.virtualX = value;
  }

  set y(value: number) {
    this.virtualY = value;
  }
} 