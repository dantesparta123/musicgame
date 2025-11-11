import type p5 from 'p5';
import { Projectile } from './Projectile';
import type { ProjectileBehavior } from './behaviors/ProjectileBehavior';
import { HitEffect, HitEffect2, HitEffect3 } from './HitEffects';

export class ProjectileManager {
  private projectiles: Projectile[] = [];
  private enemies: any[] = [];
  private player: any = null;
  private hitEffects: (HitEffect | HitEffect2 | HitEffect3)[] = [];

  addProjectile(projectile: Projectile): void {
    this.projectiles.push(projectile);
  }

  setEnemies(enemies: any[]): void {
    this.enemies = enemies;
  }

  setPlayer(player: any): void {
    this.player = player;
  }

  updateVirtualPositions(cellSize: number): void {
    this.projectiles.forEach(projectile => {
      projectile.updateVirtualPosition(cellSize);
      projectile.updateVelocity(cellSize);
    });
  }

  update(deltaTime: number = 1, cellSize: number = 80): void {
    this.projectiles.forEach(projectile => {
      projectile.update(deltaTime, cellSize);
    });

    this.checkCollisions(cellSize);

    this.hitEffects.forEach(effect => {
      if (effect instanceof HitEffect3) {
        effect.update(deltaTime);
      } else {
        effect.update();
      }
    });
    this.hitEffects = this.hitEffects.filter(effect => !effect.isDone());

    this.cleanup();
  }

  draw(p: p5, centerX: number, centerY: number, mapOffset?: { x: number; y: number }, cellSize?: number): void {
    this.projectiles.forEach(projectile => {
      const projectileScreenX = centerX + (projectile.virtualX + (mapOffset?.x || 0));
      const projectileScreenY = centerY + (projectile.virtualY + (mapOffset?.y || 0));
      
      p.push();
      p.translate(projectileScreenX, projectileScreenY);
      projectile.draw(p, projectileScreenX, projectileScreenY, cellSize);
      p.pop();
    });
    this.hitEffects.forEach(effect => {
      effect.draw(p, (mapOffset?.x || 0) + centerX, (mapOffset?.y || 0) + centerY, cellSize);
    });
  }

  private checkCollisions(cellSize?: number): void {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      
      if (!projectile.isActive) continue;

      const hitEnemy = projectile.checkCollision(this.enemies, cellSize);
      if (hitEnemy) {
        if (projectile.hitEffect) {
          const effect = projectile.hitEffect(projectile.virtualX, projectile.virtualY, cellSize);
          if (effect) this.hitEffects.push(effect);
        } else {
          this.hitEffects.push(new HitEffect(projectile.virtualX, projectile.virtualY, 20, cellSize || 80));
        }
        projectile.onHit(hitEnemy);
        continue;
      }

      if (this.player && projectile.getOwner() === 'enemy' && this.checkPlayerCollision(projectile, cellSize)) {
        const damage = projectile.getDamage();
        const isPlayerDead = this.player.takeDamage(damage);
        
        console.log(`Enemy bullet hit player! Damage: ${damage}, Player dead: ${isPlayerDead}`);
        
        this.playPlayerHurtSound();
        
        this.hitEffects.push(new HitEffect2(projectile.virtualX, projectile.virtualY, 25, cellSize || 80));
        
        projectile.destroy();
      }
    }
  }

  private checkPlayerCollision(projectile: Projectile, cellSize?: number): boolean {
    if (!this.player) return false;

    const playerGridPos = this.player.getGridPosition();
    const projectileGridPos = projectile.getGridPosition();
    
    const dx = projectileGridPos.x - playerGridPos.x;
    const dy = projectileGridPos.y - playerGridPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const collisionDistance = 0.5;
    
    return distance <= collisionDistance;
  }

  private playPlayerHurtSound(): void {
    import('../../sound/soundEffects/soundManager').then(({ playPlayerHurt }) => {
      playPlayerHurt();
    }).catch(error => {
      console.warn('Unable to play player hurt sound:', error);
    });
  }

  private cleanup(): void {
    this.projectiles = this.projectiles.filter(projectile => projectile.isActive);
  }

  getActiveProjectileCount(): number {
    return this.projectiles.filter(p => p.isActive).length;
  }

  getProjectiles(): Projectile[] {
    return [...this.projectiles];
  }

  clearAll(): void {
    this.projectiles.forEach(projectile => projectile.destroy());
    this.cleanup();
  }

  getEnemiesInRange(gridX: number, gridY: number, range: number): any[] {
    console.log('Searching AOE range:', { gridX, gridY, range, totalEnemies: this.enemies.length });
    
    const hitEnemies = this.enemies.filter(enemy => {
      if (!enemy.isAlive) return false;
      const enemyGridPos = enemy.getGridPosition();
      const dx = enemyGridPos.x - gridX;
      const dy = enemyGridPos.y - gridY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      console.log('Checking enemy:', {
        enemyGridPos,
        distance,
        inRange: distance <= range
      });
      
      return distance <= range;
    });
    
    console.log('AOE search result:', { hitEnemies: hitEnemies.length });
    return hitEnemies;
  }

  getStats(): {
    total: number;
    active: number;
    destroyed: number;
  } {
    const total = this.projectiles.length;
    const active = this.getActiveProjectileCount();
    const destroyed = total - active;

    return { total, active, destroyed };
  }
} 