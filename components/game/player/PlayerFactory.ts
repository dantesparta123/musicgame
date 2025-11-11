import { Player } from './Player';
import { squareOutline, diamondOutline } from './formulas';
import { GAME_CONSTANTS } from '../GameConstants';
import { HealthBarConfig, RenderConfig } from './PlayerRenderer';

export const PlayerFactory = {
  defaultPlayer(angle: number = 0, speed: number = 1, maxHealth: number = 100, healthBarConfig?: HealthBarConfig, playDeathSound: boolean = true) {
    const player = new Player({
      size: GAME_CONSTANTS.PLAYER.SIZE,
      strokeColor: GAME_CONSTANTS.PLAYER.STROKE_COLOR,
      strokeWeight: GAME_CONSTANTS.PLAYER.STROKE_WEIGHT,
      shape: squareOutline,
      angle,
      speed,
      maxHealth,
      healthBar: healthBarConfig,
      playDeathSound
    });
    
    return player;
  },

  diamondPlayer(angle: number = 0, maxHealth: number = 150, healthBarConfig?: HealthBarConfig, playDeathSound: boolean = true) {
    return new Player({
      size: 60,
      strokeColor: 100,
      strokeWeight: 2,
      shape: diamondOutline,
      angle,
      maxHealth,
      healthBar: healthBarConfig,
      playDeathSound
    });
  },

  tankPlayer(angle: number = 0, speed: number = 2, maxHealth: number = 200, healthBarConfig?: HealthBarConfig, playDeathSound: boolean = true) {
    return new Player({
      size: GAME_CONSTANTS.PLAYER.SIZE * 1.2,
      strokeColor: 255,
      strokeWeight: GAME_CONSTANTS.PLAYER.STROKE_WEIGHT * 1.5,
      shape: squareOutline,
      angle,
      speed,
      maxHealth,
      healthBar: healthBarConfig,
      playDeathSound
    });
  },

  speedPlayer(angle: number = 0, speed: number = 5, maxHealth: number = 50, healthBarConfig?: HealthBarConfig, playDeathSound: boolean = true) {
    return new Player({
      size: GAME_CONSTANTS.PLAYER.SIZE * 0.8,
      strokeColor: 0,
      strokeWeight: GAME_CONSTANTS.PLAYER.STROKE_WEIGHT,
      shape: diamondOutline,
      angle,
      speed,
      maxHealth,
      healthBar: healthBarConfig,
      playDeathSound
    });
  },

  customPlayer(config: {
    angle?: number;
    speed?: number;
    maxHealth?: number;
    size?: number;
    strokeColor?: number;
    strokeWeight?: number;
    shape?: 'square' | 'diamond';
    healthBar?: HealthBarConfig;
    playDeathSound?: boolean;
  }) {
    const shape = config.shape === 'diamond' ? diamondOutline : squareOutline;
    
    return new Player({
      size: config.size ?? GAME_CONSTANTS.PLAYER.SIZE,
      strokeColor: config.strokeColor ?? GAME_CONSTANTS.PLAYER.STROKE_COLOR,
      strokeWeight: config.strokeWeight ?? GAME_CONSTANTS.PLAYER.STROKE_WEIGHT,
      shape,
      angle: config.angle ?? 0,
      speed: config.speed ?? 3,
      maxHealth: config.maxHealth ?? 100,
      healthBar: config.healthBar,
      playDeathSound: config.playDeathSound ?? true
    });
  },
};
