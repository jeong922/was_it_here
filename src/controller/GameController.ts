import RulesController from './RulesController';
import StageController from './StageController';
import DashboardView from '../view/DashboardView';
import RulesView from '../view/RulesView';
import ResultView from '../view/ResultView';
import DashboardController, { type IDashboardController } from './DashboardController';
import ResultController, { type IResultController } from './ResultController';
import type { GameEventPayloads, IGameModel, IObserver } from '../model/GameModel';
import type { IGameView } from '../view/GameView';
import type { GameEventType } from '../types/game';
import type { IRulesController } from './RulesController';
import type { IStageController } from './StageController';

export interface IGameController extends IObserver {
  root: HTMLElement;
  gameView: IGameView;
  gameModel: IGameModel;
}

class GameController implements IGameController {
  root: HTMLElement;
  gameView: IGameView;
  gameModel: IGameModel;

  private dashboardController: IDashboardController | null = null;
  private resultController: IResultController | null = null;
  private rulesController: IRulesController | null = null;
  private stageController: IStageController | null = null;

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

    const rulesView = new RulesView();
    this.rulesController = new RulesController(rulesView, () => {
      this.startGame();
    });

    this.gameElement.append(this.rulesController.getElement());
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
      this.stageController!.startNewStage(stage);
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

  private startGame() {
    this.rulesController!.getElement().remove();

    this.createGameComponents();

    this.gameContainer = document.createElement('div');
    this.gameContainer.className = 'game-container';

    this.root.append(this.resultController!.getElement());
    this.gameElement.append(this.gameContainer);

    this.gameContainer.append(this.dashboardController!.getElement());

    this.stageController = new StageController(this.gameModel, this.gameContainer);

    this.gameModel.startStage();

    this.stageController.startNewStage(this.gameModel.currentStage);
  }

  private returnToMainScreen() {
    this.gameContainer?.remove();
    this.resultController?.getElement()?.remove();

    const rulesView = new RulesView();
    this.rulesController = new RulesController(rulesView, () => {
      this.startGame();
    });
    this.gameElement.append(this.rulesController.getElement());
  }
}

export default GameController;
