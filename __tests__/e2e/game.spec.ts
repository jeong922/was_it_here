import { test, expect } from '@playwright/test';

test.describe('게임 E2E 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('첫 화면에서 게임 방법과 시작하기 버튼이 보여야 한다', async ({ page }) => {
    await expect(page.getByText('게임 방법')).toBeVisible();
    await expect(page.getByRole('button', { name: '시작하기' })).toBeVisible();
  });

  test('게임 시작하면 게임 방법 화면 사라지고 게임 보드와 대시보드가 생성된다.', async ({ page }) => {
    await page.getByRole('button', { name: '시작하기' }).click();
    await expect(page.locator('.game-container')).toBeVisible();
    await expect(page.locator('.game-dashboard')).toBeVisible();
  });

  test('게임 시작 후 정답 칸이 3초 후 사라져야 한다.', async ({ page }) => {
    await page.getByRole('button', { name: '시작하기' }).click();

    const answerBoard = page.locator('.answer');

    await expect(answerBoard).toBeVisible();
    await page.waitForTimeout(3000);
    await expect(answerBoard).toBeHidden();
  });

  test('정답 보드가 유저 보드로 전환된다', async ({ page }) => {
    await page.getByRole('button', { name: '시작하기' }).click();

    const answerBoard = page.locator('.answer');
    const userBoard = page.locator('.user');

    await expect(answerBoard).toBeVisible();
    await expect(answerBoard).toBeHidden();
    await expect(userBoard).toBeVisible();
  });

  test('정답 칸을 클릭하면 녹색으로 표시된다.', async ({ page }) => {
    const row = 0;
    const col = 2;

    await page.getByRole('button', { name: '시작하기' }).click();

    const answerBoard = page.locator('.answer');
    await expect(answerBoard).toBeHidden();

    const cellSelector = `.cell[data-row="${row}"][data-col="${col}"]`;
    await page.click(cellSelector);

    await expect(page.locator(cellSelector)).toHaveClass(/correct/);
  });

  test('오답 칸을 클릭하면 빨간색 표시되고 기회가 감소한다.', async ({ page }) => {
    const row = 0;
    const col = 1;

    await page.getByRole('button', { name: '시작하기' }).click();

    const answerBoard = page.locator('.answer');
    await expect(answerBoard).toBeHidden();

    const livesContainer = page.locator('.game-lives');
    const initialLivesCount = await livesContainer.locator('.lives-icon').count();
    const cellSelector = `.cell[data-row="${row}"][data-col="${col}"]`;
    await page.click(cellSelector);
    await expect(page.locator(cellSelector)).toHaveClass(/wrong/);
    await expect(livesContainer.locator('.fading-out')).toHaveCount(1);

    const expectedLivesCount = initialLivesCount - 1;
    await expect(livesContainer.locator('.lives-icon')).toHaveCount(expectedLivesCount);
  });

  test('모든 정답 칸을 클릭하면 성공이 표시된다.', async ({ page }) => {
    const cells = [
      { row: 0, col: 2 },
      { row: 2, col: 0 },
    ];

    await page.getByRole('button', { name: '시작하기' }).click();

    for (const cell of cells) {
      const selector = `.user .cell[data-row="${cell.row}"][data-col="${cell.col}"][data-value="0"]`;

      await page.click(selector);
    }

    await expect(page.getByText('성공')).toBeVisible();
  });

  test('모든 기회를 소진하면 실패 화면이 나타난다.', async ({ page }) => {
    const wrongCells = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
    ];

    await page.getByRole('button', { name: '시작하기' }).click();

    await expect(page.locator('.game-board')).toBeVisible();

    const livesContainer = page.locator('.game-lives');
    let currentLives = await livesContainer.locator('.lives-icon').count();

    for (const cell of wrongCells) {
      const selector = `.user .cell[data-row="${cell.row}"][data-col="${cell.col}"][data-value="0"]`;

      await page.click(selector);

      const expectedLives = currentLives - 1;

      await expect
        .poll(async () => {
          return await livesContainer.locator('.lives-icon').count();
        })
        .toBe(expectedLives);

      currentLives = expectedLives;
    }

    await expect(page.getByText('실패')).toBeVisible();
  });

  test('스테이지 클리어 후 다음 스테이지가 로드된다', async ({ page }) => {
    const cells = [
      { row: 0, col: 2 },
      { row: 2, col: 0 },
    ];

    await page.getByRole('button', { name: '시작하기' }).click();

    for (const cell of cells) {
      const selector = `.user .cell[data-row="${cell.row}"][data-col="${cell.col}"][data-value="0"]`;

      await page.click(selector);
    }

    await expect(page.getByText('성공')).toBeVisible();

    await page.getByRole('button', { name: '다음 스테이지' }).click();

    const stageNumber = page.locator('.game-stage');
    await expect(stageNumber).toHaveText('스테이지 2');
  });

  test('메인 화면으로 버튼을 누르면 처음 화면으로 돌아간다', async ({ page }) => {
    const wrongCells = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
    ];

    await page.getByRole('button', { name: '시작하기' }).click();

    await expect(page.locator('.game-board')).toBeVisible();

    const livesContainer = page.locator('.game-lives');
    let currentLivesCount = await livesContainer.locator('.lives-icon').count();

    for (const cell of wrongCells) {
      const selector = `.user .cell[data-row="${cell.row}"][data-col="${cell.col}"][data-value="0"]`; // .user 추가를 안하면 타이밍 문제로 테스트 계속 실패함

      await page.click(selector);

      const expectedLivesCount = currentLivesCount - 1;
      await expect(livesContainer.locator('.lives-icon')).toHaveCount(expectedLivesCount);

      currentLivesCount = expectedLivesCount;
    }

    const button = page.getByRole('button', { name: '메인 화면으로' });
    await expect(button).toBeVisible();

    await button.click();

    await expect(page.getByText('게임 방법')).toBeVisible();
  });

  test('메인 화면으로 버튼을 누르면 처음 화면으로 돌아간다. - poll 버전', async ({ page }) => {
    const wrongCells = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
    ];

    await page.getByRole('button', { name: '시작하기' }).click();

    await expect(page.locator('.game-board')).toBeVisible();

    const livesContainer = page.locator('.game-lives');
    let currentLives = await livesContainer.locator('.lives-icon').count();

    for (const cell of wrongCells) {
      const selector = `.user .cell[data-row="${cell.row}"][data-col="${cell.col}"][data-value="0"]`;

      await page.click(selector);

      const expectedLives = currentLives - 1;

      await expect
        .poll(async () => {
          return await livesContainer.locator('.lives-icon').count();
        })
        .toBe(expectedLives);

      currentLives = expectedLives;
    }

    const button = page.getByRole('button', { name: '메인 화면으로' });
    await expect(button).toBeVisible();

    await button.click();

    await expect(page.getByText('게임 방법')).toBeVisible();
  });
});
