import BaseView, { type IBaseView } from './BaseView';

export interface IRulesView extends IBaseView {
  onGameStart(handler: () => void): void;
}
class RulesView extends BaseView implements IRulesView {
  private startHandler?: () => void;

  constructor() {
    super('div', 'game-rules');
    this.render();
    this.attachEventListeners();
  }

  private render() {
    this.setTemplate(`
      <span class="rules-title">게임 방법</span>
      <ul>
        <li>3초 동안 보드에 표시되는 정답 위치를 기억하세요.</li>
        <li>표시가 사라지면 제한 시간 30초 동안 정답 칸을 모두 클릭하세요.</li>
        <li>오답 클릭 시 기회가 1 감소합니다. 총 기회는 3번 입니다.</li>
        <li>모든 기회를 잃거나 시간안에 정답 칸을 모두 찾지 못하면 실패하게 됩니다.</li>
        <li>정답 칸을 모두 찾으면 다음 스테이지로 넘어갈 수 있습니다.</li>
        <li>총 20 스테이지로 구성됩니다.</li>
      </ul>
      <button class="game-start">시작하기</button>
    `);
  }

  private attachEventListeners(): void {
    this.element.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.classList.contains('game-start')) return;

      this.startHandler?.();
    });
  }

  onGameStart(handler: () => void) {
    this.startHandler = handler;
  }
}

export default RulesView;
