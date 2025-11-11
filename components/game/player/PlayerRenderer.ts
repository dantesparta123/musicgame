import type p5 from 'p5';
import type { ShapeFormula } from './formulas';
import { GAME_CONSTANTS } from '../GameConstants';
import { playPlayerDeath } from '../sound/soundEffects/soundManager';

export interface HealthBarConfig {
  width?: number;
  height?: number;
  showBorder?: boolean;
  showText?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  offsetX?: number;
  offsetY?: number;
}

export interface RenderConfig {
  size: number;
  strokeColor: number;
  strokeWeight: number;
  shape: ShapeFormula;
  angle?: number;
  healthBar?: HealthBarConfig;
  playDeathSound?: boolean;
}

export class PlayerRenderer {
  private config: RenderConfig;
  private healthBarConfig: HealthBarConfig;
  private deathParticles: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    color: number;
  }[] = [];
  private lastDeathTime: number = 0;

  constructor(config: RenderConfig) {
    this.config = config;
    
    this.healthBarConfig = {
      width: 30,
      height: 4,
      showBorder: true,
      showText: false,
      backgroundColor: '#333333',
      borderColor: '#666666',
      textColor: '#ffffff',
      offsetX: 0,
      offsetY: -20,
      ...config.healthBar
    };
  }

  draw(p: p5, centerX: number, centerY: number, screenX: number = 0, screenY: number = 0, healthInfo?: { current: number; max: number; deathAnimationStart?: number; deathAnimationDuration?: number }) {
    const scaleFactor = GAME_CONSTANTS.MAP.GRID.CELL_SIZE / 80;
    const scaledSize = this.config.size * scaleFactor;
    const scaledStrokeWeight = this.config.strokeWeight * scaleFactor;
    
    const points = this.config.shape(scaledSize, this.config.angle || 0);
    p.push();
    p.translate(centerX + screenX, centerY + screenY);
    
    if (healthInfo && healthInfo.deathAnimationStart && healthInfo.deathAnimationDuration) {
      const elapsed = Date.now() - healthInfo.deathAnimationStart;
      const progress = Math.min(1, elapsed / healthInfo.deathAnimationDuration);
      
      if (progress < 0.1 && this.config.playDeathSound && healthInfo.deathAnimationStart !== this.lastDeathTime) {
        this.lastDeathTime = healthInfo.deathAnimationStart;
        console.log('🎵 Playing player death sound');
        playPlayerDeath();
      }
      
      if (progress < 1) {
        this.drawDeathAnimation(p, progress, scaledStrokeWeight, scaleFactor);
      }
    } else {
      p.stroke(this.config.strokeColor);
      p.strokeWeight(scaledStrokeWeight);
      p.noFill();
      p.beginShape();
      for (const pt of points) {
        p.vertex(pt.x, pt.y);
      }
      p.endShape();
    }
    
    p.pop();

    if (healthInfo && healthInfo.current > 0) {
      this.drawHealthBar(p, centerX + screenX, centerY + screenY, healthInfo);
    }
  }

  private drawDeathAnimation(p: p5, progress: number, strokeWeight: number, scaleFactor: number) {
    if (this.deathParticles.length === 0 && progress < 0.1) {
      this.initDeathParticles(scaleFactor);
    }

    const deltaTime = 0.016;
    this.updateDeathParticles(deltaTime);

    this.drawDeathParticles(p, scaleFactor);
  }

  private initDeathParticles(scaleFactor: number) {
    const BASE_PARTICLE_SIZE = 3;
    const MIN_SPEED = 1;
    const MAX_SPEED = 2;
    const MIN_LIFETIME = 0.5;
    const MAX_LIFETIME = 1;
    const GRAVITY = 0;

    this.deathParticles = [];
    const count = 30;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED) * scaleFactor;
      this.deathParticles.push({
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: MIN_LIFETIME + Math.random() * (MAX_LIFETIME - MIN_LIFETIME),
        color: Math.random() < 0.5 ? 0 : 255,
      });
    }
  }

  private updateDeathParticles(deltaTime: number) {
    const GRAVITY = 0;
    
    for (const p of this.deathParticles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += GRAVITY;
      p.life += deltaTime;
    }
    this.deathParticles = this.deathParticles.filter(p => p.life < p.maxLife);
  }

  private drawDeathParticles(p: p5, scaleFactor: number) {
    const BASE_PARTICLE_SIZE = 3;
    const SIZE_DECAY = 1;

    for (const particle of this.deathParticles) {
      const progress = particle.life / particle.maxLife;
      const alpha = 255 * (1 - progress);
      const size = BASE_PARTICLE_SIZE * (1 - progress) * scaleFactor * SIZE_DECAY;
      
      p.push();
      p.noStroke();
      p.fill(particle.color, alpha);
      p.ellipse(particle.x, particle.y, size);
      p.pop();
    }
  }

  resetDeathAnimation(): void {
    this.deathParticles = [];
  }

  updateConfig(config: Partial<RenderConfig>) {
    this.config = { ...this.config, ...config };
  }

  getConfig(): RenderConfig {
    return { ...this.config };
  }

  private drawHealthBar(p: p5, playerX: number, playerY: number, healthInfo: { current: number; max: number }) {
    const config = this.healthBarConfig;
    const healthPercent = Math.max(0, Math.min(1, healthInfo.current / healthInfo.max));
    
    const scaleFactor = GAME_CONSTANTS.MAP.GRID.CELL_SIZE / 80;
    const scaledWidth = config.width! * scaleFactor;
    const scaledHeight = config.height! * scaleFactor;
    const scaledOffsetX = config.offsetX! * scaleFactor;
    const scaledOffsetY = config.offsetY! * scaleFactor;
    
    const barX = playerX + scaledOffsetX - scaledWidth / 2;
    const barY = playerY + scaledOffsetY;

    p.push();

    let healthColor: string;
    if (healthPercent > 0.6) {
      healthColor = '#4ade80';
    } else if (healthPercent > 0.3) {
      healthColor = '#fbbf24';
    } else {
      healthColor = '#f87171';
    }

    p.fill(config.backgroundColor!);
    p.noStroke();
    p.rect(barX, barY, scaledWidth, scaledHeight);

    p.fill(healthColor);
    const healthWidth = scaledWidth * healthPercent;
    p.rect(barX, barY, healthWidth, scaledHeight);

    if (config.showBorder) {
      p.stroke(config.borderColor!);
      p.strokeWeight(Math.max(1, scaleFactor));
      p.noFill();
      p.rect(barX, barY, scaledWidth, scaledHeight);
    }

    if (config.showText) {
      p.fill(config.textColor!);
      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(Math.max(10, scaledHeight - 2 * scaleFactor));
      const textX = barX + scaledWidth / 2;
      const textY = barY + scaledHeight / 2;
      p.text(`${healthInfo.current}/${healthInfo.max}`, textX, textY);
    }

    p.pop();
  }

  setHealthBarConfig(config: Partial<HealthBarConfig>): void {
    this.healthBarConfig = { ...this.healthBarConfig, ...config };
  }

  getHealthBarConfig(): HealthBarConfig {
    return { ...this.healthBarConfig };
  }
} 