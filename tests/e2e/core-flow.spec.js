import { test, expect, ChessTestHelpers } from './fixtures.js';

test.describe('Core Game Flow', () => {
  test('should initialize game with default color assignment', async ({ chessPage }) => {
    await ChessTestHelpers.initializeGame(chessPage, 'Player1');
    
    // First player should get black (per game logic)
    await expect(chessPage.getByTestId('game-status')).toHaveText('black');
    await chessPage.expectGameState('ongoing');
  });

  test('should allow basic piece movement', async ({ chessPage }) => {
    await ChessTestHelpers.initializeGame(chessPage, 'MoveTestPlayer');
    
    // Make a basic pawn move (e2 to e4)
    await ChessTestHelpers.makeMove(chessPage, 'e2', 'e4');
    
    // Turn should switch to white after black moves
    await ChessTestHelpers.expectMoveSuccess(chessPage, 'white');
  });

  test('should handle deterministic session IDs', async ({ chessPage, deterministic }) => {
    await ChessTestHelpers.initializeGame(chessPage, 'DeterministicPlayer');
    
    // Verify session ID format
    expect(deterministic.sessionId).toMatch(/^test-\d+-\w+$/);
    
    // Game should still work normally
    await chessPage.expectGameState('ongoing');
    await expect(chessPage.getByTestId('game-status')).toHaveText(/black|white/);
  });
});