import { Enemy } from './Enemy';
import type { EnemyType } from './types';
import { GAME_CONSTANTS } from '../GameConstants';
import { ProjectileFactory } from '../skill/ballistic/ProjectileFactory';

export class EnemyManager {
  private enemies: Enemy[] = [];
  private player: any = null;
  private lastDamageTime: Map<Enemy, number> = new Map();
  private lastShootTime: Map<Enemy, number> = new Map();
  private damageCooldown: number = 1000;
  private projectileManager: any = null;

  constructor() {
  }

  setPlayer(player: any): void {
    this.player = player;
  }

  setProjectileManager(projectileManager: any): void {
    this.projectileManager = projectileManager;
  }

  addEnemies(enemies: Enemy[]): void {
    this.enemies.push(...enemies);
    console.log(`EnemyManager: Added ${enemies.length} enemies. Total: ${this.enemies.length}`);
  }

  addEnemy(enemy: Enemy): void {
    this.enemies.push(enemy);
  }

  update(playerGridX: number, playerGridY: number, deltaTime?: number): void {
    this.enemies = this.enemies.filter(enemy => enemy.isAlive);
    
    this.enemies.forEach(enemy => {
      enemy.update(playerGridX, playerGridY, deltaTime);
    });

    this.checkPlayerCollisions();
    
    this.checkEnemyShooting(playerGridX, playerGridY);
  }

  private checkEnemyShooting(playerGridX: number, playerGridY: number): void {
    if (!this.player || !this.projectileManager) return;

    const currentTime = Date.now();

    this.enemies.forEach(enemy => {
      if (!enemy.isAlive) return;

      const projectileConfig = enemy.getProjectileConfig();
      
      if (!projectileConfig.enabled) return;

      const enemyGridPos = enemy.getGridPosition();
      const dx = playerGridX - enemyGridPos.x;
      const dy = playerGridY - enemyGridPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const shootRange = projectileConfig.range || 0.67;
      if (distance > shootRange) return;

      const lastShoot = this.lastShootTime.get(enemy) || 0;
      if (currentTime - lastShoot < projectileConfig.fireRate) return;

      this.shootProjectile(enemy, playerGridX, playerGridY, projectileConfig);
      
      this.lastShootTime.set(enemy, currentTime);
    });
  }

  private shootProjectile(enemy: Enemy, playerGridX: number, playerGridY: number, projectileConfig: any): void {
    const enemyGridPos = enemy.getGridPosition();
    
    const dx = playerGridX - enemyGridPos.x;
    const dy = playerGridY - enemyGridPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance === 0) return;
    
    const directionX = dx / distance;
    const directionY = dy / distance;

    const getTarget = () => {
      if (!this.player) return null;
      const playerGridPos = this.player.getGridPosition();
      return {
        gridX: playerGridPos.x,
        gridY: playerGridPos.y
      };
    };

    try {
      const builder = ProjectileFactory.createBuilderByType(
        projectileConfig.projectileType,
        getTarget,
        this.projectileManager,
        'enemy'
      );

      builder.setDamage(projectileConfig.damage);

      const projectile = builder.buildProjectile(
        { x: enemyGridPos.x, y: enemyGridPos.y },
        { x: directionX, y: directionY }
      );

      projectile.updateVirtualPosition(GAME_CONSTANTS.MAP.GRID.CELL_SIZE);
      projectile.updateVelocity(GAME_CONSTANTS.MAP.GRID.CELL_SIZE);

      this.projectileManager.addProjectile(projectile);

      console.log(`🎯 敌人射击！类型: ${enemy.getEnemyType()}, 子弹类型: ${projectileConfig.projectileType}, 伤害: ${projectileConfig.damage}`);

    } catch (error) {
      console.error('发射子弹失败:', error);
    }
  }

  private checkPlayerCollisions(): void {
    if (!this.player) return;

    const playerGridPos = this.player.getGridPosition();
    const currentTime = Date.now();

    this.enemies.forEach(enemy => {
      if (!enemy.isAlive) return;

      const enemyGridPos = enemy.getGridPosition();
      const dx = enemyGridPos.x - playerGridPos.x;
      const dy = enemyGridPos.y - playerGridPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const collisionDistance = 0.5;
      
      if (distance <= collisionDistance) {
        const lastDamage = this.lastDamageTime.get(enemy) || 0;
        if (currentTime - lastDamage >= this.damageCooldown) {
          const damage = enemy.getDamage();
          const isPlayerDead = this.player.takeDamage(damage);
          
          console.log(`💥 敌人碰撞玩家！敌人类型: ${enemy.getEnemyType()}, 伤害: ${damage}, 玩家死亡: ${isPlayerDead}`);
          
          this.lastDamageTime.set(enemy, currentTime);
          
          this.playPlayerHurtSound();
        }
      }
    });
  }

  private playPlayerHurtSound(): void {
    import('../sound/soundEffects/soundManager').then(({ playPlayerHurt }) => {
      playPlayerHurt();
    }).catch(error => {
      console.warn('无法播放玩家受伤音效:', error);
    });
  }

  draw(p: any, centerX: number, centerY: number, mapOffset: { x: number; y: number }): void {
    this.enemies.forEach(enemy => {
      const enemyGridPos = enemy.getGridPosition();
      const enemyScreenX = centerX + (enemyGridPos.x * GAME_CONSTANTS.MAP.GRID.CELL_SIZE + mapOffset.x);
      const enemyScreenY = centerY + (enemyGridPos.y * GAME_CONSTANTS.MAP.GRID.CELL_SIZE + mapOffset.y);
      enemy.draw(p, enemyScreenX, enemyScreenY);
    });
  }

  getEnemies(): Enemy[] {
    return this.enemies.filter(enemy => enemy.isAlive);
  }

  getEnemyAt(gridX: number, gridY: number): Enemy | null {
    return this.enemies.find(enemy => {
      if (!enemy.isAlive) return false;
      const enemyGridPos = enemy.getGridPosition();
      const dx = enemyGridPos.x - gridX;
      const dy = enemyGridPos.y - gridY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < 0.25;
    }) || null;
  }

  removeEnemy(enemy: Enemy): void {
    const index = this.enemies.indexOf(enemy);
    if (index > -1) {
      this.enemies.splice(index, 1);
    }
    this.lastDamageTime.delete(enemy);
    this.lastShootTime.delete(enemy);
  }

  clearEnemies(): void {
    this.enemies = [];
    this.lastDamageTime.clear();
    this.lastShootTime.clear();
  }

  getEnemyCount(): number {
    return this.enemies.filter(enemy => enemy.isAlive).length;
  }

  hasEnemiesInRange(gridX: number, gridY: number, gridRange: number): boolean {
    return this.enemies.some(enemy => {
      if (!enemy.isAlive) return false;
      const enemyGridPos = enemy.getGridPosition();
      const dx = enemyGridPos.x - gridX;
      const dy = enemyGridPos.y - gridY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance <= gridRange;
    });
  }
} 