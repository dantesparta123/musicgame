import { PlayerInfo, PlayerFeature, FeatureRequirement, SubtopicProgress } from '../types/PlayerTypes';


const SONG_UNLOCK_CONFIG: Record<string, string[]> = {
  'Music basics': ['Bach-846'],
  'Music history': ['mz-311'],
  'Blues music basic': ['The-Thrill-Is-Gone'],
  'Rock music': ['Sweet-Child-O-Mine4'],
};


export const ALL_SONGS = [
  { name: 'Sweet-Child-O-Mine4', file: '/sfx/background-music/Sweet-Child-O-Mine4.mid', displayName: 'Sweet Child O Mine' },
  { name: 'Bach-846', file: '/sfx/background-music/Bach-846.mid', displayName: 'Bach 846' },
  { name: 'Love-Story', file: '/sfx/background-music/Love-Story.mid', displayName: 'Love Story' },
  { name: 'My-Heart-Will-Go-On', file: '/sfx/background-music/My-Heart-Will-Go-On.mid', displayName: 'My Heart Will Go On' },
  { name: 'He-is-a-pirate', file: '/sfx/background-music/He-is-a-pirate.mid', displayName: 'He is a Pirate' },
  { name: 'mz-311', file: '/sfx/background-music/mz-311.mid', displayName: 'mz 311' },
  { name: 'The-Thrill-Is-Gone', file: '/sfx/background-music/The-Thrill-Is-Gone.mid', displayName: 'The Thrill Is Gone' }
];


const FEATURE_REQUIREMENTS: FeatureRequirement[] = [
  {
    feature: 'basic_playback',
    requiredSubtopic: 'Music basics',
    description: 'Basic playback functionality - Complete music basics learning'
  },
  {
    feature: 'playlist',
    requiredSubtopic: 'Music history',
    description: 'Playlist functionality - Complete music history learning'
  },
  {
    feature: 'prev_track',
    requiredSubtopic: 'Music history',
    description: 'Previous track functionality - Complete music history learning'
  },
  {
    feature: 'next_track',
    requiredSubtopic: 'Music history',
    description: 'Next track functionality - Complete music history learning'
  },
  {
    feature: 'volume_control',
    requiredSubtopic: 'Fundamentals of Acoustics',
    description: 'Volume control functionality - Complete acoustics fundamentals learning'
  },
  {
    feature: 'favorites',
    requiredSubtopic: 'Blues music basic',
    description: 'Unlock a music - Complete blues music basics learning'
  },
  {
    feature: 'instrument_panel',
    requiredSubtopic: 'Instrument history',
    description: 'Instrument panel - Complete instrument history learning'
  },
];


const INSTRUMENT_UNLOCK_CONFIG: Record<string, string[]> = {
  'guitar basic': ['guitar'],
  'ukulele basic': ['ukulele'],
  'bass basic': ['bass'],
};



export class PlayerService {
  private static instance: PlayerService;
  private currentPlayer: PlayerInfo | null = null;
  private realCompletedSubtopics: { id: string; title: string }[] = [];

  private constructor() {}

  static getInstance(): PlayerService {
    if (!PlayerService.instance) {
      PlayerService.instance = new PlayerService();
    }
    return PlayerService.instance;
  }


  setRealCompletedSubtopics(completedSubtopics: { id: string; title: string }[]) {
    this.realCompletedSubtopics = completedSubtopics;
    console.log('🎵 Setting real subtopics data:', completedSubtopics);
  }


  getCurrentPlayer(): PlayerInfo | null {
    return this.currentPlayer;
  }


  setCurrentPlayer(player: PlayerInfo): void {
    this.currentPlayer = player;
    this.savePlayerToStorage(player);
  }




  completeSubtopic(subtopicId: string): PlayerInfo | null {
    console.warn('completeSubtopic method is deprecated, now using real subtopics data');
    return null;
  }


  private checkNewlyUnlockedFeatures(): PlayerFeature[] {
    console.warn('checkNewlyUnlockedFeatures method is deprecated, now using real subtopics data');
    return [];
  }


  isFeatureUnlocked(feature: PlayerFeature): boolean {
    const requirement = FEATURE_REQUIREMENTS.find(r => r.feature === feature);
    if (!requirement) return false;


    const completedSubtopic = this.realCompletedSubtopics.find(
      s => s.title === requirement.requiredSubtopic
    );

    return !!completedSubtopic;
  }


  getAvailableFeatures(): PlayerFeature[] {
    return FEATURE_REQUIREMENTS
      .filter(req => this.isFeatureUnlocked(req.feature))
      .map(req => req.feature);
  }


  getUpcomingFeatures(): FeatureRequirement[] {
    if (!this.currentPlayer) return [];

    return FEATURE_REQUIREMENTS.filter(req => 
      !this.isFeatureUnlocked(req.feature)
    );
  }


  private savePlayerToStorage(player: PlayerInfo): void {
    try {
      localStorage.setItem('music-player-data', JSON.stringify(player));
    } catch (error) {
      console.warn('Unable to save player data:', error);
    }
  }


  loadPlayerFromStorage(): PlayerInfo | null {
    try {
      const data = localStorage.getItem('music-player-data');
      if (data) {
        const player = JSON.parse(data) as PlayerInfo;
        this.currentPlayer = player;
        return player;
      }
    } catch (error) {
      console.warn('Unable to load player data:', error);
    }
    return null;
  }


  resetPlayerData(): void {
    this.currentPlayer = null;
    localStorage.removeItem('music-player-data');
  }


  getFeatureProgress(): Array<{
    feature: PlayerFeature;
    requirement: FeatureRequirement;
    isUnlocked: boolean;
    progress: number;
  }> {
    if (!this.currentPlayer) return [];

    return FEATURE_REQUIREMENTS.map(req => {
      const isUnlocked = this.isFeatureUnlocked(req.feature);
      const progress = isUnlocked ? 100 : 0;
      
      return {
        feature: req.feature,
        requirement: req,
        isUnlocked,
        progress: isUnlocked ? 100 : progress
      };
    });
  }


  getAvailableSongs(): typeof ALL_SONGS {
    const availableSongs: typeof ALL_SONGS = [];
    

    for (const [subtopicId, songNames] of Object.entries(SONG_UNLOCK_CONFIG)) {
      const isCompleted = this.realCompletedSubtopics.find(
        s => s.title === subtopicId
      );
      
      if (isCompleted) {
        songNames.forEach(songName => {
          const song = ALL_SONGS.find(s => s.name === songName);
          if (song && !availableSongs.find(s => s.name === song.name)) {
            availableSongs.push(song);
          }
        });
      }
    }
    
    return availableSongs;
  }


  getSongUnlockInfo(): Array<{
    song: typeof ALL_SONGS[0];
    isUnlocked: boolean;
    requiredSubtopic?: string;
    subtopicName?: string;
  }> {
    return ALL_SONGS.map(song => {

      const subtopicId = Object.entries(SONG_UNLOCK_CONFIG).find(([_, songNames]) => 
        songNames.includes(song.name)
      )?.[0];

      if (subtopicId) {
        const subtopic = this.realCompletedSubtopics.find(s => s.title === subtopicId);
        const isUnlocked = !!subtopic;
        
        return {
          song,
          isUnlocked,
          requiredSubtopic: subtopicId,
          subtopicName: subtopic?.title
        };
      }

      return { song, isUnlocked: false };
    });
  }


  isInstrumentUnlocked(instrumentId: string): boolean {
    const subtopicId = Object.entries(INSTRUMENT_UNLOCK_CONFIG).find(([_, instrumentIds]) => 
      instrumentIds.includes(instrumentId)
    )?.[0];

    if (subtopicId) {
      const completedSubtopic = this.realCompletedSubtopics.find(
        s => s.title === subtopicId
      );
      return !!completedSubtopic;
    }


    return true;
  }


  getAvailableInstruments(): string[] {
    const availableInstruments: string[] = [];
    

    for (const [subtopicId, instrumentIds] of Object.entries(INSTRUMENT_UNLOCK_CONFIG)) {
      const isCompleted = this.realCompletedSubtopics.find(
        s => s.title === subtopicId
      );
      
      if (isCompleted) {
        instrumentIds.forEach(instrumentId => {
          if (!availableInstruments.includes(instrumentId)) {
            availableInstruments.push(instrumentId);
          }
        });
      }
    }
    
    return availableInstruments;
  }


  getInstrumentUnlockInfo(): Array<{
    instrumentId: string;
    instrumentName: string;
    isUnlocked: boolean;
    requiredSubtopic?: string;
    subtopicName?: string;
  }> {
    const allInstruments = ['piano', 'guitar', 'drums', 'ukulele', 'bass', 'violin', 'flute', 'saxophone', 'trumpet', 'accordion', 'harp', 'xylophone', 'organ'];
    
    return allInstruments.map(instrumentId => {

      const subtopicId = Object.entries(INSTRUMENT_UNLOCK_CONFIG).find(([_, instrumentIds]) => 
        instrumentIds.includes(instrumentId)
      )?.[0];

      if (subtopicId) {
        const subtopic = this.realCompletedSubtopics.find(s => s.title === subtopicId);
        const isUnlocked = !!subtopic;
        
        return {
          instrumentId,
          instrumentName: this.getInstrumentDisplayName(instrumentId),
          isUnlocked,
          requiredSubtopic: subtopicId,
          subtopicName: subtopic?.title
        };
      }

      return { 
        instrumentId, 
        instrumentName: this.getInstrumentDisplayName(instrumentId), 
        isUnlocked: true 
      };
    });
  }


  private getInstrumentDisplayName(instrumentId: string): string {
    const instrumentNames: Record<string, string> = {
      'piano': 'Piano',
      'guitar': 'Guitar',
      'drums': 'Drums',
      'ukulele': 'Ukulele',
      'bass': 'Bass',
      'violin': 'Violin',
      'flute': 'Flute',
      'saxophone': 'Saxophone',
      'trumpet': 'Trumpet',
      'accordion': 'Accordion',
      'harp': 'Harp',
      'xylophone': 'Xylophone',
      'organ': 'Organ'
    };
    
    return instrumentNames[instrumentId] || instrumentId;
  }
} 