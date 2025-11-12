import BoardView from '../view/BoardView';
import DashboardView from '../view/DashboardView';
import type { IGameModel } from '../model/Game';
import type { IGameView } from '../view/GameView';

class GameController {
  root: HTMLElement;
  view: IGameView;
  game: IGameModel;

  constructor(root: HTMLElement, view: IGameView, game: IGameModel) {
    this.root = root;
    this.view = view;
    this.game = game;
    this.init();
  }

  init(): void {
    this.showScreen();
    this.addEvent();
  }

  showScreen(): void {
    this.root.innerHTML = this.view.render(this.game.state);
  }

  addEvent(): void {
    const startBtn = this.root.querySelector('.game-start');
    startBtn?.addEventListener('click', () => {
      this.handleStartClick();
    });
  }

  // 여기 수정을 좀 해야 할듯.. 일단 때려넣어..
  handleStartClick(): void {
    this.game.startStage();
    this.showScreen();
    this.addEvent();
    const boardView = new BoardView();
    const dashboardView = new DashboardView();
    const board = boardView.getElement();
    const dashboard = dashboardView.getElement();

    const container = this.root.querySelector('.game-container');
    if (!container) return;

    container.append(dashboard, board);
  }
}

export default GameController;
