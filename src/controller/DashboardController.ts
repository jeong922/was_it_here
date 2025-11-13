import type { IGameModel, IObserver } from '../model/GameModel';
import type { IDashboardView } from '../view/DashboardView';

export interface IDashboardController extends IObserver {
  startTimer(): void;
  updateDashboard(): void;
}

class DashboardController implements IDashboardController {
  private view: IDashboardView;
  private model: IGameModel;
  private timerId?: number;

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

  update(): void {
    this.updateDashboard();
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
