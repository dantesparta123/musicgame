import { ProjectileBuilder } from './ProjectileBuilder';
import { 
  circleProjectile, 
  squareProjectile, 
  triangleProjectile,
  arrowProjectile
} from './formulas';
import { HomingBehavior } from './behaviors/HomingBehavior';
import { HitEffect, HitEffect2, HitEffect3 } from './HitEffects';
import { playExplosion, playExplosion2, playShoot } from '../../sound/soundEffects/soundManager';
import type { RGBColor } from './types';

export class ProjectileFactory {
  static createEnemyBulletBuilder(): ProjectileBuilder {
    const builder = new ProjectileBuilder()
      .setDamage(15)
      .setSpeed(2)
      .setSize(8)
      .setColor({ r: 255, g: 0, b: 0 })
      .setStrokeWeight(2)
      .setShape(circleProjectile)
      .setRange(3)
      .setOwner('enemy')
      .setOnHit((projectile, target) => {
        if (target.takeDamage) target.takeDamage(projectile.damage);
        projectile.effects.forEach(effect => effect.apply(target));
        playExplosion2();
        projectile.destroy();
      })
      .setOnShoot(() => playShoot());
    return builder;
  }

  static createBulletBuilder(projectileManager?: any): ProjectileBuilder {
    const builder = new ProjectileBuilder()
      .setDamage(25)
      .setSpeed(5)
      .setSize(10)
      .setColor({ r: 0, g: 0, b: 0 })
      .setStrokeWeight(3)
      .setShape(circleProjectile)
      .setRange(4)
      .setOwner('player')
      .setHitEffect((x, y, cellSize) => new HitEffect(x, y, 20, cellSize))
      .setOnHit((projectile, target) => {
        const aoeRange = 0.5;
        const aoeDamage = projectile.damage;
        
        if (target.takeDamage) target.takeDamage(aoeDamage);
        projectile.effects.forEach(effect => effect.apply(target));
        
        if (projectile.projectileManager) {
          const hitEnemies = projectile.projectileManager.getEnemiesInRange(projectile.gridX, projectile.gridY, aoeRange);
          
          console.log('AOE enemies in range:', hitEnemies.length);
          
          hitEnemies.forEach((enemy: any) => {
            if (enemy !== target && enemy.takeDamage) {
              const enemyGridPos = enemy.getGridPosition();
              console.log('AOE damage to enemy:', {
                enemyGridPos,
                distance: Math.sqrt(
                  Math.pow(enemyGridPos.x - projectile.gridX, 2) + 
                  Math.pow(enemyGridPos.y - projectile.gridY, 2)
                )
              });
              enemy.takeDamage(aoeDamage);
              projectile.effects.forEach(effect => effect.apply(enemy));
            }
          });
        } else {
          console.warn('projectileManager not set, AOE cannot work');
        }
        
        playExplosion2();
        projectile.destroy();
      })
      .setOnShoot(() => playShoot());
    
    if (projectileManager) {
      builder.setProjectileManager(projectileManager);
    }
    
    return builder;
  }

  static createFireballBuilder(): ProjectileBuilder {
    const builder = new ProjectileBuilder()
      .setDamage(40)
      .setSpeed(6)
      .setSize(12)
      .setColor({ r: 255, g: 165, b: 0 })
      .setStrokeWeight(3)
      .setShape(squareProjectile)
      .setRange(0.83)
      .setOwner('player')
      .setOnHit((projectile, target) => {
        if (target.takeDamage) target.takeDamage(projectile.damage);
        projectile.effects.forEach(effect => effect.apply(target));
        playExplosion2();
        projectile.destroy();
      })
      .setOnShoot(() => playShoot());
    return builder;
  }

  static createArrowBuilder(): ProjectileBuilder {
    const builder = new ProjectileBuilder()
      .setDamage(30)
      .setSpeed(10)
      .setSize(8)
      .setColor({ r: 0, g: 0, b: 0 }) 
      .setStrokeWeight(2)
      .setShape(triangleProjectile)
      .setRange(1.33)
      .setOwner('player')
      .setOnHit((projectile, target) => {
        if (target.takeDamage) target.takeDamage(projectile.damage);
        projectile.effects.forEach(effect => effect.apply(target));
        playExplosion2();
        projectile.destroy();
      })
      .setOnShoot(() => playShoot());
    return builder;
  }

  static createArrowBulletBuilder(getTarget: () => { gridX: number; gridY: number } | null): ProjectileBuilder {
    const builder = new ProjectileBuilder()
      .setDamage(45)
      .setSpeed(3)
      .setSize(12)
      .setColor({ r: 0, g: 0, b: 0 })
      .setStrokeWeight(2)
      .setShape(arrowProjectile)
      .setRange(4)
      .setOwner('player')
      .setBehavior(new HomingBehavior(getTarget, 10, 0)) 
      .setHitEffect((x, y, cellSize) => new HitEffect3(x, y, 20, cellSize))
      .setOnHit((projectile, target) => {
        if (target.takeDamage) target.takeDamage(projectile.damage);
        projectile.effects.forEach(effect => effect.apply(target));
        playExplosion();
        projectile.destroy();
      })
      .setOnShoot(() => playShoot());
    return builder;
  }

  static createMissileBuilder(getTarget: () => { gridX: number; gridY: number } | null): ProjectileBuilder {
    const builder = new ProjectileBuilder()
      .setDamage(50)
      .setSpeed(3)
      .setSize(8)
      .setColor({ r: 255, g: 0, b: 0 })
      .setStrokeWeight(3)
      .setShape(circleProjectile)
      .setRange(3.0)
      .setOwner('enemy')
      .setBehavior(new HomingBehavior(getTarget, 0.4, 0.2))
      .setHitEffect((x, y, cellSize) => new HitEffect2(x, y, 25, cellSize))
      .setOnHit((projectile, target) => {
        if (target.takeDamage) target.takeDamage(projectile.damage);
        projectile.effects.forEach(effect => effect.apply(target));
        playExplosion();
        projectile.destroy();
      })
      .setOnShoot(() => playShoot());
    return builder;
  }

  static createLaserBuilder(): ProjectileBuilder {
    const builder = new ProjectileBuilder()
      .setDamage(20)
      .setSpeed(12)
      .setSize(6)
      .setColor({ r: 0, g: 0, b: 0 })
      .setStrokeWeight(2)
      .setShape(triangleProjectile)
      .setRange(1.17)
      .setOwner('enemy')
      .setOnHit((projectile, target) => {
        if (target.takeDamage) target.takeDamage(projectile.damage);
        projectile.effects.forEach(effect => effect.apply(target));
        playExplosion2();
        projectile.destroy();
      })
      .setOnShoot(() => playShoot());
    return builder;
  }

  static createBuilderByType(
    type: string, 
    getTarget?: () => { gridX: number; gridY: number } | null,
    projectileManager?: any,
    owner: 'player' | 'enemy' = 'player'
  ): ProjectileBuilder {
    let builder: ProjectileBuilder;
    
    switch (type) {
      case 'bullet':
        if (owner === 'enemy') {
          builder = this.createEnemyBulletBuilder();
        } else {
          builder = this.createBulletBuilder(projectileManager);
        }
        break;
      case 'enemyBullet':
        builder = this.createEnemyBulletBuilder();
        break;
      case 'fireball':
        builder = this.createFireballBuilder();
        break;
      case 'arrow':
        builder = this.createArrowBuilder();
        break;
      case 'missile':
        builder = getTarget ? this.createMissileBuilder(getTarget) : this.createEnemyBulletBuilder();
        break;
      case 'laser':
        builder = this.createLaserBuilder();
        break;
      default:
        if (owner === 'enemy') {
          builder = this.createEnemyBulletBuilder();
        } else {
          builder = this.createBulletBuilder(projectileManager);
        }
        break;
    }
    
    builder.setOwner(owner);
    
    return builder;
  }
} 