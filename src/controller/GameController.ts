import type { IGameModel } from '../model/Game';
import type { IGameView } from '../view/GameView';

class GameController {
  root: HTMLElement;
  view: IGameView;
  game: IGameModel;

  constructor(root: HTMLElement, view: IGameView, game: IGameModel) {
    this.root = root;
    this.view = view;
    this.game = game;
    this.init();
  }

  init(): void {
    this.showStartScreen();
    this.addEvent();
  }

  showStartScreen(): void {
    this.root.innerHTML = this.view.render();
  }

  addEvent(): void {
    const startBtn = this.root.querySelector('.game-start');
    startBtn?.addEventListener('click', () => {
      this.handleStartClick();
    });
  }

  handleStartClick(): void {
    console.log('시작!');
    // 게임 상태 변경 ready -> playing
    this.game.startStage();
    // 게임 룰 보드판 CSS로 안보이게 처리
    // 게임 보드 생성
  }
}

export default GameController;
