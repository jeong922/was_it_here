import BoardController from './BoardController';
import BoardModel from '../model/BoardModel';
import BoardView from '../view/BoardView';
import type { IGameModel } from '../model/GameModel';
import type { IBoardController } from './BoardController';
import { setDelay } from '../utils/delay';

export interface IStageController {
  startNewStage(stage: number): void;
}

class StageController implements IStageController {
  private readonly STAGE_START_DELAY = 3000;
  private gameModel: IGameModel;
  private gameContainer: HTMLElement;

  private boardController: IBoardController | null = null;

  constructor(gameModel: IGameModel, gameContainer: HTMLElement) {
    this.gameModel = gameModel;
    this.gameContainer = gameContainer;
  }

  startNewStage(stage: number): void {
    if (this.boardController) {
      this.boardController.getElement().remove();
    }

    const boardModel = new BoardModel(stage);
    const boardView = new BoardView();

    this.boardController = new BoardController(boardModel, boardView, this.gameModel);

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
