import type { ShapeFormula } from '../../player/formulas';

export type ProjectileOwner = 'player' | 'enemy';

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface ProjectileConfig {
  damage: number;
  speed: number;
  size: number;
  color: RGBColor;
  strokeWeight: number;
  shape: ShapeFormula;
  range: number;
  effects: Effect[];
  hitEffect?: (x: number, y: number, cellSize?: number) => any | null;
  owner: ProjectileOwner;
}

export type ProjectileType = 'bullet' | 'enemyBullet' | 'fireball' | 'laser' | 'arrow' | 'missile';

export type BehaviorType = 'straight' | 'homing' | 'bouncing' | 'spiral' | 'arc';

export interface Effect {
  name: string;
  duration?: number;
  apply(target: any): void;
  remove(target: any): void;
  update(target: any): void;
}

export interface ProjectileState {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  direction: { x: number; y: number };
  distanceTraveled: number;
  gridDistanceTraveled: number;
  isActive: boolean;
  owner: ProjectileOwner;
}

export interface ProjectileBehavior {
  update(projectile: any, deltaTime: number): void;
  getName(): string;
}

export interface ProjectileBuilderConfig {
  damage?: number;
  speed?: number;
  size?: number;
  color?: RGBColor;
  strokeWeight?: number;
  shape?: ShapeFormula;
  range?: number;
  effects?: Effect[];
  hitEffect?: (x: number, y: number, cellSize?: number) => any | null;
  owner?: ProjectileOwner;
} 