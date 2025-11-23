import type { IBoardModel } from '../model/BoardModel';
import type { IGameModel } from '../model/GameModel';
import type { IBoardView } from '../view/BoardView';

export interface IBoardController {
  getElement(): HTMLElement;
  showUserBoard(): void;
}

class BoardController implements IBoardController {
  private boardView: IBoardView;
  private model: IBoardModel;
  private gameModel: IGameModel;
  private clickedCells = new Set<string>();

  constructor(model: IBoardModel, boardView: IBoardView, gameModel: IGameModel) {
    this.model = model;
    this.boardView = boardView;
    this.gameModel = gameModel;
    this.init();
  }

  private init(): void {
    this.boardView.render(this.model.answerBoard, 'answer');
  }

  showUserBoard(): void {
    this.boardView.render(this.model.userBoard, 'user');
    this.boardView.onCellClick(this.handleCellClick.bind(this));
  }

  private handleCellClick(row: number, col: number): void {
    const key = `${row}-${col}`;

    if (this.clickedCells.has(key)) {
      return;
    }

    this.clickedCells.add(key);

    const isCorrect = this.model.markCell(row, col);

    if (isCorrect) {
      this.boardView.markCellCorrect(row, col);
    } else {
      this.boardView.markCellWrong(row, col);
      this.gameModel.decreaseLives();
    }

    this.checkGameState();
  }

  private checkGameState(): void {
    if (this.model.isClear()) {
      this.gameModel.clearStage();
    } else if (this.gameModel.lives === 0) {
      this.gameModel.gameOver();
    }
  }

  getElement(): HTMLElement {
    return this.boardView.getElement();
  }
}

export default BoardController;
