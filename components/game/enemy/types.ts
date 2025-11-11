import type { ShapeFormula } from '../player/formulas';
import type { EnemyBehavior } from './behaviors';
import type { ProjectileType } from '../skill/ballistic/types';

export interface EnemyProjectileConfig {
  enabled: boolean;
  projectileType: ProjectileType;
  fireRate: number;
  damage: number;
  range?: number;
}

export interface EnemyConfig {
  size: number;
  strokeColor: number;
  strokeWeight: number;
  shape: ShapeFormula;
  angle?: number;
  x?: number;
  y?: number;
  maxHealth: number;
  currentHealth: number;
  speed: number;
  damage: number;
  enemyType: EnemyType;
  behavior: EnemyBehavior;
  projectileConfig: EnemyProjectileConfig;
}

export type EnemyType = 'basic' | 'fast' | 'tank' | 'boss' | 'idle';

export interface EnemyStats {
  maxHealth: number;
  speed: number;
  damage: number;
  size: number;
  strokeColor: number;
  strokeWeight: number;
  projectileConfig: EnemyProjectileConfig;
}

export interface EnemySpawnConfig {
  count: number;
  minDistance?: number;
  maxDistance?: number;
} 