import { EnemyGenerator } from './EnemyGenerator';
import { EnemyFactory } from '../../enemy/EnemyFactory';
import type { Enemy } from '../../enemy/Enemy';
import type { GameMap } from '../GameMap';
import type { EnemySpawnConfig } from '../../enemy/types';
import type { EnemyType } from '../../enemy/types';

export class RandomEnemyGenerator implements EnemyGenerator {
  generateEnemies(map: GameMap, config: EnemySpawnConfig, enemyName?: string, count?: number): Enemy[] {
    const enemies: Enemy[] = [];
    const mapConfig = map.getConfig();
    
    const enemyCount = count !== undefined ? count : config.count;
    
    const mapWidth = mapConfig.width * mapConfig.cellSize;
    const mapHeight = mapConfig.height * mapConfig.cellSize;
    const halfWidth = mapWidth / 2;
    const halfHeight = mapHeight / 2;
    
    console.log(`RandomEnemyGenerator: Map config - width: ${mapConfig.width}, height: ${mapConfig.height}, base cell size: ${mapConfig.cellSize}`);
    console.log(`RandomEnemyGenerator: Virtual coordinate range: (${-halfWidth}, ${-halfHeight}) to (${halfWidth}, ${halfHeight})`);
    
    for (let i = 0; i < enemyCount; i++) {
      const x = Math.floor(Math.random() * mapConfig.width);
      const y = Math.floor(Math.random() * mapConfig.height);
      
      const cell = map.getCell(x, y);
      if (cell && cell.type === 'empty') {
        const offsetX = Math.random() * mapConfig.cellSize * 0.6;
        const offsetY = Math.random() * mapConfig.cellSize * 0.6;
        
        const virtualX = (x * mapConfig.cellSize + offsetX) - halfWidth;
        const virtualY = (y * mapConfig.cellSize + offsetY) - halfHeight;
        
        const maxX = halfWidth - 20;
        const maxY = halfHeight - 20;
        
        const clampedX = Math.max(-maxX, Math.min(maxX, virtualX));
        const clampedY = Math.max(-maxY, Math.min(maxY, virtualY));
        
        let enemy: Enemy;
        
        if (enemyName) {
          const enemyType = enemyName.toLowerCase() as EnemyType;
          enemy = EnemyFactory.createEnemy(enemyType, clampedX, clampedY);
          console.log(`RandomEnemyGenerator: Spawned ${enemyName} enemy at map position (${x}, ${y}), virtual position (${clampedX.toFixed(1)}, ${clampedY.toFixed(1)})`);
        } else {
          enemy = EnemyFactory.randomEnemy(clampedX, clampedY);
          console.log(`RandomEnemyGenerator: Spawned random enemy at map position (${x}, ${y}), virtual position (${clampedX.toFixed(1)}, ${clampedY.toFixed(1)})`);
        }
        
        enemies.push(enemy);
      }
    }
    
    return enemies;
  }
  
  getName(): string {
    return 'random';
  }
} 