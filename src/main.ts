import '../styles/base.css';
import '../styles/style.css';
import GameController from './controller/GameController.ts';
import Game from './model/Game.ts';
import GameView from './view/GameView.ts';

const root = document.querySelector<HTMLDivElement>('#app')! as HTMLElement;
const game = new Game();
const gameView = new GameView();

new GameController(root, gameView, game);
