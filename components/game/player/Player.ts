import type p5 from 'p5';
import { PlayerConfig } from './PlayerConfig';
import { PlayerPosition } from './PlayerPosition';
import { PlayerHealth } from './PlayerHealth';
import { PlayerRenderer } from './PlayerRenderer';

export type { PlayerConfig } from './PlayerConfig';
export { PlayerPosition } from './PlayerPosition';
export { PlayerHealth } from './PlayerHealth';
export { PlayerRenderer } from './PlayerRenderer';

export class Player {
  private config: PlayerConfig;
  public position: PlayerPosition;
  public health: PlayerHealth;
  public renderer: PlayerRenderer;

  constructor(config: PlayerConfig) {
    this.config = config;
    
    this.position = new PlayerPosition(
      config.x || 0,
      config.y || 0,
      config.speed ?? 3
    );
    
    this.health = new PlayerHealth(
      config.maxHealth ?? 100,
      config.currentHealth
    );
    
    this.renderer = new PlayerRenderer({
      size: config.size,
      strokeColor: config.strokeColor,
      strokeWeight: config.strokeWeight,
      shape: config.shape,
      angle: config.angle,
      healthBar: config.healthBar,
      playDeathSound: config.playDeathSound
    });
  }

  move(dirX: number, dirY: number, deltaTime: number) {
    this.position.move(dirX, dirY, deltaTime);
  }

  setVirtualPosition(x: number, y: number) {
    this.position.setVirtualPosition(x, y);
  }

  setGridPosition(gridX: number, gridY: number) {
    this.position.setGridPosition(gridX, gridY);
  }

  setScreenPosition(x: number, y: number) {
    this.position.setScreenPosition(x, y);
  }

  getMapOffset() {
    return this.position.getMapOffset();
  }

  getGridPosition() {
    return this.position.getGridPosition();
  }

  updateVirtualPosition(): void {
    this.position.updateVirtualPosition();
  }

  draw(p: p5, centerX: number, centerY: number) {
    this.renderer.draw(p, centerX, centerY, this.position.screenX, this.position.screenY, {
      current: this.currentHealth,
      max: this.maxHealth,
      deathAnimationStart: this.health.deathAnimationStart,
      deathAnimationDuration: this.health.deathAnimationDuration
    });
  }
  get x(): number {
    return this.position.x;
  }

  get y(): number {
    return this.position.y;
  }

  set x(value: number) {
    this.position.x = value;
  }

  set y(value: number) {
    this.position.y = value;
  }

  get speed(): number {
    return this.position.speed;
  }

  set speed(value: number) {
    this.position.speed = value;
  }

  takeDamage(damage: number): boolean {
    return this.health.takeDamage(damage);
  }

  heal(healAmount: number): number {
    return this.health.heal(healAmount);
  }

  fullHeal(): void {
    this.health.fullHeal();
  }

  revive(healthPercent: number = 0.5): void {
    this.health.revive(healthPercent);
  }

  getHealthPercent(): number {
    return this.health.getHealthPercent();
  }

  setMaxHealth(maxHealth: number): void {
    this.health.setMaxHealth(maxHealth);
  }

  increaseMaxHealth(amount: number): void {
    this.health.increaseMaxHealth(amount);
  }

  getHealthInfo() {
    return this.health.getHealthInfo();
  }

  setHealthBarConfig(config: any): void {
    this.renderer.setHealthBarConfig(config);
  }

  getHealthBarConfig(): any {
    return this.renderer.getHealthBarConfig();
  }

  getDeathAnimationProgress(): number {
    return this.health.getDeathAnimationProgress();
  }

  isPlayingDeathAnimation(): boolean {
    return this.health.isPlayingDeathAnimation();
  }

  resetDeathAnimation(): void {
    this.health.resetDeathAnimation();
    this.renderer.resetDeathAnimation();
  }

  get maxHealth(): number {
    return this.health.maxHealth;
  }

  get currentHealth(): number {
    return this.health.currentHealth;
  }

  get isAlive(): boolean {
    return this.health.isAlive;
  }
}
