import { EnemyGenerator } from './EnemyGenerator';
import { EnemyFactory } from '../../enemy/EnemyFactory';
import type { Enemy } from '../../enemy/Enemy';
import type { GameMap } from '../GameMap';
import type { EnemySpawnConfig } from '../../enemy/types';
import type { EnemyType } from '../../enemy/types';

export class SimpleEnemyGenerator implements EnemyGenerator {
  generateEnemies(map: GameMap, config: EnemySpawnConfig, enemyName?: string, count?: number): Enemy[] {
    const enemies: Enemy[] = [];
    const mapConfig = map.getConfig();
    
    const enemyCount = count !== undefined ? count : config.count;
    
    if (enemyName) {
      for (let i = 0; i < enemyCount; i++) {
        const position = this.findValidPosition(map, mapConfig);
        if (position) {
          const enemyType = enemyName.toLowerCase() as EnemyType;
          const enemy = EnemyFactory.createEnemy(enemyType, position.x, position.y);
          enemies.push(enemy);
          console.log(`SimpleEnemyGenerator: Spawned ${enemyName} enemy at grid (${position.x.toFixed(1)}, ${position.y.toFixed(1)})`);
        }
      }
    } else {
      for (let i = 0; i < enemyCount; i++) {
        const position = this.findValidPosition(map, mapConfig);
        if (position) {
          const enemy = EnemyFactory.randomEnemy(position.x, position.y);
          enemies.push(enemy);
          console.log(`SimpleEnemyGenerator: Spawned random enemy at grid (${position.x.toFixed(1)}, ${position.y.toFixed(1)})`);
        }
      }
    }
    
    return enemies;
  }

  private findValidPosition(map: GameMap, mapConfig: any): { x: number; y: number } | null {
    const maxAttempts = 50;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const gridX = (Math.random() - 0.5) * mapConfig.width;
      const gridY = (Math.random() - 0.5) * mapConfig.height;
      
      if (this.isValidPosition(gridX, gridY, mapConfig)) {
        console.log(`SimpleEnemyGenerator: Found valid position at (${gridX.toFixed(2)}, ${gridY.toFixed(2)}) on attempt ${attempt + 1}`);
        return { x: gridX, y: gridY };
      }
      
      if (attempt < 5) {
        console.log(`SimpleEnemyGenerator: Attempt ${attempt + 1} - Generated (${gridX.toFixed(2)}, ${gridY.toFixed(2)}) - Valid: ${this.isValidPosition(gridX, gridY, mapConfig)}`);
      }
    }
    
    console.log(`SimpleEnemyGenerator: Failed to find valid position after ${maxAttempts} attempts`);
    return null;
  }

  private isValidPosition(x: number, y: number, mapConfig: any): boolean {
    const halfWidth = mapConfig.width / 2;
    const halfHeight = mapConfig.height / 2;
    
    return Math.abs(x) <= halfWidth && Math.abs(y) <= halfHeight;
  }
  
  getName(): string {
    return 'simple';
  }
} 