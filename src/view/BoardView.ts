import BaseView from './BaseView';
import { boards } from '../data/board';
import type { CellClickHandler } from '../types/board';

export interface IBoardView {
  getElement(): HTMLElement;
  onCellClick(callback: CellClickHandler): void;
}
class BoardView extends BaseView implements IBoardView {
  private onCellClickCallback?: (row: number, col: number, value: number) => void;

  constructor() {
    super('div', 'game-board');
    this.bindEvents();
  }

  render(boardData: number[][]) {
    const boardHTML = this.createBoard(boardData);
    this.setTemplate(boardHTML);
  }

  private createBoard(boardData: number[][]): string {
    const size = boardData.length;
    const html = `
      <div class="cells" 
           style="display:grid;
                  grid-template-columns:repeat(${size},1fr);
                  grid-template-rows:repeat(${size},1fr);
                  ">
        ${boardData
          .map((row, rowIndex) =>
            row
              .map(
                (cellValue, colIndex) => `
                  <div 
                    class="cell" 
                    data-row="${rowIndex}" 
                    data-col="${colIndex}" 
                    data-value="${cellValue}">
                  </div>`
              )
              .join('')
          )
          .join('')}
      </div>
    `;
    return html;
  }

  private bindEvents() {
    this.element.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target.classList.contains('cell')) return;

      const row = Number(target.dataset.row);
      const col = Number(target.dataset.col);
      const value = Number(target.dataset.value);

      if (this.onCellClickCallback) {
        this.onCellClickCallback(row, col, value);
      }
    });
  }

  onCellClick(callback: CellClickHandler) {
    this.onCellClickCallback = callback;
  }
}

export default BoardView;
