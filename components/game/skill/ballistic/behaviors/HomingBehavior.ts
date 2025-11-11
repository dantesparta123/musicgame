import type { Projectile } from '../Projectile';
import type { ProjectileBehavior } from './ProjectileBehavior';

export class HomingBehavior implements ProjectileBehavior {
  private getTarget: () => { gridX: number; gridY: number } | null;
  private turnRate: number;
  private homingDelay: number;
  private elapsedTime: number = 0;

  constructor(getTarget: () => { gridX: number; gridY: number } | null, turnRate: number = 0.1, homingDelay: number = 0.5) {
    this.getTarget = getTarget;
    this.turnRate = turnRate;
    this.homingDelay = homingDelay;
  }

  update(projectile: Projectile, deltaTime: number, cellSize: number = 80): void {
    this.elapsedTime += deltaTime;
    
    if (this.elapsedTime < this.homingDelay) {
      projectile.gridX += projectile.direction.x * projectile.speed * deltaTime;
      projectile.gridY += projectile.direction.y * projectile.speed * deltaTime;
      projectile.updateVirtualPosition(cellSize);
      return;
    }
    
    const target = this.getTarget();
    
    if (!target) {
      projectile.gridX += projectile.direction.x * projectile.speed * deltaTime;
      projectile.gridY += projectile.direction.y * projectile.speed * deltaTime;
      projectile.updateVirtualPosition(cellSize);
      return;
    }
    
    const dx = target.gridX - projectile.gridX;
    const dy = target.gridY - projectile.gridY;
    
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const effectiveTurnRate = distance < 0.25 ? this.turnRate * 0.3 : this.turnRate;
    
    const targetAngle = Math.atan2(dy, dx);
    const currentAngle = Math.atan2(projectile.direction.y, projectile.direction.x);
    
    let angleDiff = targetAngle - currentAngle;
    while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
    
    const maxTurn = effectiveTurnRate * deltaTime;
    const newAngle = currentAngle + Math.max(-maxTurn, Math.min(maxTurn, angleDiff));
    
    projectile.direction.x = Math.cos(newAngle);
    projectile.direction.y = Math.sin(newAngle);
    
    const gridSpeed = projectile.speed;
    projectile.gridX += projectile.direction.x * gridSpeed * deltaTime;
    projectile.gridY += projectile.direction.y * gridSpeed * deltaTime;
    
    projectile.updateVirtualPosition(cellSize);
    
    const scaledSpeed = projectile.speed * (cellSize / 80);
    projectile.velocity.x = projectile.direction.x * scaledSpeed;
    projectile.velocity.y = projectile.direction.y * scaledSpeed;
    
    projectile.angle = newAngle + Math.PI / 2;
  }

  getName(): string {
    return 'Homing';
  }
} 