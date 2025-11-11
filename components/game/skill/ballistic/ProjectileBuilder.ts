import type { ProjectileConfig, ProjectileBuilderConfig, Effect, ProjectileOwner, RGBColor } from './types';
import { defaultProjectile } from './formulas';
import type { ProjectileBehavior } from './behaviors/ProjectileBehavior';
import { StraightBehavior } from './behaviors/StraightBehavior';
import { Projectile } from './Projectile';

export class ProjectileBuilder {
  private config: Partial<ProjectileConfig> = {
    damage: 25,
    speed: 8,
    size: 5,
    color: { r: 0, g: 0, b: 0 },
    strokeWeight: 2,
    shape: defaultProjectile,
    range: 1.0,
    effects: [],
    hitEffect: undefined,
    owner: 'player'
  };
  private behavior: ProjectileBehavior = new StraightBehavior();
  private onHitHandler?: (projectile: Projectile, target: any) => void;
  private onShootHandler?: (projectile: Projectile) => void;
  private projectileManager?: any;

  setDamage(damage: number): ProjectileBuilder {
    this.config.damage = damage;
    return this;
  }

  setSpeed(speed: number): ProjectileBuilder {
    this.config.speed = speed;
    return this;
  }

  setSize(size: number): ProjectileBuilder {
    this.config.size = size;
    return this;
  }

  setColor(color: RGBColor): ProjectileBuilder {
    this.config.color = color;
    return this;
  }

  setGrayColor(gray: number): ProjectileBuilder {
    this.config.color = { r: gray, g: gray, b: gray };
    return this;
  }

  setStrokeWeight(strokeWeight: number): ProjectileBuilder {
    this.config.strokeWeight = strokeWeight;
    return this;
  }

  setShape(shape: any): ProjectileBuilder {
    this.config.shape = shape;
    return this;
  }

  setRange(range: number): ProjectileBuilder {
    this.config.range = range;
    return this;
  }

  setOwner(owner: ProjectileOwner): ProjectileBuilder {
    this.config.owner = owner;
    return this;
  }

  addEffect(effect: Effect): ProjectileBuilder {
    if (!this.config.effects) {
      this.config.effects = [];
    }
    this.config.effects.push(effect);
    return this;
  }

  addEffects(effects: Effect[]): ProjectileBuilder {
    if (!this.config.effects) {
      this.config.effects = [];
    }
    this.config.effects.push(...effects);
    return this;
  }

  setEffects(effects: Effect[]): ProjectileBuilder {
    this.config.effects = effects;
    return this;
  }

  clearEffects(): ProjectileBuilder {
    this.config.effects = [];
    return this;
  }

  setHitEffect(hitEffect: (x: number, y: number, cellSize?: number) => any | null): ProjectileBuilder {
    this.config.hitEffect = hitEffect;
    return this;
  }

  applyConfig(config: ProjectileBuilderConfig): ProjectileBuilder {
    if (config.damage !== undefined) this.config.damage = config.damage;
    if (config.speed !== undefined) this.config.speed = config.speed;
    if (config.size !== undefined) this.config.size = config.size;
    if (config.color !== undefined) this.config.color = config.color;
    if (config.strokeWeight !== undefined) this.config.strokeWeight = config.strokeWeight;
    if (config.shape !== undefined) this.config.shape = config.shape;
    if (config.range !== undefined) this.config.range = config.range;
    if (config.effects !== undefined) this.config.effects = config.effects;
    if (config.hitEffect !== undefined) this.config.hitEffect = config.hitEffect;
    if (config.owner !== undefined) this.config.owner = config.owner;
    return this;
  }

  reset(): ProjectileBuilder {
    this.config = {
      damage: 25,
      speed: 8,
      size: 5,
      color: { r: 0, g: 0, b: 0 },
      strokeWeight: 2,
      shape: defaultProjectile,
      range: 1.0,
      effects: [],
      hitEffect: undefined,
      owner: 'player'
    };
    return this;
  }

  build(): ProjectileConfig {
    if (this.config.damage === undefined) throw new Error('Damage is required');
    if (this.config.speed === undefined) throw new Error('Speed is required');
    if (this.config.size === undefined) throw new Error('Size is required');
    if (this.config.color === undefined) throw new Error('Color is required');
    if (this.config.strokeWeight === undefined) throw new Error('StrokeWeight is required');
    if (this.config.shape === undefined) throw new Error('Shape is required');
    if (this.config.range === undefined) throw new Error('Range is required');
    if (this.config.effects === undefined) this.config.effects = [];
    if (this.config.owner === undefined) this.config.owner = 'player';

    return this.config as ProjectileConfig;
  }

  getConfig(): Partial<ProjectileConfig> {
    return { ...this.config };
  }

  setBehavior(behavior: ProjectileBehavior): ProjectileBuilder {
    this.behavior = behavior;
    return this;
  }

  getBehavior(): ProjectileBehavior {
    return this.behavior;
  }

  setOnHit(onHit: (projectile: Projectile, target: any) => void): ProjectileBuilder {
    this.onHitHandler = onHit;
    return this;
  }

  setOnShoot(onShoot: (projectile: Projectile) => void): ProjectileBuilder {
    this.onShootHandler = onShoot;
    return this;
  }

  setProjectileManager(projectileManager: any): ProjectileBuilder {
    this.projectileManager = projectileManager;
    return this;
  }

  buildProjectile(startPosition: { x: number; y: number }, direction: { x: number; y: number }): Projectile {
    const config = this.build();
    const projectile = new Projectile(config, startPosition, direction, this.behavior, this.onHitHandler, this.projectileManager);
    if (this.onShootHandler) {
      this.onShootHandler(projectile);
    }
    return projectile;
  }
} 