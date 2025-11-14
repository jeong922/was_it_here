import DashboardView from '../view/DashboardView';
import type { IGameModel } from '../model/GameModel';
import type { IGameView } from '../view/GameView';
import RulesView from '../view/RulesView';
import BoardController from './BoardController';
import BoardModel from '../model/BoardModel';
import BoardView from '../view/BoardView';
import DashboardController from './DashboardController';
import ResultView from '../view/ResultView';
import ResultController from './ResultController';

class GameController {
  root: HTMLElement;
  gameView: IGameView;
  gameModel: IGameModel;

  constructor(root: HTMLElement, gameView: IGameView, gameModel: IGameModel) {
    this.root = root;
    this.gameView = gameView;
    this.gameModel = gameModel;
    this.init();
  }

  private init() {
    const gameElement = this.gameView.render();
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
    this.gameModel.startStage();
    rules.getElement().remove();

    const dashboardView = new DashboardView();
    const dashboardController = new DashboardController(dashboardView, this.gameModel);

    const resultView = new ResultView();
    const resultController = new ResultController(this.gameModel, resultView);

    const boardModel = new BoardModel(this.gameModel.currentStage);
    const boardView = new BoardView();
    const boardController = new BoardController(boardModel, boardView, this.gameModel);

    const gameContainer = document.createElement('div');
    gameContainer.className = 'game-container';
    this.root.append(resultController.getElement());
    gameContainer.append(dashboardController.getElement(), boardController.getElement());

    container.append(gameContainer);

    setTimeout(() => {
      this.gameModel.playGame();
      boardController.showUserBoard();
      dashboardController.startTimer();
    }, 3000);
  }
}

export default GameController;
