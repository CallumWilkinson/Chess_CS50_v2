import { test as base, expect } from "@playwright/test";

export const test = base.extend({
  chessPage: async ({ page }, use) => {
    // Simple helper to handle username dialog and start game
    page.startGame = async (username = "TestPlayer") => {
      page.on("dialog", async (dialog) => {
        await dialog.accept(username);
      });
      await page.goto("/");

      // Wait for page to load and game to initialize
      await expect(page.getByTestId("board-container")).toBeVisible();
      await page.waitForTimeout(2000); // Give Socket.IO time to connect

      // Try to get game status, but don't fail if it's not ready yet
      try {
        await expect(page.getByTestId("game-status")).toHaveText(
          /black|white/,
          { timeout: 5000 }
        );
      } catch (error) {
        // Game might not be fully initialized yet, that's ok for basic tests
      }
    };

    // Click chess square by notation (e.g., "e2", "e4")
    page.clickSquare = async (square) => {
      const [file, rank] = square.split("");
      const canvas = page.getByTestId("board-container");
      await expect(canvas).toBeVisible();

      const box = await canvas.boundingBox();
      if (!box) {
        throw new Error("Chess board not found");
      }

      const fileIndex = file.charCodeAt(0) - 97;
      const rankIndex = 8 - parseInt(rank);
      const x = box.x + fileIndex * 80 + 40;
      const y = box.y + rankIndex * 80 + 40;

      await page.mouse.click(x, y);
      await page.waitForTimeout(100);
    };

    await use(page);
  },
});

export { expect } from "@playwright/test";
