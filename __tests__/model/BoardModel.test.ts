import BoardModel from '../../src/model/BoardModel';
import type { IBoardModel } from '../../src/model/BoardModel';

const mockBoards = [
  {
    stage: 1,
    board: [
      [0, 0, 1],
      [0, 0, 0],
      [1, 0, 0],
    ],
  },
];

vi.mock('../data/board', () => ({
  boards: mockBoards,
}));

describe('BoardModel 테스트', () => {
  let model: IBoardModel;
  const STAGE = 1;

  beforeEach(() => {
    model = new BoardModel(STAGE);
  });

  describe('초기화 테스트', () => {
    test('생성 시 stage, size, answerCount를 올바르게 초기화해야 한다', () => {
      expect(model.stage).toBe(STAGE);
      expect(model.size).toBe(3);
      expect(model.answerCount).toBe(2);

      const userBoard = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ];
      expect(model.userBoard).toEqual(userBoard);
    });

    test('보드 데이터가 없을 경우 에러를 던져야 한다', () => {
      expect(() => new BoardModel(22)).toThrowError('Stage 22에 해당하는 보드 데이터를 찾을 수 없습니다.');
    });
  });

  describe('isClear() 테스트', () => {
    test('모든 정답 위치를 찾으면 true를 리턴한다.', () => {
      model.markCell(0, 2);
      model.markCell(2, 0);

      expect(model.isClear()).toBe(true);
    });

    test('모든 정답 위치를 찾지 못하면 false를 리턴한다.', () => {
      model.markCell(1, 2);

      expect(model.isClear()).toBe(false);

      model.markCell(0, 2);

      expect(model.isClear()).toBe(false);
    });
  });

  describe('markCell() 테스트', () => {
    test('이미 클릭된 셀을 클릭하면 false를 리턴해야 한다', () => {
      const row = 0;
      const col = 2;

      model.markCell(row, col);

      const isCorrect = model.markCell(row, col);

      expect(isCorrect).toBe(false);
      expect(model.userBoard[row][col]).toBe(1);
    });

    test('오답 셀 클릭 시 userBoard에 표시하고 false를 리턴해야 한다.', () => {
      const row = 1;
      const col = 1;

      const isCorrect = model.markCell(row, col);

      expect(isCorrect).toBe(false);
      expect(model.userBoard[row][col]).toBe(1);
    });

    test('정답 셀 클릭 시 userBoard에 표시하고 true를 리턴해야 한다.', () => {
      const row = 0;
      const col = 2;

      const isCorrect = model.markCell(row, col);

      expect(isCorrect).toBe(true);
      expect(model.userBoard[row][col]).toBe(1);
    });
  });
});
