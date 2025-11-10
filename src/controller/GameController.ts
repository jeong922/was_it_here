import type { IGameView } from '../view/GameView';

class GameController {
  root: HTMLElement;
  view: IGameView;

  constructor(root: HTMLElement, view: IGameView) {
    this.root = root;
    this.view = view;
    this.init();
  }

  init() {
    this.showStartScreen();
  }

  showStartScreen() {
    this.root.innerHTML = this.view.render();
  }
}

export default GameController;
