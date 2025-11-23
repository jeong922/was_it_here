import type { IResultView } from '../../src/view/ResultView';
import ResultView from '../../src/view/ResultView';

describe('ResultView 테스트', () => {
  let resultView: IResultView;

  beforeEach(() => {
    document.body.innerHTML = '';
    resultView = new ResultView();
    document.body.appendChild(resultView.getElement());
  });

  test('초기 렌더링 시 result UI가 생성되어야 한다.', () => {
    const stageState = document.querySelector('.stage-state');
    const stage = document.querySelector('.stage');
    const time = document.querySelector('.time');
    const lives = document.querySelector('.lives');
    const nextButton = document.querySelector('.next-button');

    expect(stageState).not.toBeNull();
    expect(stage).not.toBeNull();
    expect(time).not.toBeNull();
    expect(lives).not.toBeNull();
    expect(nextButton).not.toBeNull();
  });

  test('displayResultUI(stageClear)은 "성공"과 "다음 스테이지" 버튼을 표시해야 한다.', () => {
    resultView.displayResultUI('stageClear');

    const state = document.querySelector('.stage-state')!;
    const button = document.querySelector('.next-button')!;

    expect(state.textContent).toBe('성공');
    expect(button.textContent).toBe('다음 스테이지');
  });

  test('displayResultUI(gameOver)은 "실패"와 "메인 화면으로" 버튼을 표시해야 한다.', () => {
    resultView.displayResultUI('gameOver');

    const state = document.querySelector('.stage-state')!;
    const button = document.querySelector('.next-button')!;

    expect(state.textContent).toBe('실패');
    expect(button.textContent).toBe('메인 화면으로');
  });

  test('displayResultUI(end)은 "게임 종료"와 "메인 화면으로" 버튼을 표시해야 한다.', () => {
    resultView.displayResultUI('end');

    const state = document.querySelector('.stage-state')!;
    const button = document.querySelector('.next-button')!;

    expect(state.textContent).toBe('게임 종료');
    expect(button.textContent).toBe('메인 화면으로');
  });

  test('setResultStage()는 스테이지 숫자를 업데이트해야 한다.', () => {
    resultView.setResultStage(7);
    const stage = document.querySelector('.stage')!;
    expect(stage.textContent).toBe('7');
  });

  test('setResultTimer()는 타이머 텍스트를 업데이트해야 한다.', () => {
    resultView.setResultTimer(20);
    const time = document.querySelector('.time')!;
    expect(time.textContent).toBe('00:20');
  });

  test('setResultLives()는 하트 개수를 업데이트해야 한다.', () => {
    resultView.setResultLives(3);
    const hearts = document.querySelectorAll('.lives-icon');
    expect(hearts.length).toBe(3);
  });

  test('showModal()은 active 클래스를 추가해야 한다.', () => {
    resultView.showModal();
    expect(resultView.getElement().classList.contains('active')).toBe(true);
  });

  test('hideModal()은 active 클래스를 제거해야 한다.', () => {
    resultView.showModal();
    resultView.hideModal();
    expect(resultView.getElement().classList.contains('active')).toBe(false);
  });

  test('next 버튼 클릭 시 onNext()에 등록된 핸들러가 호출되어야 한다.', () => {
    const mockHandler = vi.fn();
    resultView.onNext(mockHandler);

    const button = document.querySelector('.next-button') as HTMLElement;
    button.click();

    expect(mockHandler).toHaveBeenCalledTimes(1);
  });
});
