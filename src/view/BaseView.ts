abstract class BaseView {
  protected element: HTMLElement;

  constructor(tagName: string, className?: string) {
    this.element = document.createElement(tagName);
    if (className) {
      this.element.className = className;
    }
  }

  getElement(): HTMLElement {
    return this.element;
  }

  protected setTemplate(html: string) {
    this.element.innerHTML = html;
  }
}

export default BaseView;
