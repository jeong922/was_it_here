import type { IBoardView } from '../../src/view/BoardView';
import BoardView from '../../src/view/BoardView';

let boardView: IBoardView;

describe('BoardView 테스트', () => {
  beforeEach(() => {
    boardView = new BoardView();
    document.body.innerHTML = '';
    document.body.append(boardView.getElement());
  });

  test('render()가 호출되면 보드 데이터에 맞게 DOM이 생성되어야 한다.', () => {
    const boardData = [
      [0, 0, 1],
      [0, 0, 0],
      [1, 0, 0],
    ];

    boardView.render(boardData, 'answer');

    const cells = document.querySelectorAll('.cell');
    expect(cells.length).toBe(9);

    const correctCells = document.querySelectorAll('.cell.correct');
    expect(correctCells.length).toBe(2);
  });

  test('셀 클릭 시 onCellClick()으로 등록된 콜백이 row, col, value를 전달받아 실행되어야 한다.', () => {
    const boardData = [
      [0, 0, 1],
      [0, 0, 0],
      [1, 0, 0],
    ];

    const row = 0;
    const col = 2;

    const callback = vi.fn();

    boardView.onCellClick(callback);

    boardView.render(boardData, 'user');

    const targetCell = boardView
      .getElement()
      .querySelector(`.cell[data-row="${row}"][data-col="${col}"]`) as HTMLElement;

    expect(targetCell).not.toBeNull();

    targetCell.click();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(0, 2, 1);
  });

  test(`markCellCorrect() 호출 시 지정한 셀에 'correct' 클래스가 추가되어야 한다.`, () => {
    const boardData = [
      [0, 0, 1],
      [0, 0, 0],
      [1, 0, 0],
    ];

    boardView.render(boardData, 'user');

    const row = 0;
    const col = 2;

    boardView.markCellCorrect(row, col);

    const targetCell = boardView
      .getElement()
      .querySelector(`.cell[data-row="${row}"][data-col="${col}"]`) as HTMLElement;

    expect(targetCell).not.toBeNull();

    expect(targetCell.classList.contains('correct')).toBe(true);
  });

  test(`markCellWrong() 호출 시 지정한 셀에 'wrong' 클래스가 추가되어야 한다.`, () => {
    const boardData = [
      [0, 0, 1],
      [0, 0, 0],
      [1, 0, 0],
    ];

    boardView.render(boardData, 'user');

    const row = 0;
    const col = 0;

    boardView.markCellWrong(row, col);

    const targetCell = boardView
      .getElement()
      .querySelector(`.cell[data-row="${row}"][data-col="${col}"]`) as HTMLElement;

    expect(targetCell).not.toBeNull();

    expect(targetCell.classList.contains('wrong')).toBe(true);
  });
});
