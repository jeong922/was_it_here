// 게임 타이틀, 게임 설명 UI, 게임 시작 버튼

import type { GameState } from '../types/game';

export interface IGameView {
  render(gameState: GameState): string;
}

class GameView implements IGameView {
  render(gameState: GameState) {
    return `
      <main class="game">
        ${this.makeGameTitle()}
        ${gameState === 'ready' ? this.makeGameRules() : ''}
        ${gameState === 'playing' ? this.makeGameContainer() : ''}
      </main>
    `;
  }

  private makeGameRules() {
    return `
      <div class="game-rules">
      <span class="rules-title">게임 방법</span>
        <ul>
          <li>2초 동안 보드에 표시되는 정답 위치를 기억하세요.</li>
          <li>표시가 사라지면 제한 시간 30초 동안 정답 칸을 모두 클릭하세요.</li>
          <li>오답 클릭 시 기회가 1 감소합니다. 총 기회는 3번 입니다.</li>
          <li>정답 칸 중 랜덤으로 숨겨진 아이템이 있을 수 있습니다.</li>
          <li>정답 칸을 모두 찾으면 다음 스테이지로 넘어갈 수 있습니다.</li>
          <li>총 20 스테이지로 구성됩니다.</li>
        </ul>
        <button class="game-start">시작하기</button>
      </div>
    `;
  }

  private makeGameTitle() {
    return `<h1 class="title">이건가...?🤔</h1>`;
  }

  private makeGameContainer() {
    return `<div class="game-container"></div>`;
  }
}

export default GameView;
