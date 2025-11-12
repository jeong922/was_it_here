// 보드데이터 관리

import { boards } from '../data/board';

export interface IBoardModel {
  readonly stage: number;
  readonly size: number;
  readonly answerBoard: number[][];
  readonly userBoard: number[][];
}

class BoardModel implements IBoardModel {
  readonly stage: number;
  readonly size: number;
  readonly answerBoard: number[][];
  readonly userBoard: number[][];

  constructor(stage: number) {
    this.stage = stage;
    const boardData = this.getBoard();
    this.size = boardData.length;
    this.answerBoard = boardData.map((row) => [...row]);
    this.userBoard = Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  private getBoard(): number[][] {
    const board = boards.find((board) => board.stage === this.stage)?.board;

    if (!board) {
      throw new Error(`Stage ${this.stage}에 해당하는 보드 데이터를 찾을 수 없습니다.`);
    }

    return board;
  }
}

export default BoardModel;
