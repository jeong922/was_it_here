interface IBaseView {
  getElement(): HTMLElement;
}

abstract class BaseView implements IBaseView {
  protected element: HTMLElement;

  constructor(tagName: string, className?: string) {
    this.element = document.createElement(tagName);
    if (className) {
      this.element.className = className;
    }
  }

  protected setTemplate(html: string) {
    this.element.innerHTML = html;
  }

  getElement(): HTMLElement {
    return this.element;
  }
}

export default BaseView;
