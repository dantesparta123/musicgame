import { EnemyBehavior } from './EnemyBehavior';
import type { Enemy } from '../Enemy';

export class WanderBehavior implements EnemyBehavior {
  private targetGridX: number = 0;
  private targetGridY: number = 0;
  private wanderRadius: number = 1.25;
  private changeDirectionTimer: number = 0;
  private changeDirectionInterval: number = 120;

  update(enemy: Enemy, playerGridX: number, playerGridY: number, deltaTime?: number): void {
    const enemyGridPos = enemy.getGridPosition();
    
    if (this.targetGridX === 0 && this.targetGridY === 0) {
      this.setNewTarget(enemyGridPos.x, enemyGridPos.y);
    }

    this.changeDirectionTimer++;
    if (this.changeDirectionTimer >= this.changeDirectionInterval) {
      this.setNewTarget(enemyGridPos.x, enemyGridPos.y);
      this.changeDirectionTimer = 0;
    }

    const dx = this.targetGridX - enemyGridPos.x;
    const dy = this.targetGridY - enemyGridPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0.0625) {
      const speed = enemy.getSpeed() * 0.7;
      const gridSpeed = speed / 80;
      const moveX = (dx / distance) * gridSpeed;
      const moveY = (dy / distance) * gridSpeed;
      
      const newGridX = enemyGridPos.x + moveX;
      const newGridY = enemyGridPos.y + moveY;
      enemy.setGridPosition(newGridX, newGridY);
    } else {
      this.setNewTarget(enemyGridPos.x, enemyGridPos.y);
    }
  }

  private setNewTarget(currentGridX: number, currentGridY: number): void {
    const angle = Math.random() * Math.PI * 2;
    this.targetGridX = currentGridX + Math.cos(angle) * this.wanderRadius;
    this.targetGridY = currentGridY + Math.sin(angle) * this.wanderRadius;
  }
  
  getName(): string {
    return 'wander';
  }
} 