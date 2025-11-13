import type { GameState } from '../types/game';

export interface IObserver {
  update(data?: any): void;
}
export interface IGameModel {
  subscribe(observer: IObserver): void;
  unsubscribe(observer: IObserver): void;
  notify(): void;
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
  // 관찰자 목록
  private observers: IObserver[] = [];
  // 게임 상태 관련 처리
  state: GameState = 'ready';
  currentStage: number = 1;
  timeLeft: number = 30;
  lives: number = 3;

  subscribe(observer: IObserver): void {
    this.observers.push(observer);
  }

  unsubscribe(observer: IObserver): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notify(): void {
    this.observers.forEach((observer) => observer.update());
  }

  startStage(): void {
    this.state = 'showAnswer';
    this.notify();
  }

  gameOver() {
    this.state = 'gameOver';
    this.notify();
  }

  playGame() {
    this.state = 'playing';
    this.notify();
  }

  decreaseTime(): void {
    if (this.timeLeft > 0) {
      this.timeLeft -= 1;
      this.notify();
    }
  }

  decreaseLives() {
    if (this.lives <= 0) {
      return;
    }

    this.lives -= 1;
    this.notify();

    if (this.lives === 0) {
      this.gameOver();
    }
  }
}

export default GameModel;
