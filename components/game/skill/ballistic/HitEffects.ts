import type p5 from 'p5';

export class HitEffect {
  x: number;
  y: number;
  frame: number;
  maxFrames: number;
  private cellSize: number;

  constructor(x: number, y: number, maxFrames = 20, cellSize = 80) {
    this.x = x;
    this.y = y;
    this.frame = 0;
    this.maxFrames = maxFrames;
    this.cellSize = cellSize;
  }

  update() {
    this.frame++;
  }

  isDone() {
    return this.frame >= this.maxFrames;
  }

  draw(p: p5, offsetX: number, offsetY: number, cellSize?: number) {
    const progress = this.frame / this.maxFrames;
    const scaleFactor = (cellSize || this.cellSize) / 80;
    
    p.push();
    p.noFill();
    p.stroke(255, 255 * (1 - progress), 0, 255 * (1 - progress));
    p.strokeWeight((2 + 6 * (1 - progress)) * scaleFactor);
    p.ellipse(this.x + offsetX, this.y + offsetY, (30 + 40 * progress) * scaleFactor);
    p.pop();
  }
}

export class HitEffect2 {
  x: number;
  y: number;
  frame: number;
  maxFrames: number;
  private cellSize: number;

  constructor(x: number, y: number, maxFrames = 24, cellSize = 80) {
    this.x = x;
    this.y = y;
    this.frame = 0;
    this.maxFrames = maxFrames;
    this.cellSize = cellSize;
  }

  update() {
    this.frame++;
  }

  isDone() {
    return this.frame >= this.maxFrames;
  }

  draw(p: p5, offsetX: number, offsetY: number, cellSize?: number) {
    const progress = this.frame / this.maxFrames;
    const scaleFactor = (cellSize || this.cellSize) / 80;
    const alpha = 255 * (1 - progress);
    const radius = (20 + 60 * progress) * scaleFactor;
    
    p.push();
    p.noFill();
    p.stroke(0, 200, 255, alpha);
    p.strokeWeight((3 + 2 * (1 - progress)) * scaleFactor);
    p.ellipse(this.x + offsetX, this.y + offsetY, radius);
    p.stroke(255, alpha * 0.7);
    p.ellipse(this.x + offsetX, this.y + offsetY, radius * 0.6);
    p.pop();
  }
} 

export class HitEffect3 {
  private static readonly BASE_PARTICLE_SIZE = 3;
  private static readonly MIN_SPEED = 1;
  private static readonly MAX_SPEED = 2;
  private static readonly MIN_LIFETIME = 0.5;
  private static readonly MAX_LIFETIME = 1;
  private static readonly GRAVITY = 0;
  private static readonly SIZE_DECAY = 1;

  private particles: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    color: number;
  }[];
  private cellSize: number;

  constructor(x: number, y: number, count = 20, cellSize = 80) {
    this.particles = [];
    this.cellSize = cellSize;
    const scaleFactor = cellSize / 80;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * (HitEffect3.MAX_SPEED - HitEffect3.MIN_SPEED) + HitEffect3.MIN_SPEED) * scaleFactor;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: HitEffect3.MIN_LIFETIME + Math.random() * (HitEffect3.MAX_LIFETIME - HitEffect3.MIN_LIFETIME),
        color: Math.random() < 0.5 ? 0 : 255,
      });
    }
  }

  update(deltaTime: number) {
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += HitEffect3.GRAVITY;
      p.life += deltaTime;
    }
    this.particles = this.particles.filter(p => p.life < p.maxLife);
  }

  isDone() {
    return this.particles.length === 0;
  }

  draw(p: p5, offsetX: number, offsetY: number, cellSize?: number) {
    const scaleFactor = (cellSize || this.cellSize) / 80;
    for (const particle of this.particles) {
      const progress = particle.life / particle.maxLife;
      const alpha = 255 * (1 - progress);
      const size = HitEffect3.BASE_PARTICLE_SIZE * (1 - progress) * scaleFactor * HitEffect3.SIZE_DECAY;
      p.push();
      p.noStroke();
      p.fill(particle.color, alpha);
      p.ellipse(particle.x + offsetX, particle.y + offsetY, size);
      p.pop();
    }
  }
}
