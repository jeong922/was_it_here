import '../styles/base.css';
import '../styles/style.css';
import BoardController, { type IBoardController } from './controller/BoardController.ts';
import DashboardController, { type IDashboardController } from './controller/DashboardController.ts';
import GameController from './controller/GameController.ts';
import ResultController, { type IResultController } from './controller/ResultController.ts';
import RulesController, { type IRulesController } from './controller/RulesController.ts';
import StageController, { type IStageController } from './controller/StageController.ts';
import BoardModel from './model/BoardModel.ts';
import GameModel, { type IGameModel } from './model/GameModel.ts';
import BoardView from './view/BoardView.ts';
import type DashboardView from './view/DashboardView.ts';
import GameView from './view/GameView.ts';
import type ResultView from './view/ResultView.ts';
import type RulesView from './view/RulesView.ts';

export interface IStageControllerDependencies {
  boardControllerConstructor: new (model: BoardModel, view: BoardView, gameModel: IGameModel) => IBoardController;
  boardViewConstructor: new () => BoardView;
  boardModelConstructor: new (stage: number) => BoardModel;
}

export interface IGameControllerDependencies {
  createRulesController: (view: RulesView, onStart: () => void) => IRulesController;
  createStageController: (model: IGameModel, container: HTMLElement) => IStageController;
  createDashboardController: (view: DashboardView, model: IGameModel) => IDashboardController;
  createResultController: (model: IGameModel, view: ResultView) => IResultController;
}

const root = document.querySelector<HTMLDivElement>('#app')! as HTMLElement;
const gameModel = new GameModel();
const gameView = new GameView();

const stageDependencies: IStageControllerDependencies = {
  boardControllerConstructor: BoardController,
  boardViewConstructor: BoardView,
  boardModelConstructor: BoardModel,
};

const gameControllerDependencies: IGameControllerDependencies = {
  createRulesController: (view, onStart) => new RulesController(view, onStart),
  createStageController: (model, container) => new StageController(model, container, stageDependencies),
  createDashboardController: (view, model) => new DashboardController(view, model),
  createResultController: (model, view) => new ResultController(model, view),
};

new GameController(root, gameView, gameModel, gameControllerDependencies);
