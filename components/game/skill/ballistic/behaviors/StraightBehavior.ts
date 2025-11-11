import type { ProjectileBehavior } from './ProjectileBehavior';
import type { Projectile } from '../Projectile';

export class StraightBehavior implements ProjectileBehavior {
  update(projectile: Projectile, deltaTime: number, cellSize: number = 80): void {
    projectile.gridX += projectile.direction.x * projectile.speed * deltaTime;
    projectile.gridY += projectile.direction.y * projectile.speed * deltaTime;
    projectile.updateVirtualPosition(cellSize);
  }

  getName(): string {
    return 'straight';
  }
} 