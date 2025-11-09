class GameController {
  root: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
    this.init();
  }

  init() {
    this.gameStart();
  }

  // 게임 시작
  gameStart() {
    this.root.innerHTML = this.render();
  }

  render() {
    return `
      <main class="game">
        ${this.makeGameTitle()}
        ${this.makeGameRules()}
        ${this.makeStartButton()}
      </main>
    `;
  }

  makeGameRules() {
    return `
      <div class="game-rules">
        <ul>
          <li>2초 동안 보드에 표시되는 정답 위치를 기억하세요.</li>
          <li>표시가 사라지면 제한 시간 30초 동안 정답 칸을 모두 클릭하세요.</li>
          <li>오답 클릭 시 기회가 1 감소합니다. 총 기회는 3번 입니다.</li>
          <li>정답 칸 중 랜덤으로 숨겨진 아이템이 있을 수 있습니다.</li>
          <li>정답 칸을 모두 찾으면 다음 스테이지로 넘어갈 수 있습니다.</li>
          <li>총 20 스테이지로 구성됩니다.</li>
        </ul>
      </div>
    `;
  }

  makeStartButton() {
    return `<button class="game-start">시작하기</button>`;
  }

  makeGameTitle() {
    return `<h1>이건가...?</h1>`;
  }

  // 칸 클릭 관련 처리

  // 게임 종료 결과
}

export default GameController;
