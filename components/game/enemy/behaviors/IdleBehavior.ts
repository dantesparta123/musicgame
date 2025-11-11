import { EnemyBehavior } from './EnemyBehavior';
import type { Enemy } from '../Enemy';

export class IdleBehavior implements EnemyBehavior {
  update(enemy: Enemy, playerGridX: number, playerGridY: number, deltaTime?: number): void {
  }
  
  getName(): string {
    return 'idle';
  }
} 