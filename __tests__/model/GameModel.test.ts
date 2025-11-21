import GameModel from '../../src/model/GameModel';
import type { IGameModel, IObserver } from '../../src/model/GameModel';

const createMockObserver = (): IObserver => ({
  update: vi.fn(),
});

describe('GameModel 테스트', () => {
  let gameModel: IGameModel;
  let mockObserver: IObserver;

  beforeEach(() => {
    gameModel = new GameModel();
    mockObserver = createMockObserver();

    gameModel.subscribe(mockObserver);

    vi.clearAllMocks();
  });

  test('playGame() 호출 시 상태가 "playing"으로 변경되고 stateChanged 알림이 1회 발생한다.', () => {
    gameModel.playGame();

    expect(gameModel.state).toBe('playing');
    expect(mockObserver.update).toHaveBeenCalledWith('stateChanged', { state: 'playing' });
    expect(mockObserver.update).toHaveBeenCalledTimes(1);
  });

  test('startStage() 호출 시 상태가 "showAnswer"로 변경되고 stateChanged 알림이 1회 발생한다.', () => {
    gameModel.state = 'ready';

    gameModel.startStage();

    expect(gameModel.state).toBe('showAnswer');
    expect(mockObserver.update).toHaveBeenCalledWith('stateChanged', { state: 'showAnswer' });
    expect(mockObserver.update).toHaveBeenCalledTimes(1);
  });

  test('gameOver() 호출 시 상태가 "gameOver"로 변경되고 stateChanged 알림이 1회 발생한다.', () => {
    gameModel.state = 'playing';

    gameModel.gameOver();

    expect(gameModel.state).toBe('gameOver');
    expect(mockObserver.update).toHaveBeenCalledWith('stateChanged', { state: 'gameOver' });
    expect(mockObserver.update).toHaveBeenCalledTimes(1);
  });

  test('gameClear() 호출 시 상태가 "end"로 변경되고 stateChanged 알림이 1회 발생한다.', () => {
    gameModel.state = 'stageClear';

    gameModel.gameClear();

    expect(gameModel.state).toBe('end');
    expect(mockObserver.update).toHaveBeenCalledWith('stateChanged', { state: 'end' });
    expect(mockObserver.update).toHaveBeenCalledTimes(1);
  });

  test('clearStage() 호출 시 상태가 "stageClear"로 변경되고 stateChanged 알림이 1회 발생한다.', () => {
    gameModel.clearStage();

    expect(gameModel.state).toBe('stageClear');
    expect(mockObserver.update).toHaveBeenCalledWith('stateChanged', { state: 'stageClear' });
    expect(mockObserver.update).toHaveBeenCalledTimes(1);
  });

  test('clearStage()가 최종 스테이지(MAX_STAGE)에서 호출 시 gameClear()를 호출하고 상태가 "end"가 되며 알림이 2회 발생한다.', () => {
    gameModel.currentStage = gameModel.MAX_STAGE;

    gameModel.clearStage();

    expect(gameModel.state).toBe('end');
    expect(mockObserver.update).toHaveBeenCalledWith('stateChanged', { state: 'stageClear' });
    expect(mockObserver.update).toHaveBeenCalledWith('stateChanged', { state: 'end' });
    expect(mockObserver.update).toHaveBeenCalledTimes(2);
  });

  test('startNextStage() 호출 시 스테이지는 1 증가, 타이머는 리셋되며, 상태 및 관련 이벤트 알림이 총 3회 발생한다.', () => {
    gameModel.currentStage = 2;
    gameModel.timeLeft = 10;
    gameModel.startNextStage();

    expect(gameModel.currentStage).toBe(3);
    expect(gameModel.timeLeft).toBe(gameModel.TIME);
    expect(gameModel.state).toBe('showAnswer');

    expect(mockObserver.update).toHaveBeenCalledWith('stageChanged', { stage: 3 });
    expect(mockObserver.update).toHaveBeenCalledWith('timeChanged', { timeLeft: gameModel.TIME });
    expect(mockObserver.update).toHaveBeenCalledWith('stateChanged', { state: 'showAnswer' });
    expect(mockObserver.update).toHaveBeenCalledTimes(3);
  });

  test('startNextStage()가 MAX_STAGE에서 호출되면 아무 변화도 없고 알림도 발생하지 않는다.', () => {
    gameModel.currentStage = gameModel.MAX_STAGE;
    gameModel.startNextStage();

    expect(gameModel.currentStage).toBe(gameModel.MAX_STAGE);
    expect(mockObserver.update).not.toHaveBeenCalled();
  });

  test('resetGame() 호출 시 모든 상태(스테이지, 타이머, 기회, 상태)가 초기화되고 관련 이벤트 알림이 총 4회 발생한다.', () => {
    gameModel.currentStage = 10;
    gameModel.timeLeft = 5;
    gameModel.lives = 1;
    gameModel.state = 'playing';

    const MIN_STAGE = gameModel.MIN_STAGE;
    const MAX_LIVES = gameModel.LIVES;
    const MAX_TIME = gameModel.TIME;

    gameModel.resetGame();

    expect(gameModel.currentStage).toBe(MIN_STAGE);
    expect(gameModel.timeLeft).toBe(MAX_TIME);
    expect(gameModel.lives).toBe(MAX_LIVES);
    expect(gameModel.state).toBe('ready');

    expect(mockObserver.update).toHaveBeenCalledWith('stageChanged', { stage: gameModel.MIN_STAGE });
    expect(mockObserver.update).toHaveBeenCalledWith('timeChanged', { timeLeft: gameModel.TIME });
    expect(mockObserver.update).toHaveBeenCalledWith('livesChanged', { lives: gameModel.LIVES });
    expect(mockObserver.update).toHaveBeenCalledWith('stateChanged', { state: 'ready' });
    expect(mockObserver.update).toHaveBeenCalledTimes(4);
  });

  test('decreaseTime() 호출 시 남은 시간이 1 감소하고 timeChanged 알림이 1회 발생한다.', () => {
    gameModel.timeLeft = 15;
    const expectedTime = 14;

    gameModel.decreaseTime();

    expect(gameModel.timeLeft).toBe(expectedTime);
    expect(mockObserver.update).toHaveBeenCalledWith('timeChanged', { timeLeft: expectedTime });
    expect(mockObserver.update).toHaveBeenCalledTimes(1);
  });

  test('decreaseTime() 호출 시 남은 시간이 0이면 더 이상 감소하지 않고 알림도 발생하지 않는다.', () => {
    gameModel.timeLeft = 0;

    gameModel.decreaseTime();

    expect(gameModel.timeLeft).toBe(0);
    expect(mockObserver.update).not.toHaveBeenCalled();
  });

  test('decreaseLives() 호출 시 기회가 1 감소하고 livesChanged 알림이 1회 발생한다.', () => {
    const initialLives = 3;
    gameModel.lives = initialLives;

    gameModel.decreaseLives();

    expect(gameModel.lives).toBe(initialLives - 1);
    expect(mockObserver.update).toHaveBeenCalledWith('livesChanged', { lives: 2 });
    expect(mockObserver.update).toHaveBeenCalledTimes(1);
  });

  test('decreaseLives()가 기회가 1에서 호출 시 게임 오버가 되며 알림이 2회 발생한다.', () => {
    gameModel.lives = 1;

    gameModel.decreaseLives();

    expect(gameModel.lives).toBe(0);
    expect(gameModel.state).toBe('gameOver');

    expect(mockObserver.update).toHaveBeenCalledWith('livesChanged', { lives: 0 });
    expect(mockObserver.update).toHaveBeenCalledWith('stateChanged', { state: 'gameOver' });
    expect(mockObserver.update).toHaveBeenCalledTimes(2);
  });

  test('decreaseLives() 호출 시 기회가 0이면 감소하지 않고 알림도 발생하지 않는다.', () => {
    gameModel.lives = 0;

    gameModel.decreaseLives();

    expect(gameModel.lives).toBe(0);
    expect(mockObserver.update).not.toHaveBeenCalled();
  });
});
