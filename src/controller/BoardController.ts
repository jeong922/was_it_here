import type { IBoardModel } from '../model/BoardModel';
import type IBoardView from '../view/BoardView';

interface IBoardController {
  getElement(): void;
}

class BoardController implements IBoardController {
  private view: IBoardView;
  private model: IBoardModel;

  constructor(model: IBoardModel, view: IBoardView) {
    this.model = model;
    this.view = view;
    this.init();
  }

  private init() {
    this.view.render(this.model.answerBoard);
  }

  showUserBoard() {
    this.view.render(this.model.userBoard);
    this.view.onCellClick((row, col) => {
      const isCorrect = this.model.markCell(row, col);

      if (isCorrect) {
        this.view.markCellCorrect(row, col);
      } else {
        this.view.markCellWrong(row, col);
        // 기회 감소시키기 구현 필요
        // 고민사항 : 처음 계획은 기회를 총 3번 주기로 했지만
        // 스테이지마다 3번을 주고 스테이지 실패하거나 3번이상 틀리면 기회 감소로 할지..
      }

      if (this.model.isClear()) {
        console.log('스테이지 클리어!');
        // 스테이지 클리어 UI 렌더링
        // 아마 모달창으로..?
      }
    });
  }

  getElement() {
    return this.view.getElement();
  }
}

export default BoardController;
