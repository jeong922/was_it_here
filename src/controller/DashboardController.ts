import type { GameEventPayloads, IGameModel, IObserver } from '../model/GameModel';
import type { GameEventType } from '../types/game';
import type { IDashboardView } from '../view/DashboardView';

export interface IDashboardController extends IObserver {
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
      console.log(payload.state);
    },
    timeChanged: (payload) => {
      this.view.updateTimer(payload.timeLeft);
    },
    livesChanged: (payload) => {
      this.view.updateLives(payload.lives);
    },
    stageChanged: (payload) => {
      this.view.updateStage(payload.stage);
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
    this.view.updateStage(this.model.currentStage);
    this.view.updateTimer(this.model.timeLeft);
    this.view.updateLives(this.model.lives);
  }
}

export default DashboardController;
