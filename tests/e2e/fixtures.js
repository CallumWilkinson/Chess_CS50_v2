import { test as base, expect } from '@playwright/test';

/**
 * Extended test fixtures for chess game testing
 */
export const test = base.extend({
  // Fresh session ID for each test
  freshSession: async ({}, use) => {
    const sessionId = `test-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    await use(sessionId);
  },

  // Deterministic test configuration
  deterministic: async ({ freshSession }, use) => {
    const config = {
      sessionId: freshSession,
      forceColor: null,
    };
    await use(config);
  },

  // Chess page with enhanced capabilities
  chessPage: async ({ page, deterministic }, use) => {
    // Set environment variables for the Node.js server process
    if (deterministic.sessionId) {
      process.env.TEST_SESSION = deterministic.sessionId;
    }
    if (deterministic.forceColor) {
      process.env.TEST_FORCE_COLOR = deterministic.forceColor;
    }

    // Setup username dialog handler
    page.setupUsernameDialog = async (username = 'TestPlayer') => {
      page.on('dialog', async (dialog) => {
        expect(dialog.type()).toBe('prompt');
        expect(dialog.message()).toBe('Enter your username:');
        await dialog.accept(username);
      });
    };

    // Wait for game to be ready
    page.waitForGameReady = async () => {
      await expect(page.getByTestId('board-container')).toBeVisible();
      
      // Wait for initial game state to be received and processed
      // This indicates Socket.IO connection is working since the server sends this data
      await expect(page.getByTestId('game-status')).toHaveText(/black|white/, {
        timeout: 15000
      });
      
      // Ensure board is fully rendered with game data
      await expect(page.getByTestId('board-container')).toHaveAttribute('data-game-status', 'ongoing', {
        timeout: 10000
      });
    };

    // Click a chess square by notation
    page.clickSquare = async (file, rank) => {
      const canvas = page.getByTestId('board-container');
      
      // Wait for canvas to be fully rendered and interactive
      await canvas.waitFor({ state: 'attached' });
      await expect(canvas).toBeVisible();
      
      // Verify canvas context is available (indicates full rendering)
      await page.waitForFunction(() => {
        const canvas = document.querySelector('[data-testid="board-container"]');
        return canvas && canvas.getContext && canvas.offsetWidth > 0 && canvas.offsetHeight > 0;
      });
      
      const box = await canvas.boundingBox();
      
      if (!box) {
        throw new Error('Chess board not found or not visible');
      }
      
      // Convert chess notation to pixel coordinates
      const fileIndex = file.charCodeAt(0) - 97; // a=0, b=1, etc
      const rankIndex = 8 - parseInt(rank); // 8=0, 7=1, etc (flipped for canvas)
      
      const x = box.x + (fileIndex * 80) + 40; // 80px per square, center of square
      const y = box.y + (rankIndex * 80) + 40;
      
      await page.mouse.click(x, y);
      
      // Wait for click to be processed by checking for any visual feedback
      await page.waitForTimeout(50); // Minimal delay for event propagation
    };

    // Check game state helper
    page.expectGameState = async (state) => {
      await expect(page.getByTestId('board-container')).toHaveAttribute('data-game-status', state);
    };

    await use(page);
  },
});

/**
 * Re-export expect for convenience
 */
export { expect } from '@playwright/test';

/**
 * Utility function to create deterministic test with specific color
 */
export function testWithColor(color) {
  return test.extend({
    deterministic: async ({ freshSession }, use) => {
      await use({
        sessionId: freshSession,
        forceColor: color,
      });
    },
  });
}

/**
 * Common test patterns for chess games
 */
export const ChessTestHelpers = {
  /**
   * Standard game initialization flow
   */
  async initializeGame(page, username = 'TestPlayer') {
    await page.setupUsernameDialog(username);
    await page.goto('/');
    await page.waitForGameReady();
  },

  /**
   * Perform a standard chess move
   */
  async makeMove(page, from, to, options = {}) {
    const [fromFile, fromRank] = from.split('');
    const [toFile, toRank] = to.split('');
    
    // Capture current turn before making move
    const currentTurnElement = page.getByTestId('board-container');
    const currentTurn = await currentTurnElement.getAttribute('data-current-turn');
    
    await page.clickSquare(fromFile, fromRank);
    await page.clickSquare(toFile, toRank);
    
    // Wait for move to be processed by watching for state changes
    if (options.expectTurnChange !== false) {
      try {
        // Wait for turn to change or move to be rejected
        await expect.soft(currentTurnElement).not.toHaveAttribute('data-current-turn', currentTurn, {
          timeout: 5000
        });
      } catch (error) {
        // Move might have been invalid or we're in single-player mode
        // This is acceptable for some test scenarios
      }
    }
    
    // Small delay to ensure any UI updates are complete
    await page.waitForTimeout(100);
  },

  /**
   * Check that a move was successful by verifying turn change
   */
  async expectMoveSuccess(page, expectedNextTurn) {
    await expect(page.getByTestId('board-container')).toHaveAttribute('data-current-turn', expectedNextTurn, {
      timeout: 10000
    });
  },

  /**
   * Wait for and verify game end
   */
  async expectGameEnd(page, winner) {
    await expect(page.getByTestId('turn-banner')).toHaveText('Game Over');
    await expect(page.getByTestId('winner-display')).toContainText(`${winner} wins by checkmate`);
    await page.expectGameState('checkmate');
  },
};