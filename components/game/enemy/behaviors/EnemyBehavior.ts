import type { Enemy } from '../Enemy';

export interface EnemyBehavior {
  update(enemy: Enemy, playerGridX: number, playerGridY: number, deltaTime?: number): void;
  getName(): string;
} 