// 게임 상태 = 시작 전 | 게임 플레이중 | 스테이지 클리어 | 실패(기회 다쓰거나, 해당 스테이지 시간 초과) | 전체 게임 종료
type GameState = 'ready' | 'playing' | 'stageClear' | 'gameOver' | 'end';

// 게임 상태, 현재 스테이지 정보, 남은 시간, 기회

export interface IGameModel {
  startStage: () => void;
}
class Game implements IGameModel {
  // 게임 상태 관련 처리
  gameState: GameState = 'ready';
  currentStage: number = 1;
  timeLeft: number = 30;
  lives: number = 3;

  startStage(): void {
    this.gameState = 'playing';
  }
}

export default Game;
