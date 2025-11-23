import BaseView, { type IBaseView } from './BaseView';
import type { boardType, CellClickHandler } from '../types/board';

export interface IBoardView extends IBaseView {
  getElement(): HTMLElement;
  onCellClick(callback: CellClickHandler): void;
  render(boardData: number[][], type: boardType): void;
  markCellCorrect(row: number, col: number): void;
  markCellWrong(row: number, col: number): void;
}
class BoardView extends BaseView implements IBoardView {
  private onCellClickCallback?: (row: number, col: number, value: number) => void;

  constructor() {
    super('div', 'game-board');
    this.attachEventListeners();
  }

  render(boardData: number[][], type: boardType) {
    const boardHTML = this.createBoard(boardData, type);
    this.setTemplate(boardHTML);
  }

  private createBoard(boardData: number[][], type: boardType): string {
    const size = boardData.length;
    const html = `
      <div class="cells ${type}" 
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

  private attachEventListeners() {
    this.element.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (!target.classList.contains('cell')) return;

      const row = Number(target.dataset.row);
      const col = Number(target.dataset.col);
      const value = Number(target.dataset.value);

      this.onCellClickCallback?.(row, col, value);
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
