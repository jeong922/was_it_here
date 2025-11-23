import type { IGameView } from '../../src/view/GameView';
import GameView from '../../src/view/GameView';

describe('GameView 테스트', () => {
  let gameView: IGameView;
  let appendedElement: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = '';
    gameView = new GameView();
    appendedElement = gameView.render();
    document.body.append(appendedElement);
  });

  test('render()는 HTMLElement를 반환해야 한다.', () => {
    expect(appendedElement).toBeInstanceOf(HTMLElement);
  });

  test('render()는 호출될 때마다 동일한 HTMLElement 인스턴스를 반환해야 한다.', () => {
    const firstElement = appendedElement;
    const secondElement = gameView.render();
    expect(firstElement).toBe(secondElement);
  });

  test('root 엘리먼트는 <main class="game"> 이어야 한다.', () => {
    const root = document.querySelector('main.game');
    expect(root).not.toBeNull();
    expect(root!.tagName).toBe('MAIN');
    expect(root!.classList.contains('game')).toBe(true);
    expect(root).toBe(appendedElement);
  });

  test('render() 호출 시 제목 .title DOM이 생성되어야 한다.', () => {
    const title = document.querySelector('.title');
    expect(title).not.toBeNull();
    expect(title?.textContent).toBe('이건가...?🤔');
  });
});
