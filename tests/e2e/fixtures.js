// fixtures.js
import { test as base, expect } from "@playwright/test";

/**
 * Private helper: attach chess helpers to any Playwright Page.
 * Not exported. Both fixtures use this so there is a single definition.
 */
function enhanceChessPage(page) {
  // Start game with an auto username prompt
  page.startGame = async (username = "TestPlayer") => {
    page.on("dialog", async (dialog) => {
      await dialog.accept(username);
    });

    await page.goto("/");

    await expect(page.getByTestId("board-container")).toBeVisible();
    await page.waitForTimeout(2000); // allow Socket.IO to connect

    try {
      await expect(page.getByTestId("game-status")).toHaveText(/black|white/, {
        timeout: 5000,
      });
    } catch (error) {
      // OK if not ready yet for basic tests
    }
  };

  // Click a chess square like "e2"
  page.clickSquare = async (square) => {
    const [file, rank] = square.split("");
    const canvas = page.getByTestId("board-container");
    await expect(canvas).toBeVisible();

    const box = await canvas.boundingBox();
    if (!box) {
      throw new Error("Chess board not found");
    }

    const fileIndex = file.charCodeAt(0) - 97; // a→0 … h→7
    const rankIndex = 8 - parseInt(rank, 10); // flip ranks: "1" bottom → 7
    const SQUARE = 80;
    const HALF = SQUARE / 2;

    const x = box.x + fileIndex * SQUARE + HALF;
    const y = box.y + rankIndex * SQUARE + HALF;

    await page.mouse.click(x, y);
    await page.waitForTimeout(100);
  };

  return page; // for convenience if you like chaining
}

/**
 * Tests can do: test("...", async ({ chessPage }) => { await chessPage.startGame(); ... })
 */
export const test = base.extend({
  chessPage: async ({ page }, use) => {
    enhanceChessPage(page);
    await use(page);
  },

  /**
   * two-player fixture.
   * Creates two isolated contexts and hands back ready pages with helpers.
   * Usage:
   *   test("...", async ({ twoPlayerGame }) => {
   *     const { player1, player2 } = twoPlayerGame;
   *     await player1.clickSquare("e2");
   *   })
   */
  twoPlayerGame: async ({ browser }, use) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const player1 = enhanceChessPage(await context1.newPage());
    const player2 = enhanceChessPage(await context2.newPage());

    // Start both players in parallel so the session setup is realistic and fast
    await Promise.all([
      player1.startGame("Player1"),
      player2.startGame("Player2"),
    ]);

    try {
      await use({ player1, player2 });
    } finally {
      await context1.close();
      await context2.close();
    }
  },
});

export { expect } from "@playwright/test";
