import type { IDashboardView } from '../../src/view/DashboardView';
import DashboardView from '../../src/view/DashboardView';

vi.useFakeTimers();

describe('DashboardView 테스트', () => {
  let dashboardView: IDashboardView;

  beforeEach(() => {
    dashboardView = new DashboardView();
    document.body.innerHTML = '';
    document.body.append(dashboardView.getElement());
  });

  test('render()가 호출되면 스테이지 DOM이 생성되어야 한다.', () => {
    const stageElement = document.querySelector('.game-stage');
    expect(stageElement).not.toBeNull();
  });

  test('render()가 호출되면 타이머 DOM이 생성되어야 한다.', () => {
    const timerElement = document.querySelector('.game-timer');
    expect(timerElement).not.toBeNull();
  });

  test('render()가 호출되면 기회(lives) DOM이 생성되어야 한다.', () => {
    const livesElement = document.querySelector('.game-lives');
    expect(livesElement).not.toBeNull();
  });

  test('setTimer()는 포맷팅 된 시간을 DOM에 반영해야 한다.', () => {
    dashboardView.setTimer(75);

    const timerElement = document.querySelector('.game-timer');
    expect(timerElement?.textContent).toBe('01:15');
  });

  test("setStage()는 stage를 받아와 '스테이지 ${stage}' 형태로 표시해야 한다.", () => {
    dashboardView.setStage(2);

    const stageElement = document.querySelector('.game-stage');
    expect(stageElement?.textContent).toBe('스테이지 2');
  });

  test('기회(lives)가 증가하면 즉시 새 하트 아이콘으로 업데이트 해야 한다.', () => {
    dashboardView.setLives(3);

    const hearts = document.querySelectorAll('.lives-icon');
    expect(hearts.length).toBe(3);
  });

  test('기회(lives)가 감소하면 fading-out 클래스가 추가되고 400ms지연 후 업데이트되어야 한다.', () => {
    dashboardView.setLives(3);
    expect(document.querySelectorAll('.lives-icon').length).toBe(3);

    dashboardView.setLives(2);

    const fading = document.querySelectorAll('.lives-icon.fading-out');
    expect(fading.length).toBe(1);

    let hearts = document.querySelectorAll('.lives-icon');
    expect(hearts.length).toBe(3);

    vi.advanceTimersByTime(400);

    hearts = document.querySelectorAll('.lives-icon');
    expect(hearts.length).toBe(2);
  });

  test('기회(lives) 감소 중 재호출 시 이전 타이머는 초기화되어야 한다.', () => {
    dashboardView.setLives(5);
    dashboardView.setLives(3);

    expect(document.querySelectorAll('.fading-out').length).toBe(2);

    let hearts = document.querySelectorAll('.lives-icon');
    expect(hearts.length).toBe(5);

    dashboardView.setLives(1);

    expect(document.querySelectorAll('.fading-out').length).toBe(4);
    hearts = document.querySelectorAll('.lives-icon');
    expect(hearts.length).toBe(5);

    vi.advanceTimersByTime(400);

    hearts = document.querySelectorAll('.lives-icon');
    expect(hearts.length).toBe(1);
  });
});
