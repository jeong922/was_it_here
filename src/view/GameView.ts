export interface IGameView {
  render(): HTMLElement;
}

class GameView implements IGameView {
  private root: HTMLElement;

  constructor() {
    this.root = document.createElement('main');
    this.root.className = 'game';
  }

  render(): HTMLElement {
    this.root.innerHTML = `<h1 class="title">이건가...?🤔</h1>`;
    return this.root;
  }

  getRoot(): HTMLElement {
    return this.root;
  }
}

export default GameView;
