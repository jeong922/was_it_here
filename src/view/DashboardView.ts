import { setDelay } from '../utils/delay';
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
      <div class="game-stage"></div>
      <div class="game-timer"></div>
      <div class="game-lives"></div>
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
    if (!livesElement) return;

    const currentHearts = livesElement.querySelectorAll('.lives-icon');
    const currentCount = currentHearts.length;

    if (lives < currentCount) {
      const lostCount = currentCount - lives;
      for (let i = 0; i < lostCount; i++) {
        const lostHeart = currentHearts[i] as HTMLElement;
        lostHeart.classList.add('fading-out');
      }

      setDelay(() => {
        livesElement.innerHTML = this.renderLivesIcons(lives);
      }, 400);
    } else if (lives > currentCount) {
      livesElement.innerHTML = this.renderLivesIcons(lives);
    }
  }

  setStage(stage: number): void {
    const stageElement = this.element.querySelector('.game-stage');
    if (stageElement) {
      stageElement.textContent = `스테이지 ${stage}`;
    }
  }

  private renderLivesIcons(lives: number) {
    const heartIcon = `
      <svg class="lives-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 576">
        <path fill="currentColor" d="M305 151.1L320 171.8L335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1L576 231.7C576 343.9 436.1 474.2 363.1 529.9C350.7 539.3 335.5 544 320 544C304.5 544 289.2 539.4 276.9 529.9C203.9 474.2 64 343.9 64 231.7L64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1z"/>
      </svg>
    `;

    return heartIcon.repeat(lives);
  }
}

export default DashboardView;
