'use client';

import React, { useState } from 'react';
import { instrumentKeys, instrumentMeta } from '../../../sound/musicPlayer';
import { PlayerService } from '../services/PlayerService';

interface InstrumentPanelProps {
  isVisible: boolean;
  onClose: () => void;
  onInstrumentChange?: (instrument: string) => void;
  currentInstrument?: string;
  currentTrack?: {
    name: string;
    displayName: string;
    file: string;
  } | null;
  tracks?: Array<{
    name: string;
    channel: number;
    notes: number;
    isDrum: boolean;
  }>;
  onTrackInstrumentChange?: (trackChannel: number, instrument: string) => void;
  trackInstruments?: Map<number, string>;
  showGlobalInstrumentSelector?: boolean;
  selectedTrackForInstrument?: number | null;
  onShowGlobalInstrumentSelector?: (trackChannel: number | null) => void;
  mutedTracks?: Set<number>;
  onTrackMuteToggle?: (trackChannel: number) => void;
}


const allInstrumentMeta = [
  { id: 'piano', name: 'Piano', icon: '🎹' },
  { id: 'guitar', name: 'Guitar', icon: '🎸' },
  { id: 'drums', name: 'Drums', icon: '🥁' },
  { id: 'bass', name: 'Bass', icon: '🎸' },
  { id: 'ukulele', name: 'Ukulele', icon: '🪕' }
];


const instruments = instrumentMeta.filter(inst => instrumentKeys.includes(inst.id));

export default function InstrumentPanel({
  isVisible,
  onClose,
  onInstrumentChange,
  currentInstrument = 'piano',
  currentTrack,
  tracks,
  onTrackInstrumentChange,
  trackInstruments,
  showGlobalInstrumentSelector = false,
  selectedTrackForInstrument = null,
  onShowGlobalInstrumentSelector,
  mutedTracks = new Set(),
  onTrackMuteToggle
}: InstrumentPanelProps) {
  const [selectedInstrument, setSelectedInstrument] = useState(currentInstrument);
  
  const playerService = PlayerService.getInstance();
  
  const availableInstruments = playerService.getAvailableInstruments();
  const instrumentUnlockInfo = playerService.getInstrumentUnlockInfo();
  
  const unlockedInstruments = instruments.filter(inst => 
    availableInstruments.includes(inst.id) || !instrumentUnlockInfo.find(info => info.instrumentId === inst.id)?.requiredSubtopic
  );

  const handleInstrumentSelect = (instrumentId: string) => {
    setSelectedInstrument(instrumentId);
    onInstrumentChange?.(instrumentId);
  };

  const handleTrackClick = (trackChannel: number) => {
    onShowGlobalInstrumentSelector?.(trackChannel);
  };

  const handleGlobalInstrumentSelect = (instrumentId: string) => {
    if (selectedTrackForInstrument !== null) {
      onTrackInstrumentChange?.(selectedTrackForInstrument, instrumentId);
      onShowGlobalInstrumentSelector?.(null);
    }
  };

  const handleCloseGlobalSelector = () => {
    onShowGlobalInstrumentSelector?.(null);
  };

  const handleMuteToggle = (trackChannel: number, event: React.MouseEvent) => {
    event.stopPropagation();
    onTrackMuteToggle?.(trackChannel);
  };

  if (!isVisible) return null;

  return (
    <>

      <div className="absolute top-full right-0 mt-1 bg-black/80 backdrop-blur-sm rounded-md p-2 shadow-lg border border-gray-700 min-w-[280px] z-20">

        <div className="flex items-center justify-between text-white text-xs font-medium mb-2">
          <span>Instrument</span>
          <button
            onClick={onClose}
            className="p-0.5 rounded bg-gray-600 hover:bg-gray-500 active:bg-gray-700 text-white transition-all duration-150 transform hover:scale-105 active:scale-95"
            title="Close"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>


        {currentTrack && (
          <div className="text-white text-xs mb-2 bg-gray-700/50 rounded px-2 py-1">
            {currentTrack.displayName}
          </div>
        )}


        {tracks && tracks.length > 0 && (
          <div className="mb-2">
            <div className="text-white text-xs font-medium mb-1">Track Settings:</div>
            <div className="flex gap-1 overflow-x-auto pb-1">
              {tracks.map((track, index) => {
                const currentInstrumentId = trackInstruments?.get(track.channel) || 'piano';
                const currentInstrument = instruments.find(i => i.id === currentInstrumentId);
                const unlockInfo = instrumentUnlockInfo.find(info => info.instrumentId === currentInstrumentId);
                const isCurrentInstrumentUnlocked = unlockInfo ? unlockInfo.isUnlocked : true;
                const isMuted = mutedTracks.has(track.channel);
                
                return (
                  <div
                    key={index}
                    className="relative flex-shrink-0 min-w-[80px]"
                  >
                    <button
                      onClick={() => handleTrackClick(track.channel)}
                      className={`text-white text-xs bg-gray-700/30 hover:bg-gray-600/50 active:bg-gray-500/50 rounded px-2 py-1 w-full text-center transition-all duration-150 transform hover:scale-105 active:scale-95 ${
                        isMuted ? 'opacity-50' : ''
                      }`}
                      title={`Click to set instrument for ${track.name}`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className={track.isDrum ? 'text-yellow-400' : 'text-blue-400'}>
                          {track.isDrum ? '🥁' : '🎵'}
                        </span>
                        <span className="truncate text-xs">{track.name}</span>
                        <span className="text-gray-400 text-xs">{track.notes}</span>
                        <span className="text-xs mt-1">
                          Current: {isCurrentInstrumentUnlocked ? currentInstrument?.icon : '🔒'} {currentInstrument?.name}
                          {!isCurrentInstrumentUnlocked && unlockInfo?.requiredSubtopic && (
                            <span className="text-red-400 block text-xs">
                              Unlock: {unlockInfo.requiredSubtopic}
                            </span>
                          )}
                        </span>
                      </div>
                    </button>
                    
      
                    <button
                      onClick={(e) => handleMuteToggle(track.channel, e)}
                      className={`absolute top-1 right-1 p-1 rounded-full text-xs transition-all duration-150 transform hover:scale-110 active:scale-95 ${
                        isMuted 
                          ? 'bg-red-500 hover:bg-red-400 text-white' 
                          : 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                      }`}
                      title={isMuted ? `Unmute ${track.name}` : `Mute ${track.name}`}
                    >
                      {isMuted ? (
                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.5 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.5l3.883-3.707zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                        </svg>
                      ) : (
                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.5 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.5l3.883-3.707zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                        </svg>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

  
        {showGlobalInstrumentSelector && selectedTrackForInstrument !== null && (
          <div className="absolute top-full right-0 bg-black/90 backdrop-blur-sm rounded-lg p-4 shadow-2xl border border-gray-600 min-w-[320px] z-30">
    
            <div className="flex items-center justify-between text-white text-sm font-medium mb-4">
              <span>Select Instrument</span>
              <button
                onClick={handleCloseGlobalSelector}
                className="p-1 rounded bg-gray-600 hover:bg-gray-500 active:bg-gray-700 text-white transition-all duration-150 transform hover:scale-105 active:scale-95"
                title="Close"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>

    
            {tracks && (
              <div className="text-white text-xs mb-4 bg-gray-700/50 rounded px-3 py-2">
                <div className="font-medium">Current Track:</div>
                {(() => {
                  const track = tracks.find(t => t.channel === selectedTrackForInstrument);
                  if (track) {
                    return (
                      <div className="flex items-center gap-2 mt-1">
                        <span className={track.isDrum ? 'text-yellow-400' : 'text-blue-400'}>
                          {track.isDrum ? '🥁' : '🎵'}
                        </span>
                        <span>{track.name}</span>
                        <span className="text-gray-400">({track.notes} notes)</span>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            )}

    
            <div className="grid grid-cols-3 gap-2">
              {instruments.map(inst => {
                const unlockInfo = instrumentUnlockInfo.find(info => info.instrumentId === inst.id);
                const isUnlocked = unlockInfo ? unlockInfo.isUnlocked : true;
                const requiredSubtopic = unlockInfo?.requiredSubtopic;
                
                return (
                  <button
                    key={inst.id}
                    onClick={() => isUnlocked ? handleGlobalInstrumentSelect(inst.id) : null}
                    disabled={!isUnlocked}
                    className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-all duration-150 transform ${
                      isUnlocked 
                        ? 'bg-gray-700/50 hover:bg-blue-600/50 active:bg-blue-700 text-white hover:scale-105 active:scale-95' 
                        : 'bg-gray-800/30 text-gray-500 cursor-not-allowed opacity-50'
                    }`}
                    title={isUnlocked ? `Select ${inst.name}` : `Complete "${requiredSubtopic}" to unlock`}
                  >
                    <span className="text-2xl">
                      {isUnlocked ? inst.icon : '🔒'}
                    </span>
                    <span className="text-xs font-medium">{inst.name}</span>
                    {!isUnlocked && requiredSubtopic && (
                      <span className="text-xs text-gray-400 mt-1">
                        Required: {requiredSubtopic}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}