import DashboardView from '../view/DashboardView';
import type { GameEventPayloads, IGameModel, IObserver } from '../model/GameModel';
import type { IGameView } from '../view/GameView';
import RulesView from '../view/RulesView';
import BoardController from './BoardController';
import BoardModel from '../model/BoardModel';
import BoardView from '../view/BoardView';
import DashboardController from './DashboardController';
import ResultView from '../view/ResultView';
import ResultController from './ResultController';
import type { GameEventType } from '../types/game';

class GameController implements IObserver {
  root: HTMLElement;
  gameView: IGameView;
  gameModel: IGameModel;

  private boardController?: BoardController;
  private dashboardController?: DashboardController;
  private resultController?: ResultController;
  private gameContainer!: HTMLElement;

  constructor(root: HTMLElement, gameView: IGameView, gameModel: IGameModel) {
    this.root = root;
    this.gameView = gameView;
    this.gameModel = gameModel;

    this.gameModel.subscribe(this);

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

  update<T extends GameEventType>(type: T, payload: GameEventPayloads[T]): void {
    if (type === 'stateChanged') {
      const state = (payload as GameEventPayloads['stateChanged']).state;
      if (state === 'ready') {
        this.returnToMainScreen();
      }
    }

    if (type === 'stageChanged') {
      const stage = (payload as GameEventPayloads['stageChanged']).stage;
      this.loadBoardForNewStage(stage);
    }
  }

  private startGame(container: HTMLElement, rules: RulesView) {
    this.gameModel.startStage();
    rules.getElement().remove();

    const dashboardView = new DashboardView();
    this.dashboardController = new DashboardController(dashboardView, this.gameModel);

    const resultView = new ResultView();
    this.resultController = new ResultController(this.gameModel, resultView);

    const boardModel = new BoardModel(this.gameModel.currentStage);
    const boardView = new BoardView();
    this.boardController = new BoardController(boardModel, boardView, this.gameModel);

    this.gameContainer = document.createElement('div');
    this.gameContainer.className = 'game-container';

    this.root.append(this.resultController.getElement());
    this.gameContainer.append(this.dashboardController.getElement(), this.boardController.getElement());

    container.append(this.gameContainer);

    setTimeout(() => {
      this.gameModel.playGame();
      this.boardController!.showUserBoard();
      this.dashboardController!.startTimer();
    }, 3000);
  }

  private loadBoardForNewStage(stage: number) {
    if (this.boardController) {
      this.boardController.getElement().remove();
    }

    const boardModel = new BoardModel(stage);
    const boardView = new BoardView();
    this.boardController = new BoardController(boardModel, boardView, this.gameModel);

    this.gameContainer.append(this.boardController.getElement());

    this.dashboardController?.updateDashboard();

    setTimeout(() => {
      this.gameModel.playGame();
      this.boardController!.showUserBoard();
      this.dashboardController!.startTimer();
    }, 3000);
  }

  private returnToMainScreen() {
    this.gameContainer?.remove();
    this.resultController?.getElement()?.remove();

    const gameElement = this.root.querySelector('.game') as HTMLElement;
    const rules = new RulesView();
    gameElement.append(rules.getElement());

    rules
      .getElement()
      .querySelector('.game-start')
      ?.addEventListener('click', () => {
        this.startGame(gameElement, rules);
      });
  }
}

export default GameController;
