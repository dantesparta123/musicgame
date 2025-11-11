export enum SoundEffectType {
  EXPLOSION = 'explosion',
  EXPLOSION_2 = 'explosion_2',
  
  SHOOT = 'shoot',
  
  PLAYER_DEATH = 'player_death',
  PLAYER_HURT = 'player_hurt',
  PLAYER_HEAL = 'player_heal',
  
  GAME_START = 'game_start',
  GAME_OVER = 'game_over',
  LEVEL_COMPLETE = 'level_complete',
  
  BUTTON_CLICK = 'button_click',
  MENU_OPEN = 'menu_open',
  MENU_CLOSE = 'menu_close',
  
  FOOTSTEP = 'footstep',
  DOOR_OPEN = 'door_open',
  DOOR_CLOSE = 'door_close',
  
  SKILL_ACTIVATE = 'skill_activate',
  SKILL_COOLDOWN = 'skill_cooldown',
  POWER_UP = 'power_up'
}

export interface SoundEffectConfig {
  type: SoundEffectType;
  volume?: number;
  pitch?: number;
  duration?: number;
  loop?: boolean;
  throttleMs?: number;
}

export interface SoundPoolConfig {
  poolSize: number;
  throttleMs: number;
} 