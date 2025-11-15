import type { IBoardModel } from '../model/BoardModel';
import type { IGameModel } from '../model/GameModel';
import type IBoardView from '../view/BoardView';

interface IBoardController {
  getElement(): HTMLElement;
}

class BoardController implements IBoardController {
  private boardView: IBoardView;
  private model: IBoardModel;
  private gameModel: IGameModel;

  constructor(model: IBoardModel, boardView: IBoardView, gameModel: IGameModel) {
    this.model = model;
    this.boardView = boardView;
    this.gameModel = gameModel;
    this.init();
  }

  private init() {
    this.boardView.render(this.model.answerBoard);
  }

  showUserBoard() {
    this.boardView.render(this.model.userBoard);
    this.boardView.onCellClick((row, col) => {
      const isCorrect = this.model.markCell(row, col);

      if (isCorrect) {
        this.boardView.markCellCorrect(row, col);
      } else {
        this.boardView.markCellWrong(row, col);
        this.gameModel.decreaseLives();
      }

      if (this.model.isClear()) {
        this.gameModel.clearStage();
      } else if (this.gameModel.lives === 0) {
        this.gameModel.gameOver();
      }
    });
  }

  getElement() {
    return this.boardView.getElement();
  }
}

export default BoardController;
