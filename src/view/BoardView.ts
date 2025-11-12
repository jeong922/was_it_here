import BaseView from './BaseView';

class BoardView extends BaseView {
  constructor() {
    super('div', 'game-board');
    this.render();
  }

  private render() {
    this.setTemplate(`
      <div>여기 게임보드 들어감</div>
    `);
  }

  createBoard(): void {
    const gridContainer = this.element.querySelector('.game-board');

    if (!gridContainer) return;

    // 보드 데이터 불러와서 처리
  }
}

export default BoardView;
