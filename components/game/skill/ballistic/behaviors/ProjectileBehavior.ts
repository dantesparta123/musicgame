import type { Projectile } from '../Projectile';

export interface ProjectileBehavior {
  update(projectile: Projectile, deltaTime: number, cellSize?: number): void;
  getName(): string;
} 