import type { IRulesView } from '../../src/view/RulesView';
import RulesView from '../../src/view/RulesView';

describe('ResultView 테스트', () => {
  let rulesView: IRulesView;

  beforeEach(() => {
    document.body.innerHTML = '';
    rulesView = new RulesView();
    document.body.appendChild(rulesView.getElement());
  });

  test('초기 렌더링 시 게임 방법 설명과 시작하기 버튼이 생성되어야 한다.', () => {
    const title = document.querySelector('.rules-title');
    const rules = document.querySelectorAll('ul li');
    const startButton = document.querySelector('.game-start');

    expect(title).not.toBeNull();
    expect(title?.textContent).toBe('게임 방법');

    expect(rules.length).toBeGreaterThan(0);
    expect(startButton).not.toBeNull();
    expect(startButton?.textContent).toBe('시작하기');
  });

  test('시작하기 버튼 클릭 시 onGameStart에 등록된 핸들러가 호출되어야 한다.', () => {
    const handler = vi.fn();
    rulesView.onGameStart(handler);

    const startButton = document.querySelector('.game-start') as HTMLElement;
    startButton.click();

    expect(handler).toHaveBeenCalledTimes(1);
  });
});
