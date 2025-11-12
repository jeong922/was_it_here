import type { IGameModel } from '../model/Game';
import BoardView, { type IBoardView } from '../view/BoardView';

interface IBoardController {
  getElement(): void;
}

class BoardController implements IBoardController {
  private view: IBoardView;
  private model: IGameModel;

  // 보드 모델을 하나 만들어서 가져와야 할듯..?
  constructor(stage: number, model: IGameModel) {
    this.model = model;
    this.view = new BoardView(stage);
    this.init();
  }

  private init() {
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
