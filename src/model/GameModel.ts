import type { GameState } from '../types/game';

export interface IGameModel {
  state: GameState;
  currentStage: number;
  timeLeft: number;
  lives: number;
  startStage(): void;
  decreaseTime(): void;
  decreaseLives(): void;
  playGame(): void;
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

  gameOver() {
    this.state = 'gameOver';
  }

  playGame() {
    this.state = 'playing';
  }

  decreaseTime(): void {
    if (this.timeLeft > 0) {
      this.timeLeft -= 1;
    }
  }

  decreaseLives() {
    if (this.lives <= 0) {
      return;
    }

    this.lives -= 1;

    if (this.lives === 0) {
      this.gameOver();
    }
  }
}

export default GameModel;
