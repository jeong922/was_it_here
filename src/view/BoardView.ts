class BoardView {
  private boardElement: HTMLElement;

  constructor() {
    this.boardElement = this.createBoardContainer();
  }

  createBoardContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'game-board';

    container.innerHTML = `
      <div>여기 게임보드 들어감</div>
    `;

    return container;
  }

  createBoard(): void {
    const gridContainer = this.boardElement.querySelector('.game-board');

    if (!gridContainer) return;

    // 보드 데이터 불러와서 처리
  }

  getElement(): HTMLElement {
    return this.boardElement;
  }
}

export default BoardView;
