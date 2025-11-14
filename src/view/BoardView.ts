import BaseView, { type IBaseView } from './BaseView';
import type { CellClickHandler } from '../types/board';

export interface IBoardView extends IBaseView {
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
                    class="cell ${cellValue === 1 ? 'correct' : ''}" 
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

  markCellCorrect(row: number, col: number) {
    const cell = this.getElement().querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    cell?.classList.add('correct');
  }

  markCellWrong(row: number, col: number) {
    const cell = this.getElement().querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    cell?.classList.add('wrong');
  }
}

export default BoardView;
