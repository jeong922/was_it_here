import { formatTime } from '../utils/formatTime';
import BaseView, { type IBaseView } from './BaseView';

export interface IResultView extends IBaseView {
  displayResultUI(state: 'stageClear' | 'gameOver' | 'end'): void;
  showModal(): void;
  hideModal(): void;
  displayTimer(seconds: number): void;
  displayLives(lives: number): void;
  displayStage(stage: number): void;
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
            <span class="lives value">3번</span>
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

  displayTimer(seconds: number): void {
    const timerElement = this.element.querySelector('.time');
    if (timerElement) {
      timerElement.textContent = `${formatTime(seconds)}`;
    }
  }

  displayLives(lives: number): void {
    const livesElement = this.element.querySelector('.lives');
    if (livesElement) {
      livesElement.textContent = `${lives}회`;
    }
  }

  displayStage(stage: number): void {
    const stageElement = this.element.querySelector('.stage');
    if (stageElement) {
      stageElement.textContent = `${stage}`;
    }
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
