import type { GameEventPayloads, IGameModel, IObserver } from '../model/GameModel';
import type { GameEventType, GameState } from '../types/game';
import type { IResultView } from '../view/ResultView';

export interface IResultController extends IObserver {
  getElement(): HTMLElement;
}

class ResultController implements IResultController {
  private gameModel: IGameModel;
  private resultView: IResultView;

  constructor(gameModel: IGameModel, resultView: IResultView) {
    this.gameModel = gameModel;
    this.resultView = resultView;
    this.bindEvents();
    this.gameModel.subscribe(this);
  }

  update<T extends GameEventType>(type: T, payload: GameEventPayloads[T]): void {
    if (type === 'stateChanged') {
      const { state } = payload as { state: GameState };

      if (state === 'stageClear' || state === 'gameOver' || state === 'end') {
        this.resultView.displayResultUI(state);
        this.resultView.displayTimer(this.gameModel.timeLeft);
        this.resultView.displayLives(this.gameModel.lives);
        this.resultView.displayStage(this.gameModel.currentStage);
        this.resultView.showModal();
      } else {
        this.resultView.hideModal();
      }
    }
  }

  private bindEvents() {
    this.resultView.onNext(() => {
      const state = this.gameModel.state;

      if (state === 'stageClear') {
        this.gameModel.startNextStage();
      } else if (state === 'gameOver' || state === 'end') {
        this.gameModel.resetGame();
      }

      this.resultView.hideModal();
    });
  }

  getElement(): HTMLElement {
    return this.resultView.getElement();
  }
}

export default ResultController;
