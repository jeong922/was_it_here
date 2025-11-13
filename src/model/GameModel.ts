import type { GameState } from '../types/game';

export interface IGameModel {
  state: GameState;
  currentStage: number;
  timeLeft: number;
  lives: number;
  startStage(): void;
  decreaseTime(): void;
}
class GameModel implements IGameModel {
  // 게임 상태 관련 처리
  state: GameState = 'ready';
  currentStage: number = 1;
  timeLeft: number = 30;
  lives: number = 3;

  startStage(): void {
    this.state = 'showAnswer';
  }

  decreaseTime(): void {
    if (this.timeLeft > 0) {
      this.timeLeft -= 1;
    }
  }
}

export default GameModel;
