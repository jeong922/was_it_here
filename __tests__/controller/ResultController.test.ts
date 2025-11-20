import type { Mock } from 'vitest';
import type { IResultController } from '../../src/controller/ResultController';
import ResultController from '../../src/controller/ResultController';
import type { IGameModel } from '../../src/model/GameModel';
import type { IResultView } from '../../src/view/ResultView';

describe('ResultController 테스트', () => {
  let viewMock: IResultView;
  let modelMock: IGameModel;
  let controller: IResultController;

  beforeEach(() => {
    viewMock = {
      displayResultUI: vi.fn(),
      showModal: vi.fn(),
      hideModal: vi.fn(),
      setResultTimer: vi.fn(),
      setResultLives: vi.fn(),
      setResultStage: vi.fn(),
      onNext: vi.fn(),
      getElement: vi.fn(),
    };

    modelMock = {
      subscribe: vi.fn(),
      unsubscribe: vi.fn(),
      notify: vi.fn(),
      currentStage: 1,
      timeLeft: 60,
      lives: 3,
      state: 'playing',
      startStage: vi.fn(),
      decreaseTime: vi.fn(() => {
        modelMock.timeLeft -= 1;
      }),
      decreaseLives: vi.fn(),
      playGame: vi.fn(),
      gameOver: vi.fn(),
      clearStage: vi.fn(),
      startNextStage: vi.fn(),
      resetGame: vi.fn(),
      gameClear: vi.fn(),
    } as IGameModel;

    controller = new ResultController(modelMock, viewMock);
  });

  describe('초기화 테스트', () => {
    test('초기화 시 GameModel.subscribe가 호출되어야 한다.', () => {
      expect(modelMock.subscribe).toHaveBeenCalledWith(controller);
    });

    test('초기화 시 View.onNext가 호출되어 이벤트 핸들러가 바인딩되어야 한다.', () => {
      expect(viewMock.onNext).toHaveBeenCalledTimes(1);
    });
  });

  describe('update() 테스트', () => {
    test('type이 stateChanged이고 "stageClear" 상태일 때 결과 UI가 표시되고 모달이 렌더링 된다.', () => {
      controller.update('stateChanged', { state: 'stageClear' });

      expect(viewMock.displayResultUI).toHaveBeenCalledWith('stageClear');
      expect(viewMock.setResultTimer).toHaveBeenCalledWith(modelMock.timeLeft);
      expect(viewMock.setResultLives).toHaveBeenCalledWith(modelMock.lives);
      expect(viewMock.setResultStage).toHaveBeenCalledWith(modelMock.currentStage);
      expect(viewMock.showModal).toHaveBeenCalledTimes(1);
    });

    test('type이 stateChanged이고 "gameOver" 상태일 때 결과 UI가 표시되고 모달이 렌더링 된다.', () => {
      controller.update('stateChanged', { state: 'gameOver' });

      expect(viewMock.displayResultUI).toHaveBeenCalledWith('gameOver');
      expect(viewMock.showModal).toHaveBeenCalledTimes(1);
    });

    test('type이 stateChanged이고 "end" 상태일 때 결과 UI가 표시되고 모달이 렌더링 된다.', () => {
      controller.update('stateChanged', { state: 'end' });

      expect(viewMock.displayResultUI).toHaveBeenCalledWith('end');
      expect(viewMock.showModal).toHaveBeenCalled();
    });

    test('type이 stateChanged이고 그 외 상태일 때 모달이 숨겨져야 한다.', () => {
      controller.update('stateChanged', { state: 'playing' });

      expect(viewMock.hideModal).toHaveBeenCalledTimes(1);
    });

    test('type이 stateChanged가 아닐 경우 무시된다.', () => {
      controller.update('timeChanged', { timeLeft: 20 });

      expect(viewMock.displayResultUI).not.toHaveBeenCalled();
      expect(viewMock.showModal).not.toHaveBeenCalled();
      expect(viewMock.hideModal).not.toHaveBeenCalled();
    });
  });

  describe('onNext() 테스트', () => {
    let onNextCallback: () => void;

    beforeEach(() => {
      onNextCallback = (viewMock.onNext as Mock).mock.calls[0][0];
    });

    test('stageClear 상태에서 next-button 버튼을 누르면 다음 스테이지로 진행하고 모달을 닫는다', () => {
      modelMock.state = 'stageClear';

      onNextCallback();

      expect(modelMock.startNextStage).toHaveBeenCalledTimes(1);
      expect(viewMock.hideModal).toHaveBeenCalledTimes(1);
    });

    test('gameOver 상태에서 next-button 버튼을 누르면 게임이 초기화되고 모달이 닫힌다', () => {
      modelMock.state = 'gameOver';

      onNextCallback();

      expect(modelMock.resetGame).toHaveBeenCalledTimes(1);
      expect(viewMock.hideModal).toHaveBeenCalledTimes(1);
    });

    test('end 상태에서 next-button 버튼을 누르면 게임이 초기화되고 모달이 닫힌다', () => {
      modelMock.state = 'end';

      onNextCallback();

      expect(modelMock.resetGame).toHaveBeenCalledTimes(1);
      expect(viewMock.hideModal).toHaveBeenCalledTimes(1);
    });

    test('next-button 버튼을 누르면 상태와 관계없이 항상 모달을 닫는다', () => {
      modelMock.state = 'stageClear';

      onNextCallback();

      expect(viewMock.hideModal).toHaveBeenCalledTimes(1);
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
