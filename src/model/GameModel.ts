import type { GameEventType, GameState } from '../types/game';

export interface GameEventPayloads {
  stateChanged: { state: GameState };
  timeChanged: { timeLeft: number };
  livesChanged: { lives: number };
  stageChanged: { stage: number };
}
export interface IObserver {
  update<T extends GameEventType>(type: T, payload: GameEventPayloads[T]): void;
}
export interface IGameModel {
  subscribe(observer: IObserver): void;
  unsubscribe(observer: IObserver): void;
  notify<T extends GameEventType>(type: T, payload: GameEventPayloads[T]): void;
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
  private observers: IObserver[] = [];
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

  notify<T extends GameEventType>(type: T, payload: GameEventPayloads[T]): void {
    this.observers.forEach((observer) => observer.update(type, payload));
    console.log(this.observers);
  }

  startStage(): void {
    this.state = 'showAnswer';
    this.notify('stateChanged', { state: this.state });
  }

  gameOver() {
    this.state = 'gameOver';
    this.notify('stateChanged', { state: this.state });
  }

  playGame() {
    this.state = 'playing';
    this.notify('stateChanged', { state: this.state });
  }

  decreaseTime(): void {
    if (this.timeLeft > 0) {
      this.timeLeft -= 1;
      this.notify('timeChanged', { timeLeft: this.timeLeft });
    }
  }

  decreaseLives() {
    if (this.lives <= 0) {
      return;
    }

    this.lives -= 1;
    this.notify('livesChanged', { lives: this.lives });

    if (this.lives === 0) {
      this.notify('stateChanged', { state: this.state });
    }
  }
}

export default GameModel;
