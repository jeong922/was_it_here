import DashboardView from '../view/DashboardView';
import type { GameEventPayloads, IGameModel, IObserver } from '../model/GameModel';
import type { IGameView } from '../view/GameView';
import RulesView from '../view/RulesView';
import BoardController, { type IBoardController } from './BoardController';
import BoardModel from '../model/BoardModel';
import BoardView from '../view/BoardView';
import DashboardController, { type IDashboardController } from './DashboardController';
import ResultView from '../view/ResultView';
import ResultController, { type IResultController } from './ResultController';
import type { GameEventType } from '../types/game';
import { setDelay } from '../utils/delay';

class GameController implements IObserver {
  private readonly STAGE_START_DELAY = 3000;
  root: HTMLElement;
  gameView: IGameView;
  gameModel: IGameModel;
  private boardController?: IBoardController;
  private dashboardController?: IDashboardController;
  private resultController?: IResultController;
  private gameContainer!: HTMLElement;
  private gameElement!: HTMLElement;

  constructor(root: HTMLElement, gameView: IGameView, gameModel: IGameModel) {
    this.root = root;
    this.gameView = gameView;
    this.gameModel = gameModel;

    this.gameModel.subscribe(this);

    this.init();
  }

  private init() {
    this.gameElement = this.gameView.render();
    this.root.append(this.gameElement);

    const rules = new RulesView();
    this.gameElement.append(rules.getElement());

    this.bindRulesEvents(rules, this.gameElement);
  }

  update<T extends GameEventType>(type: T, payload: GameEventPayloads[T]): void {
    if (type === 'stateChanged') {
      const state = (payload as GameEventPayloads['stateChanged']).state;
      if (state === 'ready') {
        this.returnToMainScreen();
      }
      return;
    }

    if (type === 'stageChanged') {
      const stage = (payload as GameEventPayloads['stageChanged']).stage;
      this.loadBoardForNewStage(stage);

      return;
    }
  }

  private createGameComponents() {
    if (this.dashboardController) return;

    const dashboardView = new DashboardView();
    this.dashboardController = new DashboardController(dashboardView, this.gameModel);

    const resultView = new ResultView();
    this.resultController = new ResultController(this.gameModel, resultView);
  }

  private startGame(container: HTMLElement, rules: RulesView) {
    rules.getElement().remove();

    this.createGameComponents();

    this.gameContainer = document.createElement('div');
    this.gameContainer.className = 'game-container';

    this.root.append(this.resultController!.getElement());
    container.append(this.gameContainer);

    this.gameContainer.append(this.dashboardController!.getElement());

    this.gameModel.startStage();

    this.loadNewBoardAndStartStage(this.gameModel.currentStage);
  }

  private loadNewBoardAndStartStage(stage: number) {
    if (this.boardController) {
      this.boardController.getElement().remove();
    }

    const boardModel = new BoardModel(stage);
    const boardView = new BoardView();
    this.boardController = new BoardController(boardModel, boardView, this.gameModel);

    this.gameContainer.append(this.boardController.getElement());

    this.dashboardController?.updateDashboard();

    this.startStageSequence();
  }

  private loadBoardForNewStage(stage: number) {
    this.loadNewBoardAndStartStage(stage);
  }

  private returnToMainScreen() {
    this.gameContainer?.remove();
    this.resultController?.getElement()?.remove();

    const rules = new RulesView();
    this.gameElement.append(rules.getElement());

    this.bindRulesEvents(rules, this.gameElement);
  }

  private bindRulesEvents(rules: RulesView, container: HTMLElement) {
    rules.onGameStart(() => {
      this.startGame(container, rules);
    });
  }

  private startStageSequence() {
    setDelay(() => {
      this.gameModel.playGame();
      this.boardController!.showUserBoard();
      this.dashboardController!.startTimer();
    }, this.STAGE_START_DELAY);
  }
}

export default GameController;
