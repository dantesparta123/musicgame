import { Enemy } from './Enemy';
import { squareOutline, diamondOutline } from '../player/formulas';
import { GAME_CONSTANTS } from '../GameConstants';
import type { EnemyType, EnemyStats, EnemyProjectileConfig } from './types';
import { ChaseBehavior, PatrolBehavior, WanderBehavior, IdleBehavior } from './behaviors';

const ENEMY_STATS: Record<EnemyType, EnemyStats> = {
  basic: {
    maxHealth: 50,
    speed: 0.5,
    damage: 10,
    size: 25,
    strokeColor: 0,
    strokeWeight: 2,
    projectileConfig: {
      enabled: true,
      projectileType: 'enemyBullet',
      fireRate: 2000,
      damage: 15,
      range: 3
    }
  },
  fast: {
    maxHealth: 30,
    speed: 1.5,
    damage: 5,
    size: 20,
    strokeColor: 255,
    strokeWeight: 2,
    projectileConfig: {
      enabled: true,
      projectileType: 'arrow',
      fireRate: 1500,
      damage: 10,
      range: 3
    }
  },
  tank: {
    maxHealth: 150,
    speed: 0.5,
    damage: 25,
    size: 35,
    strokeColor: 100,
    strokeWeight: 3,
    projectileConfig: {
      enabled: true,
      projectileType: 'fireball',
      fireRate: 3000,
      damage: 30,
      range: 3
    }
  },
  boss: {
    maxHealth: 300,
    speed: 0.8,
    damage: 40,
    size: 50,
    strokeColor: 255,
    strokeWeight: 4,
    projectileConfig: {
      enabled: true,
      projectileType: 'missile',
      fireRate: 500,
      damage: 50,
      range: 3
    }
  },
  idle: {
    maxHealth: 100,
    speed: 0,
    damage: 0,
    size: 30,
    strokeColor: 128,
    strokeWeight: 2,
    projectileConfig: {
      enabled: true,
      projectileType: 'laser',
      fireRate: 4000,
      damage: 20,
      range: 3
    }
  },
};

export const EnemyFactory = {
  basicEnemy(x?: number, y?: number, angle: number = 0): Enemy {
    const stats = ENEMY_STATS.basic;
    return new Enemy({
      size: stats.size,
      strokeColor: stats.strokeColor,
      strokeWeight: stats.strokeWeight,
      shape: squareOutline,
      angle,
      x,
      y,
      maxHealth: stats.maxHealth,
      currentHealth: stats.maxHealth,
      speed: stats.speed,
      damage: stats.damage,
      enemyType: 'basic',
      behavior: new ChaseBehavior(),
      projectileConfig: stats.projectileConfig,
    });
  },

  fastEnemy(x?: number, y?: number, angle: number = 0): Enemy {
    const stats = ENEMY_STATS.fast;
    return new Enemy({
      size: stats.size,
      strokeColor: stats.strokeColor,
      strokeWeight: stats.strokeWeight,
      shape: diamondOutline,
      angle,
      x,
      y,
      maxHealth: stats.maxHealth,
      currentHealth: stats.maxHealth,
      speed: stats.speed,
      damage: stats.damage,
      enemyType: 'fast',
      behavior: new WanderBehavior(),
      projectileConfig: stats.projectileConfig,
    });
  },

  tankEnemy(x?: number, y?: number, angle: number = 0): Enemy {
    const stats = ENEMY_STATS.tank;
    return new Enemy({
      size: stats.size,
      strokeColor: stats.strokeColor,
      strokeWeight: stats.strokeWeight,
      shape: squareOutline,
      angle,
      x,
      y,
      maxHealth: stats.maxHealth,
      currentHealth: stats.maxHealth,
      speed: stats.speed,
      damage: stats.damage,
      enemyType: 'tank',
      behavior: new PatrolBehavior(),
      projectileConfig: stats.projectileConfig,
    });
  },

  bossEnemy(x?: number, y?: number, angle: number = 0): Enemy {
    const stats = ENEMY_STATS.boss;
    return new Enemy({
      size: stats.size,
      strokeColor: stats.strokeColor,
      strokeWeight: stats.strokeWeight,
      shape: diamondOutline,
      angle,
      x,
      y,
      maxHealth: stats.maxHealth,
      currentHealth: stats.maxHealth,
      speed: stats.speed,
      damage: stats.damage,
      enemyType: 'boss',
      behavior: new ChaseBehavior(), // Boss也使用追击行为
      projectileConfig: stats.projectileConfig,
    });
  },

  idleEnemy(x?: number, y?: number, angle: number = 0): Enemy {
    const stats = ENEMY_STATS.idle;
    return new Enemy({
      size: stats.size,
      strokeColor: stats.strokeColor,
      strokeWeight: stats.strokeWeight,
      shape: squareOutline,
      angle,
      x,
      y,
      maxHealth: stats.maxHealth,
      currentHealth: stats.maxHealth,
      speed: stats.speed,
      damage: stats.damage,
      enemyType: 'idle',
      behavior: new IdleBehavior(),
      projectileConfig: stats.projectileConfig,
    });
  },

  randomEnemy(x?: number, y?: number): Enemy {
    const types: EnemyType[] = ['basic', 'fast', 'tank'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const angle = Math.random() * Math.PI * 2;
    
    switch (randomType) {
      case 'basic':
        return this.basicEnemy(x, y, angle);
      case 'fast':
        return this.fastEnemy(x, y, angle);
      case 'tank':
        return this.tankEnemy(x, y, angle);
      default:
        return this.basicEnemy(x, y, angle);
    }
  },

  createEnemy(type: EnemyType, x?: number, y?: number, angle: number = 0): Enemy {
    switch (type) {
      case 'basic':
        return this.basicEnemy(x, y, angle);
      case 'fast':
        return this.fastEnemy(x, y, angle);
      case 'tank':
        return this.tankEnemy(x, y, angle);
      case 'boss':
        return this.bossEnemy(x, y, angle);
      case 'idle':
        return this.idleEnemy(x, y, angle);
      default:
        return this.basicEnemy(x, y, angle);
    }
  },

  getEnemyStats(type: EnemyType): EnemyStats {
    return ENEMY_STATS[type];
  },

  createCustomEnemy(
    baseType: EnemyType,
    customProjectileConfig?: Partial<EnemyProjectileConfig>,
    x?: number,
    y?: number,
    angle: number = 0
  ): Enemy {
    const stats = ENEMY_STATS[baseType];
    const projectileConfig = {
      ...stats.projectileConfig,
      ...customProjectileConfig
    };

    return new Enemy({
      size: stats.size,
      strokeColor: stats.strokeColor,
      strokeWeight: stats.strokeWeight,
      shape: baseType === 'fast' || baseType === 'boss' ? diamondOutline : squareOutline,
      angle,
      x,
      y,
      maxHealth: stats.maxHealth,
      currentHealth: stats.maxHealth,
      speed: stats.speed,
      damage: stats.damage,
      enemyType: baseType,
      behavior: this.getBehaviorForType(baseType),
      projectileConfig,
    });
  },

  getBehaviorForType(type: EnemyType) {
    switch (type) {
      case 'basic':
      case 'boss':
        return new ChaseBehavior();
      case 'fast':
        return new WanderBehavior();
      case 'tank':
        return new PatrolBehavior();
      case 'idle':
        return new IdleBehavior();
      default:
        return new ChaseBehavior();
    }
  },
}; 