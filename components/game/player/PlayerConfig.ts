import type { ShapeFormula } from './formulas';
import type { HealthBarConfig } from './PlayerRenderer';

export interface PlayerConfig {
  size: number;
  strokeColor: number;
  strokeWeight: number;
  shape: ShapeFormula;
  angle?: number;
  x?: number;
  y?: number;
  speed?: number;
  maxHealth?: number;
  currentHealth?: number;
  healthBar?: HealthBarConfig;
  playDeathSound?: boolean;
} 