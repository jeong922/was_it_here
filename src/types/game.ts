// 게임 상태 = 시작 전 | 게임 플레이중 | 스테이지 클리어 | 실패(기회 다쓰거나, 해당 스테이지 시간 초과) | 전체 게임 종료
export type GameState = 'ready' | 'playing' | 'stageClear' | 'gameOver' | 'end';
