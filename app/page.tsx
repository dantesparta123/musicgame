'use client';

import { useEffect, useState } from 'react';
import GameCanvas from '@/components/game/GameCanvas';
import * as Tone from 'tone';
import { start, getContext } from 'tone';
import { GameButton, GameStartBg, GameLoading } from '@/components/game/ui/main';
import { useRouter } from 'next/navigation';

const disableScroll = () => {
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
};

const enableScroll = () => {
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
};

export default function GamePage() {
  const [showGame, setShowGame] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [developerMode, setDeveloperMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    disableScroll();
    
    return () => {
      enableScroll();
    };
  }, []);

  // 调试：监听状态变化
  useEffect(() => {
    console.log('📊 State updated:', { showGame, showLoading, developerMode });
  }, [showGame, showLoading, developerMode]);

  const startAudioContext = async () => {
    try {
      // Tone.js v14: 使用 start() 启动音频上下文
      await start();
      
      // 然后获取 context
      const context = getContext();
      if (!context) {
        console.warn('⚠️ Tone context is not available after start()');
        return;
      }
      // 确保 audio context 在运行状态
      if (context.state !== 'running') {
        await context.resume();
      }
      console.log('✅ Audio context started, state:', context.state);
    } catch (error) {
      console.warn('⚠️ Failed to start audio context:', error);
      // 即使音频初始化失败，也继续游戏
    }
  };

  const handleStartGame = async () => {
    console.log('🎮 Starting game...');
    try {
      await startAudioContext();
      router.push('/play');
    } catch (error) {
      console.error('❌ Error starting game:', error);
      router.push('/play');
    }
  };

  const handleDeveloperMode = async () => {
    console.log('🔧 Starting developer mode...');
    try {
      await startAudioContext();
      router.push('/dev');
    } catch (error) {
      console.error('❌ Error starting developer mode:', error);
      router.push('/dev');
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-background z-50"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999
      }}
    >
      {!showGame && !showLoading && (
        <GameStartBg>
          <div className="flex flex-col gap-4">
            <GameButton
              onClick={handleStartGame}
            >
              START GAME
            </GameButton>
            <GameButton
              onClick={handleDeveloperMode}
              variant="secondary"
            >
              DEVELOPER MODE
            </GameButton>
          </div>
        </GameStartBg>
      )}
      {showGame && !showLoading && (
        <GameCanvas developerMode={developerMode} />
      )}
      {showLoading && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10000 }}>
          <GameLoading />
        </div>
      )}
    </div>
  );
}
