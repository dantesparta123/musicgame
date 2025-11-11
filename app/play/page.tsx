'use client';

import { useEffect } from 'react';
import { start, getContext } from 'tone';
import GameCanvas from '@/components/game/GameCanvas';

const disableScroll = () => {
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
};

const enableScroll = () => {
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
};

export default function PlayPage() {
  useEffect(() => {
    disableScroll();
    const handleFirstInteraction = async () => {
      try {
        await start();
        const ctx = getContext();
        if (ctx && ctx.state !== 'running') {
          await ctx.resume();
        }
        // 音频上下文已解锁，移除监听
        window.removeEventListener('pointerdown', handleFirstInteraction);
        window.removeEventListener('keydown', handleFirstInteraction);
      } catch (e) {
        // 忽略错误，后续交互还会再尝试
      }
    };
    window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });
    return () => enableScroll();
  }, []);

  return (
    <div 
      className="fixed inset-0 bg-background z-50"
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999 }}
    >
      <GameCanvas developerMode={false} />
    </div>
  );
}


