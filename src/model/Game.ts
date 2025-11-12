import type { GameState } from '../types/game';

export interface IGameModel {
  state: GameState;
  currentStage: number;
  timeLeft: number;
  lives: number;
  startStage: () => void;
}
class Game implements IGameModel {
  // 게임 상태 관련 처리
  state: GameState = 'ready';
  currentStage: number = 1;
  timeLeft: number = 30;
  lives: number = 3;

  startStage(): void {
    this.state = 'playing';
  }
}

export default Game;
