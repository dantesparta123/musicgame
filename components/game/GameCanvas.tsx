'use client';

import { useEffect, useRef, useState } from 'react';
import { GAME_CONSTANTS } from './GameConstants';
import { GameMap, MapRenderer, SimpleEnemyGenerator } from './map';
import { PlayerFactory } from './player';
import { EnemyManager } from './enemy';
import { ProjectileManager, ProjectileFactory } from './skill/ballistic';
import PerformanceMonitor from './developer/AdvancedPerformanceMonitor';
import PlayerDebugPanel from './developer/PlayerDebugPanel';
import CompletedSubtopicsPanel from './developer/CompletedSubtopicsPanel';
import MusicPlayer from './ui/music-player/music-player';
import GameOver from './ui/game-over';
import { initSoundManager, cleanupSoundManager } from './sound/soundEffects/soundManager';
import { stopMidiSample } from './sound/musicPlayer';

interface GameCanvasProps {
  developerMode?: boolean;
  userId?: string;
  userName?: string;
  completedSubtopics?: { id: string; title: string }[];
  onSubtopicsUpdate?: () => void;
}

const GameCanvas = ({ developerMode = false, userId, userName, completedSubtopics, onSubtopicsUpdate }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false);
  const [showPlayerDebug, setShowPlayerDebug] = useState(false);
  const [showCompletedSubtopics, setShowCompletedSubtopics] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [p5Instance, setP5Instance] = useState<any>(null);
  const [playerDebugInfo, setPlayerDebugInfo] = useState({
    virtualX: 0,
    virtualY: 0,
    screenX: 0,
    screenY: 0
  });
  const [currentBulletType, setCurrentBulletType] = useState<'bullet' | 'arrow'>('bullet');
  const [localCompletedSubtopics, setLocalCompletedSubtopics] = useState<{ id: string; title: string }[]>(completedSubtopics || []);
  const [playerHealth, setPlayerHealth] = useState({ current: 100, max: 100 });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setLocalCompletedSubtopics(completedSubtopics || []);
  }, [completedSubtopics]);

  const handleSubtopicsUpdate = () => {
    console.log('Subtopics updated, refreshing data...');
    if (onSubtopicsUpdate) {
      onSubtopicsUpdate();
    }
  };

  const handleResurrect = () => {
    if (p5InstanceRef.current && p5InstanceRef.current._player) {
      const player = p5InstanceRef.current._player;
      player.fullHeal();
      player.resetDeathAnimation();
      setShowGameOver(false);
      setPlayerHealth({
        current: player.currentHealth,
        max: player.maxHealth
      });
      console.log('🎮 Player resurrected, current health:', player.currentHealth);
    }
  };

  useEffect(() => {
    const initSoundManagerAsync = async () => {
      try {
        console.log('🎵 Starting sound manager initialization...');
        await initSoundManager();
        console.log('🎵 Sound manager initialization successful');
      } catch (error) {
        console.error('❌ Sound engine initialization failed:', error);
      }
    };
    
    if (isClient) {
      initSoundManagerAsync();
    }
  }, [isClient, developerMode]);

  useEffect(() => {
    if (p5InstanceRef.current) {
      p5InstanceRef.current._currentBulletType = currentBulletType;
    }
  }, [currentBulletType]);

  useEffect(() => {
    if (p5InstanceRef.current) {
      p5InstanceRef.current._showGameOver = showGameOver;
    }
  }, [showGameOver]);

  useEffect(() => {
    if (!canvasRef.current || !isClient) return;

    const keys: { [key: string]: boolean } = {};
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (p5InstanceRef.current && p5InstanceRef.current._showGameOver) {
        if (developerMode) {
          if ((event.key === 'p' || event.key === 'P')) {
            setShowPerformanceMonitor(prev => !prev);
          }
          if ((event.key === 'o' || event.key === 'O')) {
            setShowPlayerDebug(prev => !prev);
          }
          if ((event.key === 'i' || event.key === 'I')) {
            setShowCompletedSubtopics(prev => !prev);
          }
        }
        return;
      }
      
      keys[event.key] = true;
      
      if ((event.key === 'p' || event.key === 'P') && developerMode) {
        setShowPerformanceMonitor(prev => !prev);
      }
      
      if (event.key === '=') {
        if (p5InstanceRef.current && p5InstanceRef.current._enemyManager && p5InstanceRef.current._gameMap) {
          const enemies = p5InstanceRef.current._gameMap.spawnEnemies({ 
            count: 3
          });
          p5InstanceRef.current._enemyManager.addEnemies(enemies);
        }
      }
      
      if (event.key === '-') {
        if (p5InstanceRef.current && p5InstanceRef.current._enemyManager) {
          p5InstanceRef.current._enemyManager.clearEnemies();
        }
      }
      
      if ((event.key === 'o' || event.key === 'O') && developerMode) {
        setShowPlayerDebug(prev => !prev);
      }
      
      if ((event.key === 'i' || event.key === 'I') && developerMode) {
        setShowCompletedSubtopics(prev => !prev);
      }
      

      if (event.key === '1') {
        console.log('Switched to round bullets');
        setCurrentBulletType('bullet');
      }
      

      if (event.key === '2') {
        console.log('Switched to arrow bullets');
        setCurrentBulletType('arrow');
      }
      

      if (event.key === '3') {
        if (p5InstanceRef.current && p5InstanceRef.current._enemyManager && p5InstanceRef.current._gameMap) {
          const enemies = p5InstanceRef.current._gameMap.spawnEnemies({ 
            count: 1
          }, 'basic');
          p5InstanceRef.current._enemyManager.addEnemies(enemies);
          console.log('Generated basic enemy');
        }
      }
      


      

      if (event.key === '5') {
        if (p5InstanceRef.current && p5InstanceRef.current._enemyManager && p5InstanceRef.current._gameMap) {
          const enemies = p5InstanceRef.current._gameMap.spawnEnemies({ 
            count: 1
          }, 'basic', 3);
          p5InstanceRef.current._enemyManager.addEnemies(enemies);
        }
      }
      

      if (event.key === '6') {
        if (p5InstanceRef.current && p5InstanceRef.current._enemyManager && p5InstanceRef.current._gameMap) {
          const enemies = p5InstanceRef.current._gameMap.spawnEnemies({ 
            count: 1
          }, 'boss');
          p5InstanceRef.current._enemyManager.addEnemies(enemies);
          console.log('Generated Boss enemy');
        }
      }
      

      if (event.key === 'v' || event.key === 'V') {
        console.log('Current view range:', GAME_CONSTANTS.CAMERA.VIEW_RANGE);
      }
      

      if (event.key === 'z' || event.key === 'Z') {
        if (p5InstanceRef.current && p5InstanceRef.current._player) {
          const player = p5InstanceRef.current._player;
          const damage = 10;
          player.takeDamage(damage);
          console.log(`Player took ${damage} damage, current health: ${player.currentHealth}`);
        }
      }
      

      if (event.key === 'x' || event.key === 'X') {
        if (p5InstanceRef.current && p5InstanceRef.current._player) {
          const player = p5InstanceRef.current._player;
          const heal = 15;
          player.heal(heal);
          console.log(`Player healed ${heal} health, current health: ${player.currentHealth}`);
        }
      }
    };
    
    const handleKeyUp = (event: KeyboardEvent) => {
      keys[event.key] = false;
    };



    const loadP5 = async () => {
      const p5 = (await import('p5')).default;
      

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      
      const sketch = (p: any) => {
        //#region
        let lastMapSize: any = null;    
        let lastCanvasWidth: number = 0;
        let lastCanvasHeight: number = 0;
        //let needsRedraw: boolean = true;
        
        const player = PlayerFactory.defaultPlayer();
        
        const gameMap = new GameMap({
          width: GAME_CONSTANTS.MAP.GRID.WIDTH,
          height: GAME_CONSTANTS.MAP.GRID.HEIGHT,
          cellSize: GAME_CONSTANTS.MAP.GRID.CELL_SIZE,
          enemyGenerator: new SimpleEnemyGenerator()
        });

        const enemyManager = new EnemyManager();
        
        const projectileManager = new ProjectileManager();
        
        enemyManager.setPlayer(player);
        
        enemyManager.setProjectileManager(projectileManager);
        
        projectileManager.setPlayer(player);
        
        p._enemyManager = enemyManager;
        p._gameMap = gameMap;
        p._player = player;
        p._projectileManager = projectileManager;
        p._currentBulletType = currentBulletType;
        p._showGameOver = showGameOver;
        
        //#endregion



        p.setup = () => {
          const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
          canvas.parent(canvasRef.current!);
          

          canvas.elt.focus();
          

          p.frameRate(120);
          

          lastCanvasWidth = p.width;
          lastCanvasHeight = p.height;
          //needsRedraw = true;
          

        };


        const handlePlayerMovement = (deltaTime: number) => {
          let dirX = 0;
          let dirY = 0;
          
          if (keys['w'] || keys['W']) dirY -= 1;
          if (keys['s'] || keys['S']) dirY += 1;
          if (keys['a'] || keys['A']) dirX -= 1;
          if (keys['d'] || keys['D']) dirX += 1;
          if (dirX !== 0 || dirY !== 0) {
            player.move(dirX, dirY, deltaTime);
          }
        };


        p.draw = () => {

          const deltaTime = p.deltaTime / 1000;
          

          if (p._showGameOver) {

            p.background(GAME_CONSTANTS.CANVAS.BACKGROUND_COLOR);
            

            p.translate(p.width / 2, p.height / 2);
            

            const mapOffset = player.getMapOffset();
            MapRenderer.renderGridMap(p, gameMap, lastMapSize, mapOffset);
            

            enemyManager.draw(p, 0, 0, mapOffset);
            

            player.draw(p, 0, 0);
            

            projectileManager.draw(p, 0, 0, mapOffset, GAME_CONSTANTS.MAP.GRID.CELL_SIZE);
            
            return;
          }
          

          handlePlayerMovement(deltaTime);
          
          const playerGridPos = player.getGridPosition();

          enemyManager.update(playerGridPos.x, playerGridPos.y, deltaTime);

          projectileManager.setEnemies(enemyManager.getEnemies());
          projectileManager.update(deltaTime, GAME_CONSTANTS.MAP.GRID.CELL_SIZE);
          

          const canvasChanged = lastCanvasWidth !== p.width || lastCanvasHeight !== p.height;
          

          if (canvasChanged || lastMapSize === null) {
            lastMapSize = gameMap.calculateMapLayout(p.width, p.height);
            lastCanvasWidth = p.width;
            lastCanvasHeight = p.height;
          }
          

          p.background(GAME_CONSTANTS.CANVAS.BACKGROUND_COLOR);
          

          p.translate(p.width / 2, p.height / 2);
          

          const mapOffset = player.getMapOffset();
          MapRenderer.renderGridMap(p, gameMap, lastMapSize, mapOffset);
          

          enemyManager.draw(p, 0, 0, mapOffset);
          


          player.draw(p, 0, 0);
          

          projectileManager.draw(p, 0, 0, mapOffset, GAME_CONSTANTS.MAP.GRID.CELL_SIZE);
          


          p.push();
          p.resetMatrix();
          p.textAlign(p.LEFT, p.TOP);
          p.textSize(16);
          p.fill(255);
          p.stroke(0, 150);
          p.strokeWeight(3);
          const instructions = [
            '按 WASD 控制方向',
            '滚动鼠标滚轮调整显示距离',
            '鼠标左键发射子弹',
            '按 1 或 2 切换子弹类型：',
            '  1 → 无法跟踪的 AOE 子弹',
            '  2 → 单体伤害的跟踪子弹',
            '按 5 生成一些敌人来击杀吧！',
            '右上角音乐播放器可切歌与调音色，欢迎探索！'
          ];
          const padding = 12;
          const lineHeight = 22;
          const boxWidth = 420;
          const boxHeight = instructions.length * lineHeight + padding * 2;
          p.fill(0, 150);
          p.noStroke();
          p.rect(padding, padding, boxWidth, boxHeight, 8);
          p.fill(255);
          p.noStroke();
          for (let i = 0; i < instructions.length; i++) {
            p.text(instructions[i], padding * 2, padding * 2 + i * lineHeight);
          }
          p.pop();


          if (p5InstanceRef.current && p5InstanceRef.current._frameRate) {
            p5InstanceRef.current._actualFrameRate = p.frameRate();
            p5InstanceRef.current._frameCount = p.frameCount;
            p5InstanceRef.current._lastFrameTime = performance.now();
          }
          

          setPlayerDebugInfo({
            virtualX: player.position.virtualX,
            virtualY: player.position.virtualY,
            screenX: player.position.screenX,
            screenY: player.position.screenY
          });


          const currentHealth = player.currentHealth;
          const maxHealth = player.maxHealth;
          

          setPlayerHealth({ current: currentHealth, max: maxHealth });
          

          if (currentHealth <= 0 && !p._showGameOver) {
            setShowGameOver(true);
            console.log('💀 Player died, showing game over screen');
          }
          
        };
        



        p.mouseWheel = (event: WheelEvent) => {

          if (event.ctrlKey) {

            event.preventDefault();
            

            const zoomSpeed = Math.max(1, GAME_CONSTANTS.MAP.GRID.CELL_SIZE * 0.05);
            

            if (event.deltaY > 0) {

              const newCellSize = Math.max(20, GAME_CONSTANTS.MAP.GRID.CELL_SIZE - zoomSpeed);
              GAME_CONSTANTS.MAP.GRID.CELL_SIZE = newCellSize;
            } else {

              const newCellSize = Math.min(3200, GAME_CONSTANTS.MAP.GRID.CELL_SIZE + zoomSpeed);
              GAME_CONSTANTS.MAP.GRID.CELL_SIZE = newCellSize;
            }
            

            player.updateVirtualPosition();
            enemyManager.getEnemies().forEach(enemy => enemy.updateVirtualPosition());
            projectileManager.updateVirtualPositions(GAME_CONSTANTS.MAP.GRID.CELL_SIZE);
            

            lastMapSize = null;
          }
        };


        p.windowResized = () => {
          p.resizeCanvas(window.innerWidth, window.innerHeight);

          lastMapSize = null;
          lastCanvasWidth = 0;
          lastCanvasHeight = 0;
        };


        p.mousePressed = (event: MouseEvent) => {

          if (p._showGameOver) {
            return;
          }
          
          p.focused = true;


          const canvasElement = canvasRef.current;
          if (!canvasElement) return;
          

          const target = event.target as Element;
          if (!canvasElement.contains(target)) {

            return;
          }


          //console.log(p.mouseX , p.mouseY);


          const dx = p.mouseX - p.width / 2;
          const dy = p.mouseY - p.height / 2;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 0) {

            const directionX = dx / distance;
            const directionY = dy / distance;
            

            const getNearestEnemy = () => {
              const enemies = enemyManager.getEnemies();
              if (!enemies.length) return null;
              let minDist = Infinity, nearest = null;
              for (const enemy of enemies) {
                const enemyGridPos = enemy.getGridPosition();
                const playerGridPos = player.getGridPosition();
                const dx = enemyGridPos.x - playerGridPos.x;
                const dy = enemyGridPos.y - playerGridPos.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < minDist) {
                  minDist = dist;
                  nearest = enemy;
                }
              }

              if (nearest) {
                const enemyGridPos = nearest.getGridPosition();
                return {
                  gridX: enemyGridPos.x,
                  gridY: enemyGridPos.y
                };
              }
              return null;
            };


            let bulletBuilder;
            if (p._currentBulletType === 'arrow') {
              bulletBuilder = ProjectileFactory.createArrowBulletBuilder(getNearestEnemy);
            } else {
              bulletBuilder = ProjectileFactory.createBulletBuilder(projectileManager);
            }

            const playerGridPos = player.getGridPosition();
            const bulletStartX = playerGridPos.x;
            const bulletStartY = playerGridPos.y;
            
            const projectile = bulletBuilder.buildProjectile(
              { x: bulletStartX, y: bulletStartY },
              { x: directionX, y: directionY }
            );
            

            projectile.updateVirtualPosition(GAME_CONSTANTS.MAP.GRID.CELL_SIZE);
            projectile.updateVelocity(GAME_CONSTANTS.MAP.GRID.CELL_SIZE);
            

            projectileManager.addProjectile(projectile);
          }
          // }
        };
        

      };


      p5InstanceRef.current = new p5(sketch);
      setP5Instance(p5InstanceRef.current);
      

      if (p5InstanceRef.current) {
        p5InstanceRef.current._currentBulletType = currentBulletType;
      }
    };

    loadP5();


    return () => {
      console.log('🛑 GameCanvas component unmounting, starting resource cleanup...');
      
      if (enemySpawnInterval) {
        clearInterval(enemySpawnInterval);
        enemySpawnInterval = null;
      }


      if (p5InstanceRef.current) {
        try {
          p5InstanceRef.current.remove();
          p5InstanceRef.current = null;
          setP5Instance(null);
        } catch (error) {
          console.error('❌ Error cleaning P5 instance:', error);
        }
      }
      

      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      

      try {
        console.log('🛑 Cleaning MIDI player...');
        stopMidiSample();
      } catch (error) {
        console.error('❌ Error cleaning MIDI player:', error);
      }
      
      try {
        console.log('🛑 Cleaning sound engine...');
        cleanupSoundManager();
      } catch (error) {
        console.error('❌ Error cleaning sound engine:', error);
      }
      
      console.log('🛑 GameCanvas resource cleanup completed');
    };
  }, [isClient]);

  return (
    <div className="relative w-full h-full">
      <div ref={canvasRef} className="w-full h-full" />
      <PerformanceMonitor isVisible={showPerformanceMonitor} p5Instance={p5Instance} />
      <PlayerDebugPanel 
        isVisible={showPlayerDebug}
        playerVirtualX={playerDebugInfo.virtualX}
        playerVirtualY={playerDebugInfo.virtualY}
        playerScreenX={playerDebugInfo.screenX}
        playerScreenY={playerDebugInfo.screenY}
        currentBulletType={currentBulletType}
      />
      <CompletedSubtopicsPanel 
        isVisible={showCompletedSubtopics}
        completedSubtopics={localCompletedSubtopics}
        onSubtopicsUpdate={handleSubtopicsUpdate}
      />
      <MusicPlayer userName={userName} completedSubtopics={localCompletedSubtopics} />
      <GameOver 
        isVisible={showGameOver}
        onResurrect={handleResurrect}
        playerHealth={playerHealth.current}
        maxHealth={playerHealth.max}
      />
    </div>
  );
};

export default GameCanvas; 