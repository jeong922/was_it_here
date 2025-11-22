import { type Mock, type Mocked } from 'vitest';
import type { IDashboardController } from '../../src/controller/DashboardController';
import type { IGameController } from '../../src/controller/GameController';
import GameController from '../../src/controller/GameController';
import type { IResultController } from '../../src/controller/ResultController';
import type { IRulesController } from '../../src/controller/RulesController';
import type { IStageController } from '../../src/controller/StageController';
import type { IGameControllerDependencies } from '../../src/main';
import type { IGameModel } from '../../src/model/GameModel';
import type { IGameView } from '../../src/view/GameView';

const MOCK_TIME = 30;
const MOCK_LIVES = 3;
const MOCK_MAX_STAGE = 20;

let root: HTMLElement;
let gameViewMock: IGameView;
let gameModelMock: IGameModel;
let controller: IGameController;
let mockDependencies: IGameControllerDependencies;

let rulesControllerMock: IRulesController;
let dashboardControllerMock: IDashboardController;
let stageControllerMock: IStageController;
let resultControllerMock: IResultController;

let capturedStartGameCallback: (() => void) | null = null;

describe('GameController 테스트', () => {
  let rulesElement: HTMLElement;
  let dashboardElement: HTMLElement;
  let resultElement: HTMLElement;

  beforeEach(() => {
    rulesElement = document.createElement('div');
    rulesElement.className = 'rules';
    rulesElement.remove = vi.fn();
    dashboardElement = document.createElement('div');
    dashboardElement.className = 'dashboard';

    resultElement = document.createElement('div');
    resultElement.className = 'result';
    resultElement.remove = vi.fn();

    rulesControllerMock = {
      getElement: vi.fn(() => rulesElement),
    };

    stageControllerMock = {
      startNewStage: vi.fn(),
    };

    dashboardControllerMock = {
      getElement: vi.fn(() => dashboardElement),
      startTimer: vi.fn(),
      updateDashboard: vi.fn(),
      update: vi.fn(),
    };

    resultControllerMock = {
      getElement: vi.fn(() => resultElement),
      update: vi.fn(),
    };

    mockDependencies = {
      createRulesController: vi.fn((_, onStart) => {
        capturedStartGameCallback = onStart;
        return rulesControllerMock;
      }),
      createStageController: vi.fn(() => stageControllerMock),
      createDashboardController: vi.fn(() => dashboardControllerMock),
      createResultController: vi.fn(() => resultControllerMock),
    };

    root = document.createElement('div');
    document.body.appendChild(root);

    gameViewMock = {
      render: vi.fn(() => {
        const gameElement = document.createElement('div');
        gameElement.id = 'game-element';
        return gameElement;
      }),
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
      state: 'ready',
      startStage: vi.fn(),
      decreaseTime: vi.fn(() => {
        (gameModelMock as Mocked<IGameModel>).timeLeft -= 1;
      }),
      decreaseLives: vi.fn(() => {
        (gameModelMock as Mocked<IGameModel>).lives -= 1;
      }),
      playGame: vi.fn(),
      gameOver: vi.fn(),
      clearStage: vi.fn(),
      startNextStage: vi.fn(),
      resetGame: vi.fn(),
      gameClear: vi.fn(),
    };

    controller = new GameController(root, gameViewMock, gameModelMock, mockDependencies);
  });

  test('초기화 시 GameModel.subscribe가 호출되어야 한다.', () => {
    expect(gameModelMock.subscribe).toHaveBeenCalledWith(controller);
  });

  test('초기화 시 게임 뷰가 렌더링되고 root에 추가되어야 한다.', () => {
    expect(gameViewMock.render).toHaveBeenCalled();

    const gameElement = root.firstChild as HTMLElement;
    expect(gameElement).toBeInstanceOf(HTMLElement);
    expect(gameElement?.id).toBe('game-element');
  });

  test('RulesController가 초기화되어 GameElement에 추가되어야 한다.', () => {
    const gameElement = root.firstChild as HTMLElement;
    expect(mockDependencies.createRulesController).toHaveBeenCalled();
    expect(gameElement.contains(rulesElement)).toBe(true);
  });

  test('RulesController onStart 호출 시 startGame이 실행되어야 한다', () => {
    expect(capturedStartGameCallback).not.toBeNull();
    capturedStartGameCallback!();

    expect(rulesElement.remove).toHaveBeenCalledTimes(1);

    expect(mockDependencies.createDashboardController).toHaveBeenCalledTimes(1);
    expect(mockDependencies.createResultController).toHaveBeenCalledTimes(1);
    expect(mockDependencies.createStageController).toHaveBeenCalledTimes(1);

    expect(root.contains(resultElement)).toBe(true);

    const gameElement = root.firstChild as HTMLElement;
    const gameContainer = gameElement.querySelector('.game-container');
    expect(gameContainer).not.toBeNull();
    expect(gameContainer!.contains(dashboardElement)).toBe(true);

    expect(gameModelMock.startStage).toHaveBeenCalledTimes(1);
    expect(stageControllerMock.startNewStage).toHaveBeenCalledWith(1);
  });

  test('stageChanged 이벤트 수신 시 stageController.startNewStage가 호출되어야 한다', () => {
    expect(capturedStartGameCallback).not.toBeNull();
    capturedStartGameCallback!();

    (stageControllerMock.startNewStage as Mock).mockClear();

    controller.update('stageChanged', { stage: 2 });

    expect(stageControllerMock.startNewStage).toHaveBeenCalledWith(2);
    expect(stageControllerMock.startNewStage).toHaveBeenCalledTimes(1);
  });

  test('stateChanged ready 이벤트 수신 시 returnToMainScreen이 실행되어 게임 방법 화면 복귀해야 한다.', () => {
    capturedStartGameCallback!();

    expect(rulesElement.remove).toHaveBeenCalledTimes(1);

    controller.update('stateChanged', { state: 'ready' });

    expect(resultElement.remove).toHaveBeenCalledTimes(1);

    expect(mockDependencies.createRulesController).toHaveBeenCalledTimes(2);

    const gameElement = root.firstChild as HTMLElement;
    expect(gameElement.contains(rulesElement)).toBe(true);

    expect(gameElement.querySelector('.game-container')).toBeNull();
  });
});
