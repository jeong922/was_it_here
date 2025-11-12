import '../styles/base.css';
import '../styles/style.css';
import GameController from './controller/GameController.ts';
import GameModel from './model/GameModel.ts';
import GameView from './view/GameView.ts';

const root = document.querySelector<HTMLDivElement>('#app')! as HTMLElement;
const gameModel = new GameModel();
const gameView = new GameView();

new GameController(root, gameView, gameModel);
