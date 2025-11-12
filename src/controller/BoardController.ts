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
    // 3초간 정답 보드 렌더링
    // 정답보드 지우고 유저가 클릭할 보드 렌더링
    this.view.render(this.model.answerBoard); // 정답 보드 렌더링

    // 이벤트 처리를 하는데
    // 사용자가 클릭한 부분은 모두 기록하는데
    // 오답 클릭, 정답 클릭 부분 색상은 다르게
    this.view.onCellClick((row, col, value) => {
      // 이벤트 처리하기
      console.log(`row:${row}, col:${col}, value:${value}`);
    });
  }

  getElement() {
    return this.view.getElement();
  }
}

export default BoardController;
