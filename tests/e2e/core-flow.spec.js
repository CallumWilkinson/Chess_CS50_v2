import { test, expect } from './fixtures.js';

test.describe('Core Game Flow', () => {
  test('should start game and show board', async ({ chessPage }) => {
    await chessPage.startGame('Player1');
    await expect(chessPage.getByTestId('board-container')).toBeVisible();
  });

  test('should allow clicking on chess squares', async ({ chessPage }) => {
    await chessPage.startGame('MovePlayer');
    
    await chessPage.clickSquare('e7');
    await chessPage.clickSquare('e5');
    
    await expect(chessPage.getByTestId('board-container')).toBeVisible();
  });
});