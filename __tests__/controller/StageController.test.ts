import StageController, { type IStageController } from '../../src/controller/StageController';
import { type IGameModel } from '../../src/model/GameModel';
import { type IBoardController } from '../../src/controller/BoardController';
import { type IStageControllerDependencies } from '../../src/main';

vi.mock('../../src/utils/delay', () => {
  const mockFn = vi.fn((callback) => callback());
  return {
    setDelay: mockFn,
  };
});

import { setDelay } from '../../src/utils/delay';
import type { Mock, Mocked } from 'vitest';

const mockBoardModel = {};
const mockBoardView = {};

const createMockBoardController = () =>
  ({
    getElement: vi.fn().mockReturnValue(document.createElement('div')),
    showUserBoard: vi.fn(),
  } as unknown as IBoardController);

describe('StageController 테스트', () => {
  let gameModel: Mocked<IGameModel>;
  let gameContainer: HTMLElement;
  let dependencies: IStageControllerDependencies;
  let stageController: IStageController;

  const mockCreateBoardModel = vi.fn().mockReturnValue(mockBoardModel);
  const mockCreateBoardView = vi.fn().mockReturnValue(mockBoardView);
  const mockCreateBoardController = vi.fn().mockImplementation(createMockBoardController);

  beforeEach(() => {
    gameModel = {
      playGame: vi.fn(),
    } as unknown as Mocked<IGameModel>;

    gameContainer = document.createElement('div');
    document.body.appendChild(gameContainer);

    dependencies = {
      createBoardModel: mockCreateBoardModel,
      createBoardView: mockCreateBoardView,
      createBoardController: mockCreateBoardController,
    };

    vi.clearAllMocks();

    stageController = new StageController(gameModel, gameContainer, dependencies);
  });

  afterEach(() => {
    document.body.removeChild(gameContainer);
  });

  describe('startNewStage() 테스트', () => {
    const STAGE_NUMBER = 1;

    test('주어진 stage에 대해 새로운 BoardController를 생성하고 컨테이너에 추가해야 한다', () => {
      stageController.startNewStage(STAGE_NUMBER);

      expect(mockCreateBoardModel).toHaveBeenCalledWith(STAGE_NUMBER);
      expect(mockCreateBoardView).toHaveBeenCalledTimes(1);
      expect(mockCreateBoardController).toHaveBeenCalledWith(mockBoardModel, mockBoardView, gameModel);

      const newBoardElement = mockCreateBoardController.mock.results[0].value.getElement();
      expect(gameContainer.contains(newBoardElement)).toBe(true);

      expect(setDelay).toHaveBeenCalledTimes(1);

      expect((setDelay as Mock).mock.calls[0][1]).toBe(3000);

      expect(gameModel.playGame).toHaveBeenCalledTimes(1);
      const boardController = mockCreateBoardController.mock.results[0].value as Mocked<IBoardController>;
      expect(boardController.showUserBoard).toHaveBeenCalledTimes(1);
    });

    test('이전 BoardController가 존재하면 해당 요소를 DOM에서 제거해야 한다', () => {
      const firstBoardController = createMockBoardController();
      mockCreateBoardController.mockReturnValueOnce(firstBoardController);
      stageController.startNewStage(1);

      const firstBoardElement = firstBoardController.getElement();
      expect(gameContainer.contains(firstBoardElement)).toBe(true);

      firstBoardElement.remove = vi.fn();

      const secondBoardController = createMockBoardController();
      mockCreateBoardController.mockReturnValueOnce(secondBoardController);
      stageController.startNewStage(2);

      expect(firstBoardElement.remove).toHaveBeenCalledTimes(1);

      const secondBoardElement = secondBoardController.getElement();
      expect(gameContainer.contains(secondBoardElement)).toBe(true);
      expect(firstBoardElement).not.toBe(secondBoardElement);
    });
  });
});
