import { test, expect } from './fixtures.js';

test.describe('Smoke Test', () => {
  test('should load the chess game', async ({ chessPage }) => {
    await chessPage.startGame('TestUser');
    
    await expect(chessPage).toHaveTitle('Chess Game');
    await expect(chessPage.getByTestId('board-container')).toBeVisible();
    await expect(chessPage.getByTestId('game-status-container')).toBeVisible();
  });
});