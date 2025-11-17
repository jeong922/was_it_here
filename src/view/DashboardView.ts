import { formatTime } from '../utils/formatTime';
import BaseView, { type IBaseView } from './BaseView';

export interface IDashboardView extends IBaseView {
  setTimer(seconds: number): void;
  setLives(lives: number): void;
  setStage(stage: number): void;
}
class DashboardView extends BaseView implements IDashboardView {
  constructor() {
    super('div', 'game-dashboard');
    this.render();
  }

  private render() {
    this.setTemplate(`
      <div class="game-stage">스테이지 1</div>
      <div class="game-timer">00:00</div>
      <div class="game-lives">3회</div>
    `);
  }

  setTimer(seconds: number): void {
    const timerElement = this.element.querySelector('.game-timer');
    if (timerElement) {
      timerElement.textContent = formatTime(seconds);
    }
  }

  setLives(lives: number): void {
    const livesElement = this.element.querySelector('.game-lives');
    if (livesElement) {
      livesElement.textContent = `${lives}회`;
    }
  }

  setStage(stage: number): void {
    const stageElement = this.element.querySelector('.game-stage');
    if (stageElement) {
      stageElement.textContent = `스테이지 ${stage}`;
    }
  }
}

export default DashboardView;
