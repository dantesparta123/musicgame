'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, RefreshCw } from 'lucide-react';

interface GameOverProps {
  isVisible: boolean;
  onResurrect: () => void;
  playerHealth?: number;
  maxHealth?: number;
}

export default function GameOver({ isVisible, onResurrect, playerHealth = 0, maxHealth = 100 }: GameOverProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-96 bg-white/95 backdrop-blur-sm border-2 border-red-500/50 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
            <Play className="w-8 h-8 text-white rotate-90" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600 mb-2">
            Game Over
          </CardTitle>
          <p className="text-gray-600 text-sm">
            Your character has died, but you have a chance to restart!
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Health</span>
              <span className="text-sm text-gray-500">
                {playerHealth} / {maxHealth}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(playerHealth / maxHealth) * 100}%` }}
              />
            </div>
          </div>

          <Button 
            onClick={onResurrect}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Resurrect Player
          </Button>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Click the resurrect button to restore player health and continue the game
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 