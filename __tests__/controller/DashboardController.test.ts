import type { Mock } from 'vitest';
import type { IDashboardController } from '../../src/controller/DashboardController';
import DashboardController from '../../src/controller/DashboardController';
import type { IGameModel } from '../../src/model/GameModel';
import type { IDashboardView } from '../../src/view/DashboardView';

const MOCK_TIME = 30;
const MOCK_LIVES = 3;
const MOCK_MAX_STAGE = 20;

vi.useFakeTimers();

describe('DashboardController 테스트', () => {
  let viewMock: IDashboardView;
  let modelMock: IGameModel;
  let controller: IDashboardController;

  beforeEach(() => {
    vi.clearAllTimers();

    viewMock = {
      getElement: vi.fn(),
      setStage: vi.fn(),
      setTimer: vi.fn(),
      setLives: vi.fn(),
    };

    modelMock = {
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
        modelMock.timeLeft -= 1;
      }),
      decreaseLives: vi.fn(() => {
        modelMock.lives -= 1;
      }),
      playGame: vi.fn(),
      gameOver: vi.fn(),
      clearStage: vi.fn(),
      startNextStage: vi.fn(),
      resetGame: vi.fn(),
      gameClear: vi.fn(),
    };

    controller = new DashboardController(viewMock, modelMock);
  });

  describe('초기화 테스트', () => {
    test('초기화 시 GameModel.subscribe가 호출되어야 한다.', () => {
      expect(modelMock.subscribe).toHaveBeenCalledWith(controller);
    });

    test('초기화 시 대시보드를 업데이트 해야 한다.', () => {
      expect(viewMock.setStage).toHaveBeenCalledWith(modelMock.currentStage);
      expect(viewMock.setTimer).toHaveBeenCalledWith(modelMock.timeLeft);
      expect(viewMock.setLives).toHaveBeenCalledWith(modelMock.lives);
    });
  });

  describe('startTimer 타이머 테스트', () => {
    test('startTimer를 호출하면 1초마다 decreaseTime이 호출되어야 한다', () => {
      controller.startTimer();

      vi.advanceTimersByTime(1000);
      expect(modelMock.decreaseTime).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(4000);
      expect(modelMock.decreaseTime).toHaveBeenCalledTimes(5);
    });

    test('timeLeft가 0이 되면 타이머를 멈추고 model.gameOver를 호출해야 한다', () => {
      modelMock.timeLeft = 3;
      controller.startTimer();

      vi.advanceTimersByTime(3000);
      expect(modelMock.decreaseTime).toHaveBeenCalledTimes(3);

      vi.advanceTimersByTime(1000);

      expect(modelMock.gameOver).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(1000);
      expect(modelMock.decreaseTime).toHaveBeenCalledTimes(3);
      expect(modelMock.gameOver).toHaveBeenCalledTimes(1);
    });
  });

  describe('update 테스트', () => {
    test("stateChanged 이벤트를 수신하고 상태가 'gameOver'면 타이머를 멈춰야 한다'", () => {
      controller.startTimer();
      expect(vi.getTimerCount()).toBe(1);

      controller.update('stateChanged', { state: 'gameOver' });

      vi.advanceTimersByTime(1000);

      expect(modelMock.decreaseTime).not.toHaveBeenCalled();
    });

    test("stateChanged 이벤트를 수신하고 상태가 'stageClear'면 타이머를 멈춰야 한다'", () => {
      controller.startTimer();
      expect(vi.getTimerCount()).toBe(1);

      controller.update('stateChanged', { state: 'stageClear' });

      vi.advanceTimersByTime(1000);

      expect(modelMock.decreaseTime).not.toHaveBeenCalled();
    });

    test("stateChanged 이벤트를 수신하고 상태가 'end'면 타이머를 멈춰야 한다'", () => {
      controller.startTimer();
      expect(vi.getTimerCount()).toBe(1);

      controller.update('stateChanged', { state: 'end' });

      vi.advanceTimersByTime(1000);

      expect(modelMock.decreaseTime).not.toHaveBeenCalled();
    });

    test('timeChanged 이벤트를 수신하면 view.setTimer를 호출해야 한다', () => {
      const time = 10;
      controller.update('timeChanged', { timeLeft: time });

      expect(viewMock.setTimer).toHaveBeenCalledWith(time);
    });

    test('livesChanged 이벤트를 수신하면 view.setLives를 호출해야 한다', () => {
      const leftLives = 1;
      controller.update('livesChanged', { lives: leftLives });

      expect(viewMock.setLives).toHaveBeenCalledWith(leftLives);
    });
  });

  describe('getElement 테스트', () => {
    test('getElement() 호출 시 view.getElement()를 호출하고 그 결과를 반환해야 한다', () => {
      const mockElement = document.createElement('div');

      (viewMock.getElement as Mock).mockReturnValue(mockElement);

      const result = controller.getElement();

      expect(viewMock.getElement).toHaveBeenCalledTimes(1);

      expect(result).toBe(mockElement);
    });
  });
});
