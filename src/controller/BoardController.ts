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

    // 분명 이렇게 하면 테스트 어려움 setTimeout 분리 필요
    // 게임 컨트롤러에서 관리해야 할듯..?
    // 여기 아래 내용은 메서드 분리하기
    setTimeout(() => {
      // 3초 후 유저 보드로 교체
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
    }, 3000);
  }

  getElement() {
    return this.view.getElement();
  }
}

export default BoardController;
