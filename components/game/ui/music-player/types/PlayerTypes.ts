export type PlayerLevel = 'beginner' | 'intermediate' | 'advanced' | 'master';

export type PlayerFeature = 
  | 'basic_playback'
  | 'playlist'
  | 'volume_control'
  | 'equalizer'
  | 'visualizer'
  | 'favorites'
  | 'history'
  | 'custom_themes'
  | 'prev_track'
  | 'next_track'
  | 'instrument_panel';

export interface PlayerInfo {
  id: string;
  name: string;
  completedSubtopics: SubtopicProgress[];
  unlockedFeatures: PlayerFeature[];
  preferences: {
    defaultVolume: number;
    autoPlay: boolean;
    theme: 'dark' | 'light';
  };
}

export interface PlayerConfig {
  type: 'empty' | 'dynamic';
  features: PlayerFeature[];
  maxVolume: number;
  showPlaylist: boolean;
  showVisualizer: boolean;
  showEqualizer: boolean;
  allowCustomThemes: boolean;
}

export interface FeatureRequirement {
  feature: PlayerFeature;
  requiredSubtopic: string;
  description: string;
}

export interface SubtopicProgress {
  subtopicId: string;
  subtopicName: string;
  isCompleted: boolean;
  completedAt?: Date;
} 