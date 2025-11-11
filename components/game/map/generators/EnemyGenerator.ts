import type { Enemy } from '../../enemy/Enemy';
import type { GameMap } from '../GameMap';
import type { EnemySpawnConfig } from '../../enemy/types';

export interface EnemyGenerator {
  generateEnemies(map: GameMap, config: EnemySpawnConfig, enemyName?: string, count?: number): Enemy[];
  getName(): string;
} 