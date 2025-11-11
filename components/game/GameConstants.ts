export const GAME_CONSTANTS = {
  CAMERA: {
    INITIAL_Z: 600,
    MIN_Z: 200,
    MAX_Z: 750,
    ZOOM_SPEED: 2.5,
    VIEW_RANGE: 800,
  },
  
  PLAYER: {
    MOVE_SPEED: 1.5,
    SIZE: 20,
    STROKE_COLOR: 0,
    STROKE_WEIGHT: 3,
  },
  
  MAP: {
    GRID: {
      WIDTH: 10,
      HEIGHT: 10,
      CELL_SIZE: 300,
    },
    COLORS: {
      BACKGROUND: 128,
      GRID_LINE: 0,
      EMPTY: 200,
      WALL: 80,
      SPAWN: 0,
      GOAL: 255,
      ENEMY: 255,
    },
  },
  
  ENEMY: {
    INITIAL_SPAWN_COUNT: 8,
    SPAWN: {
      MIN_DISTANCE: 200,
      MAX_DISTANCE: 400,
      COUNT: 3,
    },
  },
  
  CANVAS: {
    BACKGROUND_COLOR: 255,
  },
};
export type GameConstants = typeof GAME_CONSTANTS; 