import { EnemyBehavior } from './EnemyBehavior';
import type { Enemy } from '../Enemy';

export class ChaseBehavior implements EnemyBehavior {
  update(enemy: Enemy, playerGridX: number, playerGridY: number, deltaTime?: number): void {
    const enemyGridPos = enemy.getGridPosition();
    const dx = playerGridX - enemyGridPos.x;
    const dy = playerGridY - enemyGridPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0) {
      const speed = enemy.getSpeed();
      const gridSpeed = speed / 80;
      const moveX = (dx / distance) * gridSpeed;
      const moveY = (dy / distance) * gridSpeed;
      const newGridX = enemyGridPos.x + moveX;
      const newGridY = enemyGridPos.y + moveY;
      enemy.setGridPosition(newGridX, newGridY);
    }
  }
  
  getName(): string {
    return 'chase';
  }
} 