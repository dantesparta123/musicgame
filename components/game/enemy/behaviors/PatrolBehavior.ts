import { EnemyBehavior } from './EnemyBehavior';
import type { Enemy } from '../Enemy';

export class PatrolBehavior implements EnemyBehavior {
  private patrolRadius: number = 0.625;
  private detectionRange: number = 1.875;
  private centerGridX: number = 0;
  private centerGridY: number = 0;
  private angle: number = 0;
  private isInitialized: boolean = false;

  update(enemy: Enemy, playerGridX: number, playerGridY: number, deltaTime?: number): void {
    const enemyGridPos = enemy.getGridPosition();
    
    if (!this.isInitialized) {
      this.centerGridX = enemyGridPos.x;
      this.centerGridY = enemyGridPos.y;
      this.isInitialized = true;
    }

    const dx = playerGridX - enemyGridPos.x;
    const dy = playerGridY - enemyGridPos.y;
    const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);

    if (distanceToPlayer <= this.detectionRange) {
      const speed = enemy.getSpeed();
      const gridSpeed = speed / 80;
      const moveX = (dx / distanceToPlayer) * gridSpeed;
      const moveY = (dy / distanceToPlayer) * gridSpeed;
      
      const newGridX = enemyGridPos.x + moveX;
      const newGridY = enemyGridPos.y + moveY;
      enemy.setGridPosition(newGridX, newGridY);
    } else {
      this.angle += 0.02;
      const speed = enemy.getSpeed() * 0.5;
      const gridSpeed = speed / 80;
      
      const newGridX = this.centerGridX + Math.cos(this.angle) * this.patrolRadius;
      const newGridY = this.centerGridY + Math.sin(this.angle) * this.patrolRadius;
      enemy.setGridPosition(newGridX, newGridY);
    }
  }
  
  getName(): string {
    return 'patrol';
  }
} 