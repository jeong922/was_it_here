// 게임 상태 = 시작 전 | 정답보드 보여줌 | 게임 플레이중 | 스테이지 클리어 | 실패(기회 다쓰거나, 해당 스테이지 시간 초과) | 전체 게임 종료
export type GameState = 'ready' | 'showAnswer' | 'playing' | 'stageClear' | 'gameOver' | 'end';

// 게임상태 변경, 시간 변경, 기회 변경, 스테이지 변경
export type GameEventType = 'stateChanged' | 'timeChanged' | 'livesChanged' | 'stageChanged';
