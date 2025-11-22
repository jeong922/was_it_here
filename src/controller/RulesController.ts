import type { IRulesView } from '../view/RulesView';

export interface IRulesController {
  getElement(): HTMLElement;
}

class RulesController implements IRulesController {
  private rulesView: IRulesView;

  constructor(rulesView: IRulesView, onGameStartCallback: () => void) {
    this.rulesView = rulesView;
    this.bindEvents(onGameStartCallback);
  }

  private bindEvents(callback: () => void): void {
    this.rulesView.onGameStart(callback);
  }

  getElement(): HTMLElement {
    return this.rulesView.getElement();
  }
}

export default RulesController;
