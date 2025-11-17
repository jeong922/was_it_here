import { formatTime } from '../utils/formatTime';
import BaseView, { type IBaseView } from './BaseView';

export interface IResultView extends IBaseView {
  displayResultUI(state: 'stageClear' | 'gameOver' | 'end'): void;
  showModal(): void;
  hideModal(): void;
  setResultTimer(seconds: number): void;
  setResultLives(lives: number): void;
  setResultStage(stage: number): void;
  onNext(handler: () => void): void;
}

class ResultView extends BaseView implements IResultView {
  private nextHandler?: () => void;

  constructor() {
    super('div', 'result-modal');
    this.render();
    this.attachEventListeners();
  }

  private render(): void {
    this.setTemplate(this.createResult());
  }

  private createResult(): string {
    return `
      <div class="result">
        <span class="stage-state">성공</span>
        <div class="result-info">
          <div class="info-item stage-info">
            <span class="label">스테이지</span>
            <span class="stage value">1</span>
          </div>

          <div class="info-item time-info">
            <span class="label">남은 시간</span>
            <span class="time value">00:30</span>
          </div>

          <div class="info-item lives-info">
            <span class="label">남은 기회</span>
            <div class="lives value">${this.renderLivesIcons(3)}</div>
          </div>
        </div>
        <button class="next-button">다음 스테이지</button>
      </div>
    `;
  }

  displayResultUI(state: 'stageClear' | 'gameOver' | 'end'): void {
    const stageStateElement = this.element.querySelector('.stage-state');
    const button = this.element.querySelector('.next-button');
    if (!stageStateElement || !button) return;

    const stateTextMap = {
      stageClear: { text: '성공', button: '다음 스테이지' },
      gameOver: { text: '실패', button: '메인 화면으로' },
      end: { text: '게임 종료', button: '메인 화면으로' },
    } as const;

    const { text, button: btnText } = stateTextMap[state];
    stageStateElement.textContent = text;
    button.textContent = btnText;
  }

  setResultTimer(seconds: number): void {
    const timerElement = this.element.querySelector('.time');
    if (timerElement) {
      timerElement.textContent = `${formatTime(seconds)}`;
    }
  }

  setResultLives(lives: number): void {
    const livesElement = this.element.querySelector('.lives');
    if (livesElement) {
      livesElement.innerHTML = this.renderLivesIcons(lives);
    }
  }

  setResultStage(stage: number): void {
    const stageElement = this.element.querySelector('.stage');
    if (stageElement) {
      stageElement.textContent = `${stage}`;
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

  showModal(): void {
    this.element.classList.add('active');
  }

  hideModal(): void {
    this.element.classList.remove('active');
  }

  private attachEventListeners(): void {
    this.element.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.classList.contains('next-button')) return;

      this.nextHandler?.();
    });
  }

  onNext(handler: () => void) {
    this.nextHandler = handler;
  }
}

export default ResultView;
