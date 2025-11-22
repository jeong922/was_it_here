import type { Mock } from 'vitest';
import RulesController, { type IRulesController } from '../../src/controller/RulesController';
import type { IRulesView } from '../../src/view/RulesView';

describe('RulesController 테스트', () => {
  let viewMock: IRulesView;
  let controller: IRulesController;
  let onStartMock: Mock;

  beforeEach(() => {
    vi.clearAllTimers();

    onStartMock = vi.fn();

    viewMock = {
      onGameStart: vi.fn(),
      getElement: vi.fn(),
    };

    controller = new RulesController(viewMock, onStartMock);
  });

  test('생성 시 view.onGameStart()에 콜백을 등록해야 한다', () => {
    expect(viewMock.onGameStart).toHaveBeenCalledTimes(1);
    expect(viewMock.onGameStart).toHaveBeenCalledWith(onStartMock);
  });

  test('getElement() 호출 시 view.getElement()를 호출하고 그 결과를 반환해야 한다', () => {
    const mockElement = document.createElement('div');

    (viewMock.getElement as Mock).mockReturnValue(mockElement);

    const result = controller.getElement();

    expect(viewMock.getElement).toHaveBeenCalledTimes(1);

    expect(result).toBe(mockElement);
  });
});
