import { formatTime } from '../utils/formatTime';
import BaseView, { type IBaseView } from './BaseView';

export interface IResultView extends IBaseView {
  updateStageState(state: 'stageClear' | 'gameOver' | 'end'): void;
  showModal(): void;
  hideModal(): void;
  updateTimer(seconds: number): void;
  updateLives(lives: number): void;
  updateStage(stage: number): void;
}

class ResultView extends BaseView implements IResultView {
  constructor() {
    super('div', 'result-modal');
    this.render();
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

  updateStageState(state: 'stageClear' | 'gameOver' | 'end'): void {
    const stageStateElement = this.element.querySelector('.stage-state');
    if (!stageStateElement) return;

    switch (state) {
      case 'stageClear':
        stageStateElement.textContent = '성공';
        break;
      case 'gameOver':
        stageStateElement.textContent = '실패';
        break;
      case 'end':
        stageStateElement.textContent = '게임 종료';
        break;
    }
  }

  updateTimer(seconds: number): void {
    const timerElement = this.element.querySelector('.time');
    if (timerElement) {
      timerElement.textContent = `${formatTime(seconds)}`;
    }
  }

  updateLives(lives: number): void {
    const livesElement = this.element.querySelector('.lives');
    if (livesElement) {
      livesElement.textContent = `${lives}회`;
    }
  }

  updateStage(stage: number): void {
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
}

export default ResultView;
