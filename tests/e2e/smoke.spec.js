import { test, expect, ChessTestHelpers } from './fixtures.js';

test.describe('Smoke Test', () => {
  test('should load the chess game homepage', async ({ chessPage }) => {
    // Use fixtures to initialize game
    await ChessTestHelpers.initializeGame(chessPage, 'SmokeTestUser');
    
    // Check that the page loads and has basic structure
    await expect(chessPage).toHaveTitle('Chess Game');
    await expect(chessPage.getByTestId('board-container')).toBeVisible();
    await expect(chessPage.getByTestId('game-status-container')).toBeVisible();
    
    // Verify game is in initial state
    await chessPage.expectGameState('ongoing');
    await expect(chessPage.getByTestId('turn-banner')).toHaveText('Current Turn');
  });

  test('should handle deterministic session ID', async ({ chessPage, deterministic }) => {
    await ChessTestHelpers.initializeGame(chessPage, 'DeterministicUser');
    
    // Session ID should be deterministic
    expect(deterministic.sessionId).toMatch(/^test-\d+-\w+$/);
    
    // Game should still initialize properly
    await chessPage.expectGameState('ongoing');
  });
});