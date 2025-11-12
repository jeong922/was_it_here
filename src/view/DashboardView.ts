class DashboardView {
  dashboardElement: HTMLElement;

  constructor() {
    this.dashboardElement = this.createDashboard();
  }

  private createDashboard(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'game-dashboard';

    container.innerHTML = `
        <div class="game-stage">스테이지 1</div>
        <div class="game-timer">00:00</div>
        <div class="game-lives">3회</div>
    `;
    return container;
  }

  getElement(): HTMLElement {
    return this.dashboardElement;
  }
}

export default DashboardView;
