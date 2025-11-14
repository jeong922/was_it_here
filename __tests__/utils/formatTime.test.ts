import { formatTime } from '../../src/utils/formatTime';

describe('formatTime 함수 테스트', () => {
  test('0초는 00:00이어야 한다', () => {
    expect(formatTime(0)).toBe('00:00');
  });

  test('59초는 00:59이어야 한다', () => {
    expect(formatTime(59)).toBe('00:59');
  });

  test('60초는 01:00이어야 한다', () => {
    expect(formatTime(60)).toBe('01:00');
  });

  test('분과 초가 둘 다 2자리로 패딩되어야 한다', () => {
    expect(formatTime(5)).toBe('00:05');
    expect(formatTime(65)).toBe('01:05');
  });
});
