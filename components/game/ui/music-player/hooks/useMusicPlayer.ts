import { useState, useEffect, useCallback } from 'react';
import { playMidiSample, stopMidiSample, setGlobalVolume, getGlobalVolume, isMidiPlaying, setOnTrackEnd } from '../../../sound/musicPlayer';
import { PlayerService } from '../services/PlayerService';

interface MusicTrack {
  name: string;
  file: string;
  displayName: string;
}

export function useMusicPlayer() {
  const [musicTracks, setMusicTracks] = useState<MusicTrack[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [isManualOperation, setIsManualOperation] = useState(false);

  const currentTrack = musicTracks[currentTrackIndex];


  const getCurrentPlayerLevel = useCallback(() => {
    try {
      const playerService = PlayerService.getInstance();
      return playerService.getAvailableFeatures().length;
    } catch (error) {
      console.warn('Unable to get player level:', error);
      return 0;
    }
  }, []);


  const playTrack = useCallback(async (trackIndex: number) => {
    if (!musicTracks[trackIndex]) {
      setError('Music file does not exist');
      return;
    }

    console.log('🎵 Starting to play track:', trackIndex, musicTracks[trackIndex].displayName);
    setIsLoading(true);
    setError(null);
    setIsManualOperation(true);
    
    try {

      await stopMidiSample();
      

      await new Promise(resolve => setTimeout(resolve, 10));
      

      let retryCount = 0;
      while (retryCount < 10) {
        if (!isMidiPlaying()) {
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
        retryCount++;
      }
      

      await playMidiSample(musicTracks[trackIndex].file);
      setIsPlaying(true);
      setCurrentTrackIndex(trackIndex);
      console.log('🎵 Playback successful');
    } catch (error) {
      console.error('🎵 Playback failed:', error);
      setError(`Playback failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);

      setTimeout(() => setIsManualOperation(false), 500);
    }
  }, [musicTracks]);


  const togglePlayPause = useCallback(async () => {
    if (musicTracks.length === 0) {
      setError('No music available to play');
      return;
    }

    if (isPlaying) {
      try {
        console.log('🎵 User clicked pause');
        setIsPlaying(false);
        await stopMidiSample();
        console.log('🎵 Pause completed');
      } catch (error) {
        console.error('🎵 Pause failed:', error);
        setError('Pause failed');

        setIsPlaying(true);
      }
    } else {
      console.log('🎵 User clicked play');
      await playTrack(currentTrackIndex);
    }
  }, [isPlaying, musicTracks.length, currentTrackIndex, playTrack]);


  const playNext = useCallback(async () => {
    if (musicTracks.length === 0) {
      setError('No music available to play');
      return;
    }
    
    const nextIndex = (currentTrackIndex + 1) % musicTracks.length;
    console.log('🎵 Switching to next track:', nextIndex, musicTracks[nextIndex]?.displayName);
    await playTrack(nextIndex);
  }, [currentTrackIndex, musicTracks, playTrack]);


  const playPrevious = useCallback(async () => {
    if (musicTracks.length === 0) {
      setError('No music available to play');
      return;
    }
    
    const prevIndex = currentTrackIndex === 0 ? musicTracks.length - 1 : currentTrackIndex - 1;
    console.log('🎵 Switching to previous track:', prevIndex, musicTracks[prevIndex]?.displayName);
    await playTrack(prevIndex);
  }, [currentTrackIndex, musicTracks, playTrack]);


  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(false);
    setGlobalVolume(newVolume);
  }, []);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setGlobalVolume(volume);
      setIsMuted(false);
    } else {
      setGlobalVolume(0);
      setIsMuted(true);
    }
  }, [isMuted, volume]);


  const loadMusicFiles = useCallback(async () => {
    setIsScanning(true);
    setError(null);
    
    try {
      const playerService = PlayerService.getInstance();
      const availableSongs = playerService.getAvailableSongs();
      
      setMusicTracks(availableSongs);
      
      if (availableSongs.length > 0) {
        console.log('🎵 Loaded', availableSongs.length, 'playable music tracks');
      }
    } catch (error) {
      console.error('🎵 Failed to load music files:', error);
      setError('Failed to load music files');
    } finally {
      setIsScanning(false);
    }
  }, []);


  const clearError = useCallback(() => setError(null), []);


  const handleTrackEnd = useCallback(() => {
    console.log('🎵 Received playback completion callback, preparing to play next track');
    setIsPlaying(false);
    

    if (isManualOperation) {
      console.log('🎵 Manual operation detected, skipping auto-play');
      return;
    }
    

    setTimeout(async () => {
      if (musicTracks.length > 0) {
        try {
          await playNext();
        } catch (error) {
          console.error('🎵 Auto-play next track failed:', error);
          setError('Auto-play next track failed');
        }
      }
    }, 300);
  }, [musicTracks.length, playNext, isManualOperation]);


  useEffect(() => {
    loadMusicFiles();
    const savedVolume = getGlobalVolume();
    setVolume(savedVolume);
  }, [loadMusicFiles]);


  useEffect(() => {
    const checkPlayerLevel = () => {
      const currentLevel = getCurrentPlayerLevel();

      if (musicTracks.length > 0) {
        const expectedTracks = currentLevel <= 1 ? 1 : 4;
        if (musicTracks.length !== expectedTracks) {
          console.log('🎵 Player level changed, reloading music files');
          loadMusicFiles();
        }
      }
    };


    const interval = setInterval(checkPlayerLevel, 2000);
    return () => clearInterval(interval);
  }, [musicTracks.length, getCurrentPlayerLevel, loadMusicFiles]);


  useEffect(() => {
    setOnTrackEnd(handleTrackEnd);
  }, [handleTrackEnd]);


  const [hasInitialized, setHasInitialized] = useState(false);
  
  useEffect(() => {
    if (musicTracks.length > 0 && !isScanning && !isPlaying && !hasInitialized) {
      console.log('🎵 Initializing auto-play for first track');
      setHasInitialized(true);
      const timer = setTimeout(() => playTrack(0), 1000);
      return () => clearTimeout(timer);
    }
  }, [musicTracks.length, isScanning, isPlaying, playTrack, hasInitialized]);


  useEffect(() => {
    return () => {
      try {
        stopMidiSample();
      } catch (error) {
        console.error('Error cleaning up music playback resources:', error);
      }
    };
  }, []);

  return {
    musicTracks,
    currentTrack,
    currentTrackIndex,
    isPlaying,
    isLoading,
    error,
    volume,
    isMuted,
    isScanning,
    togglePlayPause,
    playNext,
    playPrevious,
    playTrack,
    handleVolumeChange,
    toggleMute,
    loadMusicFiles,
    clearError,
  };
} 