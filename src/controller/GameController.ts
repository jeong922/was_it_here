import BoardView from '../view/BoardView';
import DashboardView from '../view/DashboardView';
import type { IGameModel } from '../model/Game';
import type { IGameView } from '../view/GameView';
import RulesView from '../view/RulesView';

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

  private init() {
    const gameElement = this.view.render();
    this.root.append(gameElement);

    const rules = new RulesView();
    gameElement.append(rules.getElement());

    rules
      .getElement()
      .querySelector('.game-start')
      ?.addEventListener('click', () => {
        this.startGame(gameElement, rules);
      });
  }

  private startGame(container: HTMLElement, rules: RulesView) {
    this.game.startStage();
    rules.getElement().remove();

    const dashboard = new DashboardView();
    const board = new BoardView();

    const gameContainer = document.createElement('div');
    gameContainer.className = 'game-container';
    gameContainer.append(dashboard.getElement(), board.getElement());

    container.append(gameContainer);
  }
}

export default GameController;
