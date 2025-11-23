import type { Mock } from 'vitest';
import BoardController, { type IBoardController } from '../../src/controller/BoardController';
import type { IBoardModel } from '../../src/model/BoardModel';
import type { IGameModel } from '../../src/model/GameModel';
import type { IBoardView } from '../../src/view/BoardView';

const MOCK_TIME = 30;
const MOCK_LIVES = 3;
const MOCK_MAX_STAGE = 20;

describe('BoardController 테스트', () => {
  let boardViewMock: IBoardView;
  let gameModelMock: IGameModel;
  let boardModelMock: IBoardModel;
  let controller: IBoardController;
  let onCellClickCallback: (row: number, col: number) => void;

  beforeEach(() => {
    vi.clearAllTimers();

    boardModelMock = {
      stage: 1,
      size: 3,
      answerBoard: [],
      userBoard: [],
      answerCount: 0,
      markCell: vi.fn(),
      isClear: vi.fn(),
    };

    boardViewMock = {
      getElement: vi.fn(),
      onCellClick: vi.fn((callback) => {
        onCellClickCallback = callback;
      }),
      render: vi.fn(),
      markCellCorrect: vi.fn(),
      markCellWrong: vi.fn(),
    };

    gameModelMock = {
      subscribe: vi.fn(),
      unsubscribe: vi.fn(),
      notify: vi.fn(),
      MAX_STAGE: MOCK_MAX_STAGE,
      MIN_STAGE: 1,
      LIVES: MOCK_LIVES,
      TIME: MOCK_TIME,
      currentStage: 1,
      timeLeft: 60,
      lives: 3,
      state: 'playing',
      startStage: vi.fn(),
      decreaseTime: vi.fn(() => {
        gameModelMock.timeLeft -= 1;
      }),
      decreaseLives: vi.fn(() => {
        gameModelMock.lives -= 1;
      }),
      playGame: vi.fn(),
      gameOver: vi.fn(),
      clearStage: vi.fn(),
      startNextStage: vi.fn(),
      resetGame: vi.fn(),
      gameClear: vi.fn(),
    };

    controller = new BoardController(boardModelMock, boardViewMock, gameModelMock);
  });

  describe('초기화 테스트', () => {
    test('컨트롤러 생성 시 view.render()에 answerBoard를 전달해야 한다', () => {
      expect(boardViewMock.render).toHaveBeenCalledWith(boardModelMock.answerBoard, 'answer');
    });
  });

  describe('showUserBoard() 테스트', () => {
    test('showUserBoard() 호출 시 userBoard를 렌더링 하고 onCellClick()을 호출해야 한다.', () => {
      controller.showUserBoard();

      expect(boardViewMock.render).toHaveBeenCalledWith(boardModelMock.userBoard, 'user');
      expect(boardViewMock.render).toHaveBeenCalledTimes(2);
      expect(boardViewMock.onCellClick).toHaveBeenCalledTimes(1);
      expect(onCellClickCallback).toBeInstanceOf(Function);
    });

    describe('handleCellClick() 로직 테스트', () => {
      beforeEach(() => {
        controller.showUserBoard();
      });

      test('중복된 셀은 클릭되지 않는다.', () => {
        const row = 1;
        const col = 1;

        (boardModelMock.markCell as Mock).mockReturnValue(true);

        onCellClickCallback(row, col);
        onCellClickCallback(row, col);

        expect(boardModelMock.markCell).toHaveBeenCalledTimes(1);
        expect(boardViewMock.markCellCorrect).toHaveBeenCalledTimes(1);
      });

      test('정답 셀을 클릭하면 모델이 해당 셀을 정답으로 처리하고, 뷰는 정답 표시를 업데이트한다.', () => {
        const row = 1;
        const col = 2;

        (boardModelMock.markCell as Mock).mockReturnValue(true);
        (boardModelMock.isClear as Mock).mockReturnValue(false);

        onCellClickCallback(row, col);

        expect(boardModelMock.markCell).toHaveBeenCalledWith(row, col);
        expect(boardViewMock.markCellCorrect).toHaveBeenCalledWith(row, col);

        expect(boardViewMock.markCellWrong).not.toHaveBeenCalled();
        expect(gameModelMock.decreaseLives).not.toHaveBeenCalled();
      });

      test('오답 셀을 클릭하면 모델이 해당 셀을 오답으로 처리하고, 뷰는 오답 표시를 업데이트한다.', () => {
        const row = 1;
        const col = 2;

        (boardModelMock.markCell as Mock).mockReturnValue(false);
        (boardModelMock.isClear as Mock).mockReturnValue(false);

        onCellClickCallback(row, col);

        expect(boardModelMock.markCell).toHaveBeenCalledWith(row, col);
        expect(boardViewMock.markCellWrong).toHaveBeenCalledWith(row, col);
        expect(gameModelMock.decreaseLives).toHaveBeenCalledTimes(1);

        expect(boardViewMock.markCellCorrect).not.toHaveBeenCalled();
      });

      test('클릭 후 보드가 클리어되면 gameModel.clearStage를 호출해야 한다', () => {
        const row = 0;
        const col = 0;

        (boardModelMock.markCell as Mock).mockReturnValue(true);
        (boardModelMock.isClear as Mock).mockReturnValue(true);

        onCellClickCallback(row, col);

        expect(gameModelMock.clearStage).toHaveBeenCalledTimes(1);
        expect(gameModelMock.gameOver).not.toHaveBeenCalled();
      });

      test('오답 처리 후 남은 기회가 0이 되면 gameModel.gameOver()를 호출해야 한다', () => {
        const row = 0;
        const col = 0;

        (boardModelMock.markCell as Mock).mockReturnValue(false);
        (boardModelMock.isClear as Mock).mockReturnValue(false);

        gameModelMock.lives = 1;

        onCellClickCallback(row, col);

        expect(gameModelMock.decreaseLives).toHaveBeenCalledTimes(1);
        expect(gameModelMock.gameOver).toHaveBeenCalledTimes(1);
        expect(gameModelMock.clearStage).not.toHaveBeenCalled();
      });
    });
  });

  describe('getElement() 테스트', () => {
    test('getElement() 호출 시 view.getElement()를 호출하고 그 결과를 반환해야 한다', () => {
      const mockElement = document.createElement('div');

      (boardViewMock.getElement as Mock).mockReturnValue(mockElement);

      const result = controller.getElement();

      expect(boardViewMock.getElement).toHaveBeenCalledTimes(1);

      expect(result).toBe(mockElement);
    });
  });
});
