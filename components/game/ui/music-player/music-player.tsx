  'use client';

import React, { useState, useEffect } from 'react';
import { useMusicPlayer } from './hooks/useMusicPlayer';
import { PlayerService } from './services/PlayerService';
import { UnlockableMusicPlayerFactory } from './factories/UnlockableMusicPlayerFactory';
import { PlayerInfo } from './types/PlayerTypes';
import PlayerInfoPanel from './components/PlayerInfoPanel';
import MusicControlPanel from './components/MusicControlPanel';

interface UnlockableMusicPlayerProps {
  className?: string;
  userName?: string;
  completedSubtopics?: { id: string; title: string }[];
}

export default function UnlockableMusicPlayer({ className = '', userName, completedSubtopics }: UnlockableMusicPlayerProps) {
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showPlayerInfo, setShowPlayerInfo] = useState(false);
  
  const playerService = PlayerService.getInstance();
  const [currentPlayer, setCurrentPlayer] = useState(playerService.getCurrentPlayer());
  
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
  const unlockablePlayer = UnlockableMusicPlayerFactory.createPlayerForCurrentUser();
  const playerConfig = unlockablePlayer.getConfig();
  const availableFeatures = unlockablePlayer.getAvailableFeatures();

  useEffect(() => {
    const savedPlayer = playerService.loadPlayerFromStorage();
    if (savedPlayer) {
      setCurrentPlayer(savedPlayer);
    }
    
    if (completedSubtopics) {
      playerService.setRealCompletedSubtopics(completedSubtopics);
    }
  }, [completedSubtopics]);

  useEffect(() => {
      const availableFeatures = playerService.getAvailableFeatures();
      console.log('🎵 Current player level:', availableFeatures.length, 'Available features:', availableFeatures);
      
      loadMusicFiles();
  }, [completedSubtopics, playerService, loadMusicFiles]);

  const handlePlaylistToggle = () => {
    setShowPlaylist(!showPlaylist);
  };

  const handlePlayerUpdate = (player: PlayerInfo | null) => {
    setCurrentPlayer(player);
  };

  const playerInfoButton = (
    <button
      onClick={() => setShowPlayerInfo(!showPlayerInfo)}
      className="p-1 rounded bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white transition-all duration-150 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
      title="Player Info"
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/>
      </svg>
    </button>
  );

  return (
    <div className={`fixed top-2 right-2 z-50 ${className}`}>
      {showPlayerInfo && (
        <PlayerInfoPanel
          currentPlayer={currentPlayer}
          userName={userName}
          completedSubtopics={completedSubtopics}
          onClose={() => setShowPlayerInfo(false)}
          onPlayerUpdate={handlePlayerUpdate}
        />
      )}

      <MusicControlPanel
        musicTracks={musicTracks}
        currentTrack={currentTrack}
        currentTrackIndex={currentTrackIndex}
        isPlaying={isPlaying}
        isLoading={isLoading}
        volume={volume}
        isMuted={isMuted}
        isScanning={isScanning}
        
        playerConfig={playerConfig}
        availableFeatures={availableFeatures}
        
        onPlayPause={togglePlayPause}
        onNext={playNext}
        onPrevious={playPrevious}
        onVolumeChange={handleVolumeChange}
        onToggleMute={toggleMute}
        onPlayTrack={playTrack}
        onLoadMusicFiles={loadMusicFiles}
        
        showPlaylist={showPlaylist}
        onTogglePlaylist={handlePlaylistToggle}
        
        error={error}
        onClearError={clearError}
        
        playerInfoButton={playerInfoButton}
      />
      {availableFeatures.length === 0 && (
        <div className="bg-black/80 backdrop-blur-sm rounded-md shadow-lg border border-gray-700 p-1.5 flex justify-end">
          {playerInfoButton}
        </div>
      )}


    </div>
  );
} 