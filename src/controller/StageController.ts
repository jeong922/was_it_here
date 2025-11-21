import type { IGameModel } from '../model/GameModel';
import type { IBoardController } from './BoardController';
import type { IStageControllerDependencies } from '../main';
import { setDelay } from '../utils/delay';

export interface IStageController {
  startNewStage(stage: number): void;
}

class StageController implements IStageController {
  private readonly STAGE_START_DELAY = 3000;
  private gameModel: IGameModel;
  private gameContainer: HTMLElement;
  private dependencies: IStageControllerDependencies;
  private boardController: IBoardController | null = null;

  constructor(gameModel: IGameModel, gameContainer: HTMLElement, dependencies: IStageControllerDependencies) {
    this.gameModel = gameModel;
    this.gameContainer = gameContainer;
    this.dependencies = dependencies;
  }

  startNewStage(stage: number): void {
    if (this.boardController) {
      this.boardController.getElement().remove();
    }

    const boardModel = new this.dependencies.boardModelConstructor(stage);
    const boardView = new this.dependencies.boardViewConstructor();

    this.boardController = new this.dependencies.boardControllerConstructor(boardModel, boardView, this.gameModel);

    this.gameContainer.append(this.boardController.getElement());

    this.startStageSequence();
  }

  private startStageSequence() {
    setDelay(() => {
      this.gameModel.playGame();
      this.boardController!.showUserBoard();
    }, this.STAGE_START_DELAY);
  }
}

export default StageController;
