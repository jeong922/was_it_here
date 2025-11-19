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
  gameOver(): void;
  clearStage(): void;
  startNextStage(): void;
  resetGame(): void;
  gameClear(): void;
}
class GameModel implements IGameModel {
  private observers: IObserver[] = [];
  readonly MAX_STAGE = 20;
  readonly MIN_STAGE = 1;
  readonly LIVES = 3;
  readonly TIME = 30;
  state: GameState = 'ready';
  currentStage: number = this.MIN_STAGE;
  timeLeft: number = this.TIME;
  lives: number = this.LIVES;

  subscribe(observer: IObserver): void {
    this.observers.push(observer);
  }

  unsubscribe(observer: IObserver): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notify<T extends GameEventType>(type: T, payload: GameEventPayloads[T]): void {
    this.observers.forEach((observer) => observer.update(type, payload));
  }

  startNextStage(): void {
    if (this.currentStage === this.MAX_STAGE) {
      return;
    }

    this.currentStage++;
    this.timeLeft = this.TIME;

    this.notify('stageChanged', { stage: this.currentStage });
    this.notify('timeChanged', { timeLeft: this.TIME });

    this.startStage();
  }

  resetGame(): void {
    this.currentStage = this.MIN_STAGE;
    this.timeLeft = this.TIME;
    this.lives = this.LIVES;
    this.state = 'ready';

    this.notify('stageChanged', { stage: this.currentStage });
    this.notify('timeChanged', { timeLeft: this.timeLeft });
    this.notify('livesChanged', { lives: this.lives });
    this.notify('stateChanged', { state: this.state });
  }

  startStage(): void {
    this.state = 'showAnswer';
    this.notify('stateChanged', { state: this.state });
  }

  gameOver(): void {
    this.state = 'gameOver';
    this.notify('stateChanged', { state: this.state });
  }

  playGame(): void {
    this.state = 'playing';
    this.notify('stateChanged', { state: this.state });
  }

  clearStage(): void {
    this.state = 'stageClear';
    this.notify('stateChanged', { state: this.state });

    if (this.currentStage >= this.MAX_STAGE) {
      this.gameClear();
      return;
    }
  }

  gameClear(): void {
    this.state = 'end';
    this.notify('stateChanged', { state: this.state });
  }

  decreaseTime(): void {
    if (this.timeLeft > 0) {
      this.timeLeft -= 1;
      this.notify('timeChanged', { timeLeft: this.timeLeft });
    }
  }

  decreaseLives(): void {
    if (this.lives <= 0) {
      return;
    }

    this.lives -= 1;
    this.notify('livesChanged', { lives: this.lives });

    if (this.lives === 0) {
      this.gameOver();
    }
  }
}

export default GameModel;
