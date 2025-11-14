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
        // 기회 감소시키기 구현 필요
        // 고민사항 : 처음 계획은 기회를 총 3번 주기로 했지만
        // 스테이지마다 3번을 주고 스테이지 실패하거나 3번이상 틀리면 기회 감소로 할지..

        // 일단은 전체 기회가 3번이라고 설정
        this.gameModel.decreaseLives();
        console.log('남은 기회:', this.gameModel.lives);
        console.log('게임 상태', this.gameModel.state);
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
