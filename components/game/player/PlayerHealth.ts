export interface HealthInfo {
  current: number;
  max: number;
  percent: number;
  isAlive: boolean;
  deathAnimationStart?: number;
  deathAnimationDuration?: number;
}

export class PlayerHealth {
  public maxHealth: number;
  public currentHealth: number;
  public isAlive: boolean = true;
  public deathAnimationStart?: number;
  public deathAnimationDuration: number = 1000;

  constructor(maxHealth: number = 100, currentHealth?: number) {
    this.maxHealth = maxHealth;
    this.currentHealth = currentHealth ?? maxHealth;
    this.isAlive = this.currentHealth > 0;
  }

  takeDamage(damage: number): boolean {
    if (!this.isAlive) return true;
    
    this.currentHealth = Math.max(0, this.currentHealth - damage);
    this.isAlive = this.currentHealth > 0;
    
    console.log(`Player took ${damage} damage, current health: ${this.currentHealth}/${this.maxHealth}`);
    
    if (!this.isAlive) {
      console.log('Player died!');
      this.startDeathAnimation();
    }
    
    return !this.isAlive;
  }

  private startDeathAnimation(): void {
    this.deathAnimationStart = Date.now();
  }

  getDeathAnimationProgress(): number {
    if (!this.deathAnimationStart || this.isAlive) {
      return 0;
    }
    
    const elapsed = Date.now() - this.deathAnimationStart;
    const progress = Math.min(1, elapsed / this.deathAnimationDuration);
    
    return progress;
  }

  isPlayingDeathAnimation(): boolean {
    return !this.isAlive && this.deathAnimationStart !== undefined;
  }

  resetDeathAnimation(): void {
    this.deathAnimationStart = undefined;
  }

  heal(healAmount: number): number {
    const oldHealth = this.currentHealth;
    this.currentHealth = Math.min(this.maxHealth, this.currentHealth + healAmount);
    const actualHeal = this.currentHealth - oldHealth;
    
    if (oldHealth <= 0 && this.currentHealth > 0) {
      this.isAlive = true;
      this.resetDeathAnimation();
    }
    
    console.log(`Player healed ${actualHeal} points, current health: ${this.currentHealth}/${this.maxHealth}`);
    
    return actualHeal;
  }

  fullHeal(): void {
    this.currentHealth = this.maxHealth;
    this.isAlive = true;
    this.resetDeathAnimation();
    console.log(`Player fully healed, current health: ${this.currentHealth}/${this.maxHealth}`);
  }

  revive(healthPercent: number = 0.5): void {
    this.currentHealth = Math.max(1, Math.floor(this.maxHealth * healthPercent));
    this.isAlive = true;
    this.resetDeathAnimation();
    console.log(`Player revived, current health: ${this.currentHealth}/${this.maxHealth}`);
  }

  getHealthPercent(): number {
    return this.currentHealth / this.maxHealth;
  }

  setMaxHealth(maxHealth: number): void {
    this.maxHealth = Math.max(1, maxHealth);
    if (this.currentHealth > this.maxHealth) {
      this.currentHealth = this.maxHealth;
    }
    console.log(`Player max health set to: ${this.maxHealth}`);
  }

  increaseMaxHealth(amount: number): void {
    this.setMaxHealth(this.maxHealth + amount);
  }

  getHealthInfo(): HealthInfo {
    return {
      current: this.currentHealth,
      max: this.maxHealth,
      percent: this.getHealthPercent(),
      isAlive: this.isAlive,
      deathAnimationStart: this.deathAnimationStart,
      deathAnimationDuration: this.deathAnimationDuration
    };
  }
} 