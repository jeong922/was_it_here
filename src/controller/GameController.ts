import DashboardView from '../view/DashboardView';
import type { IGameModel } from '../model/GameModel';
import type { IGameView } from '../view/GameView';
import RulesView from '../view/RulesView';
import BoardController from './BoardController';
import BoardModel from '../model/BoardModel';
import BoardView from '../view/BoardView';
import DashboardController from './DashboardController';

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
    const dashboardController = new DashboardController(dashboard, this.game);

    const boardModel = new BoardModel(this.game.currentStage);
    const boardView = new BoardView();
    const boardController = new BoardController(boardModel, boardView);

    const gameContainer = document.createElement('div');
    gameContainer.className = 'game-container';
    gameContainer.append(dashboard.getElement(), boardController.getElement());

    container.append(gameContainer);

    setTimeout(() => {
      this.game.state = 'playing';
      boardController.showUserBoard();
      dashboardController.startTimer();
    }, 3000);
  }
}

export default GameController;
