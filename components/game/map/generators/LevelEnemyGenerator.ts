import { EnemyGenerator } from './EnemyGenerator';
import { EnemyFactory } from '../../enemy/EnemyFactory';
import type { Enemy } from '../../enemy/Enemy';
import type { GameMap } from '../GameMap';
import type { EnemySpawnConfig } from '../../enemy/types';

export interface LevelEnemyConfig {
  basicCount: number;
  fastCount: number;
  tankCount: number;
  bossCount: number;
}

export class LevelEnemyGenerator implements EnemyGenerator {
  private levelConfig: LevelEnemyConfig;

  constructor(levelConfig: LevelEnemyConfig) {
    this.levelConfig = levelConfig;
  }

  generateEnemies(map: GameMap, config: EnemySpawnConfig, enemyName?: string, count?: number): Enemy[] {
    const enemies: Enemy[] = [];
    const mapConfig = map.getConfig();
    
    const mapWidth = mapConfig.width * mapConfig.cellSize;
    const mapHeight = mapConfig.height * mapConfig.cellSize;
    const halfWidth = mapWidth / 2;
    const halfHeight = mapHeight / 2;
    
    console.log(`LevelEnemyGenerator: Virtual coordinate range: (${-halfWidth}, ${-halfHeight}) to (${halfWidth}, ${halfHeight})`);
    
    this.generateEnemyType(enemies, map, mapConfig, halfWidth, halfHeight, 'basic', this.levelConfig.basicCount);
    this.generateEnemyType(enemies, map, mapConfig, halfWidth, halfHeight, 'fast', this.levelConfig.fastCount);
    this.generateEnemyType(enemies, map, mapConfig, halfWidth, halfHeight, 'tank', this.levelConfig.tankCount);
    this.generateEnemyType(enemies, map, mapConfig, halfWidth, halfHeight, 'boss', this.levelConfig.bossCount);
    
    return enemies;
  }

  private generateEnemyType(
    enemies: Enemy[], 
    map: GameMap, 
    mapConfig: any, 
    halfWidth: number,
    halfHeight: number,
    type: string, 
    count: number
  ): void {
    for (let i = 0; i < count; i++) {
      const position = this.findValidPosition(map, mapConfig, halfWidth, halfHeight);
      if (position) {
        const enemy = EnemyFactory.createEnemy(type as any, position.x, position.y);
        enemies.push(enemy);
        console.log(`LevelEnemyGenerator: Spawned ${type} enemy at (${position.x.toFixed(1)}, ${position.y.toFixed(1)})`);
      }
    }
  }

  private findValidPosition(map: GameMap, mapConfig: any, halfWidth: number, halfHeight: number): { x: number; y: number } | null {
    const maxAttempts = 50;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
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
        
        return { x: clampedX, y: clampedY };
      }
    }
    
    return null;
  }
  
  getName(): string {
    return 'level';
  }
} 