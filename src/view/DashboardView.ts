import BaseView from './BaseView';

class DashboardView extends BaseView {
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

  getElement(): HTMLElement {
    return this.element;
  }
}

export default DashboardView;
