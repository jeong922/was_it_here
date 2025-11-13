import type { IGameModel } from '../model/GameModel';
import type DashboardView from '../view/DashboardView';

interface IDashboardController {
  startTimer(): void;
}

class DashboardController implements IDashboardController {
  private view: DashboardView;
  private model: IGameModel;
  private timerId?: number;

  constructor(view: DashboardView, model: IGameModel) {
    this.view = view;
    this.model = model;
    this.updateDashboard();
  }

  startTimer(): void {
    if (this.timerId) {
      return;
    }

    this.timerId = setInterval(() => {
      if (this.model.timeLeft > 0) {
        this.model.decreaseTime();
        this.view.updateTimer(this.model.timeLeft);
      } else {
        this.stopTimer();
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = undefined;
    }
  }

  private updateDashboard(): void {
    this.view.updateStage(this.model.currentStage);
    this.view.updateTimer(this.model.timeLeft);
    this.view.updateLives(this.model.lives);
  }
}

export default DashboardController;
