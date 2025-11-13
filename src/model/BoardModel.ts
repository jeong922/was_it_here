// 보드데이터 관리

import { boards } from '../data/board';

export interface IBoardModel {
  readonly stage: number;
  readonly size: number;
  readonly answerBoard: number[][];
  readonly userBoard: number[][];
  readonly answerCount: number;
  markCell(row: number, col: number): boolean;
  isClear(): boolean;
}

class BoardModel implements IBoardModel {
  readonly stage: number;
  readonly size: number;
  readonly answerBoard: number[][];
  readonly userBoard: number[][];
  readonly answerCount: number;

  constructor(stage: number) {
    this.stage = stage;
    const boardData = this.getBoard();
    this.size = boardData.length;
    this.answerBoard = boardData.map((row) => [...row]);
    this.userBoard = Array.from({ length: this.size }, () => Array(this.size).fill(0));
    this.answerCount = this.calculateAnswerCount();
  }

  private getBoard(): number[][] {
    const board = boards.find((board) => board.stage === this.stage)?.board;

    if (!board) {
      throw new Error(`Stage ${this.stage}에 해당하는 보드 데이터를 찾을 수 없습니다.`);
    }

    return board;
  }

  markCell(row: number, col: number) {
    if (this.userBoard[row][col] === 1) {
      return false;
    }

    this.userBoard[row][col] = 1;

    return this.answerBoard[row][col] === 1;
  }

  private calculateAnswerCount(): number {
    return this.answerBoard.flat().filter((v) => v === 1).length;
  }

  private getCorrectCount(): number {
    let count = 0;
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.userBoard[r][c] === 1 && this.answerBoard[r][c] === 1) count++;
      }
    }
    return count;
  }

  isClear(): boolean {
    return this.getCorrectCount() === this.answerCount;
  }
}

export default BoardModel;
