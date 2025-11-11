import React from 'react';
import { PlayerService } from '../services/PlayerService';
import { PlayerConfig, PlayerFeature } from '../types/PlayerTypes';

export interface InstrumentUnlockInfo {
  instrumentId: string;
  instrumentName: string;
  isUnlocked: boolean;
  requiredSubtopic?: string;
  subtopicName?: string;
}

export interface IUnlockableMusicPlayer {
  getConfig(): PlayerConfig;
  getAvailableFeatures(): PlayerFeature[];
  render(): React.ReactElement;
}
class EmptyMusicPlayer implements IUnlockableMusicPlayer {
  private config: PlayerConfig;

  constructor() {
    this.config = {
      type: 'empty',
      features: [],
      maxVolume: 0.5,
      showPlaylist: false,
      showVisualizer: false,
      showEqualizer: false,
      allowCustomThemes: false
    };
  }

  getConfig(): PlayerConfig {
    return this.config;
  }

  getAvailableFeatures(): PlayerFeature[] {
    return this.config.features;
  }

  render(): React.ReactElement {
    return React.createElement('div', {
      className: 'empty-player',
      children: 'Empty Player - Please complete learning tasks to unlock features'
    });
  }
}


class DynamicMusicPlayer implements IUnlockableMusicPlayer {
  private playerService: PlayerService;

  constructor() {
    this.playerService = PlayerService.getInstance();
  }

  getConfig(): PlayerConfig {
    const availableFeatures = this.getAvailableFeatures();
    
    return {
      type: this.getPlayerType(availableFeatures),
      features: availableFeatures,
      maxVolume: this.getMaxVolume(availableFeatures),
      showPlaylist: availableFeatures.includes('playlist'),
      showVisualizer: availableFeatures.includes('visualizer'),
      showEqualizer: availableFeatures.includes('equalizer'),
      allowCustomThemes: availableFeatures.includes('custom_themes')
    };
  }

  getAvailableFeatures(): PlayerFeature[] {
    return this.playerService.getAvailableFeatures();
  }

  private getPlayerType(features: PlayerFeature[]): 'empty' | 'dynamic' {
    if (features.length === 0) return 'empty';
    return 'dynamic';
  }

  private getMaxVolume(features: PlayerFeature[]): number {
    if (features.includes('volume_control')) return 1.0;
    return 0.8;
  }

  render(): React.ReactElement {
    const config = this.getConfig();
    return React.createElement('div', {
      className: `${config.type}-player`,
      children: `Dynamic Player - ${config.features.length} features unlocked`
    });
  }
}

export class UnlockableMusicPlayerFactory {
  private static playerService = PlayerService.getInstance();

  static createPlayerForCurrentUser(): IUnlockableMusicPlayer {
    return new DynamicMusicPlayer();
  }
  static getUpgradeInfo(): {
    currentFeatures: PlayerFeature[];
    nextFeatures: Array<{ feature: PlayerFeature; requirement: any }>;
    progress: number;
  } {
    const playerService = PlayerService.getInstance();
    const currentFeatures = playerService.getAvailableFeatures();
    const featureProgress = playerService.getFeatureProgress();
    const nextFeatures = featureProgress.filter(fp => !fp.isUnlocked);

    return {
      currentFeatures,
      nextFeatures: nextFeatures.map(fp => ({
        feature: fp.feature,
        requirement: fp.requirement
      })),
      progress: currentFeatures.length
    };
  }

  static getInstrumentUnlockInfo(): InstrumentUnlockInfo[] {
    const playerService = PlayerService.getInstance();
    return playerService.getInstrumentUnlockInfo();
  }

  static isInstrumentUnlocked(instrumentId: string): boolean {
    const playerService = PlayerService.getInstance();
    return playerService.isInstrumentUnlocked(instrumentId);
  }

  static getAvailableInstruments(): string[] {
    const playerService = PlayerService.getInstance();
    return playerService.getAvailableInstruments();
  }
} 