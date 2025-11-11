import { useMemo } from 'react';

interface MusicTrack {
  name: string;
  file: string;
  displayName: string;
}

interface MusicPlayerUIProps {
  musicTracks: MusicTrack[];
  currentTrack: MusicTrack | undefined;
  currentTrackIndex: number;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  volume: number;
  isMuted: boolean;
  isScanning: boolean;
  showPlaylist: boolean;
  
  onTogglePlayPause: () => void;
  onPlayNext: () => void;
  onPlayPrevious: () => void;
  onPlayTrack: (index: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onLoadMusicFiles: () => void;
  onClearError: () => void;
  onTogglePlaylist: () => void;
  
  className?: string;
}

export function MusicPlayerUI({
  musicTracks,
  currentTrack,
  currentTrackIndex,
  isPlaying,
  isLoading,
  error,
  volume,
  isMuted,
  isScanning,
  showPlaylist,
  onTogglePlayPause,
  onPlayNext,
  onPlayPrevious,
  onPlayTrack,
  onVolumeChange,
  onToggleMute,
  onLoadMusicFiles,
  onClearError,
  onTogglePlaylist,
  className = ''
}: MusicPlayerUIProps) {
  

  const playButtonIcon = useMemo(() => {
    if (isPlaying) {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
        </svg>
      );
    }
    
    return (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
      </svg>
    );
  }, [isPlaying]);


  if (isScanning) {
    return (
      <div className={`fixed top-2 right-2 z-50 ${className}`}>
        <div className="bg-black/80 backdrop-blur-sm rounded-md shadow-lg border border-gray-700 p-3">
          <div className="flex items-center gap-2 text-white text-xs">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
            <span>Scanning music files...</span>
          </div>
          <div className="text-gray-300 text-xs mt-1">
            Found {musicTracks.length} music tracks
          </div>
        </div>
      </div>
    );
  }


  if (musicTracks.length === 0) {
    return (
      <div className={`fixed top-2 right-2 z-50 ${className}`}>
        <div className="bg-red-500/80 backdrop-blur-sm rounded-md shadow-lg border border-red-700 p-3">
          <div className="text-white text-xs">
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              <span>No music files found</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed top-2 right-2 z-50 ${className}`}>
      
      {error && (
        <div className="mb-2 bg-red-500/80 backdrop-blur-sm rounded-md p-2 text-white text-xs max-w-[300px]">
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
            <span className="truncate">{error}</span>
            <button 
              onClick={onClearError}
              className="ml-auto text-gray-300 hover:text-white"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      
      <div className="bg-black/80 backdrop-blur-sm rounded-md shadow-lg border border-gray-700 p-1.5">
        <div className="flex items-center gap-0.5">

          <div className="text-white text-xs mr-2 min-w-[120px]">
            <div className="flex items-center gap-1">
              <span className="font-medium truncate">{currentTrack?.displayName || 'Unknown'}</span>
              <span className="text-gray-300 text-xs whitespace-nowrap">
                {currentTrackIndex + 1} / {musicTracks.length}
              </span>
            </div>
          </div>


          <button
            onClick={onTogglePlayPause}
            disabled={isLoading}
            className="p-1 rounded bg-gray-600 hover:bg-gray-500 active:bg-gray-700 text-white disabled:opacity-50 shadow-md"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            <div className="w-3 h-3 flex items-center justify-center">
              {playButtonIcon}
            </div>
          </button>


          <button
            onClick={onPlayPrevious}
            className="p-1 rounded bg-gray-500 hover:bg-gray-400 active:bg-gray-600 text-white transition-all duration-150 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            title="Previous"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z"/>
            </svg>
          </button>

          <button
            onClick={onPlayNext}
            className="p-1 rounded bg-gray-500 hover:bg-gray-400 active:bg-gray-600 text-white transition-all duration-150 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            title="Next"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z"/>
            </svg>
          </button>


          <div className="flex items-center gap-1 ml-1">
            <button
              onClick={onToggleMute}
              className={`p-0.5 rounded transition-all duration-150 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg ${isMuted ? 'bg-red-500/30 hover:bg-red-500/50 active:bg-red-500/70 text-red-400' : 'bg-gray-500 hover:bg-gray-400 active:bg-gray-600 text-white'}`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-12 h-1 rounded-lg appearance-none cursor-pointer slider bg-gray-500 hover:h-1.5 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
              style={{
                background: `linear-gradient(to right, #f3f4f6 0%, #f3f4f6 ${(isMuted ? 0 : volume) * 100}%, #6b7280 ${(isMuted ? 0 : volume) * 100}%, #6b7280 100%)`
              }}
              title={isMuted ? 'Muted' : 'Volume'}
            />
          </div>


          <button
            onClick={onTogglePlaylist}
            className="p-1 rounded bg-gray-500 hover:bg-gray-400 active:bg-gray-600 text-white transition-all duration-150 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            title="Playlist"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
            </svg>
          </button>
        </div>
      </div>

      
      {showPlaylist && (
        <div className="absolute top-full right-0 mt-1 bg-black/80 backdrop-blur-sm rounded-md p-1.5 shadow-lg border border-gray-700 min-w-[200px]">
          <div className="flex items-center justify-between text-white text-xs font-medium mb-1">
            <span>play list ({musicTracks.length})</span>
            <button
              onClick={onLoadMusicFiles}
              disabled={isScanning}
              className="p-0.5 rounded bg-gray-600 hover:bg-gray-500 active:bg-gray-700 text-white disabled:opacity-50 transition-all duration-150 transform hover:scale-105 active:scale-95"
              title="Rescan music files"
            >
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
          {musicTracks.map((track, index) => (
            <button
              key={track.name}
              onClick={() => onPlayTrack(index)}
              className={`w-full text-left p-1 rounded text-xs transition-all duration-150 transform hover:scale-102 active:scale-98 ${
                index === currentTrackIndex
                  ? 'bg-gray-500 text-white shadow-md'
                  : 'text-gray-200 hover:bg-gray-600 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-1.5">
                {index === currentTrackIndex && isPlaying && (
                  <svg className="w-2.5 h-2.5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                  </svg>
                )}
                <span className="truncate">{track.displayName}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 