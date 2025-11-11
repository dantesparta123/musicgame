'use client';

import { useState } from 'react';
import { useMusicPlayer } from './hooks/useMusicPlayer';
import { MusicPlayerUI } from './components/MusicPlayerUI';

interface MusicPlayerProps {
  className?: string;
}

export default function MusicPlayer({ className = '' }: MusicPlayerProps) {
  const [showPlaylist, setShowPlaylist] = useState(false);
  
  const {
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
  } = useMusicPlayer();

  const handleTogglePlaylist = () => {
    setShowPlaylist(!showPlaylist);
  };

  return (
    <MusicPlayerUI
      musicTracks={musicTracks}
      currentTrack={currentTrack}
      currentTrackIndex={currentTrackIndex}
      isPlaying={isPlaying}
      isLoading={isLoading}
      error={error}
      volume={volume}
      isMuted={isMuted}
      isScanning={isScanning}
      showPlaylist={showPlaylist}
      onTogglePlayPause={togglePlayPause}
      onPlayNext={playNext}
      onPlayPrevious={playPrevious}
      onPlayTrack={playTrack}
      onVolumeChange={handleVolumeChange}
      onToggleMute={toggleMute}
      onLoadMusicFiles={loadMusicFiles}
      onClearError={clearError}
      onTogglePlaylist={handleTogglePlaylist}
      
      className={className}
    />
  );
} 