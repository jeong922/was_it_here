import type { GameEventPayloads, IGameModel, IObserver } from '../model/GameModel';
import type { GameEventType } from '../types/game';
import type { IDashboardView } from '../view/DashboardView';

export interface IDashboardController extends IObserver {
  getElement(): HTMLElement;
  startTimer(): void;
  updateDashboard(): void;
}

type GameEventHandler<T extends GameEventType> = (payload: GameEventPayloads[T]) => void;

class DashboardController implements IDashboardController {
  private view: IDashboardView;
  private model: IGameModel;
  private timerId?: number;

  private eventHandlers: {
    [K in GameEventType]: GameEventHandler<K>;
  } = {
    stateChanged: (payload) => {
      const { state } = payload;

      if (state === 'playing') {
        this.startTimer();
      }

      if (state === 'stageClear' || state === 'gameOver' || state === 'end') {
        this.stopTimer();
      }
    },
    timeChanged: (payload) => {
      this.view.setTimer(payload.timeLeft);
    },
    livesChanged: (payload) => {
      this.view.setLives(payload.lives);
    },
    stageChanged: (payload) => {
      this.view.setStage(payload.stage);
    },
  };

  constructor(view: IDashboardView, model: IGameModel) {
    this.view = view;
    this.model = model;
    this.model.subscribe(this);
    this.updateDashboard();
  }

  startTimer(): void {
    if (this.timerId) {
      return;
    }

    this.timerId = setInterval(() => {
      if (this.model.timeLeft > 0) {
        this.model.decreaseTime();
      } else {
        this.stopTimer();
        if (this.model.state === 'playing') {
          this.model.gameOver();
        }
      }
    }, 1000);
  }

  update<T extends GameEventType>(type: T, payload: GameEventPayloads[T]): void {
    const handler = this.eventHandlers[type];
    (handler as GameEventHandler<T>)(payload);
  }

  private stopTimer(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = undefined;
    }
  }

  updateDashboard(): void {
    this.view.setStage(this.model.currentStage);
    this.view.setTimer(this.model.timeLeft);
    this.view.setLives(this.model.lives);
  }

  getElement(): HTMLElement {
    return this.view.getElement();
  }
}

export default DashboardController;
