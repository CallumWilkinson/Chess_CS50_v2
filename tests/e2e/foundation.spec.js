import { test, expect } from "./fixtures.js";

test.describe("Foundation Tests", () => {
  test("Multiple users can connect", async ({ browser }) => {
    const page1 = await browser.newPage();
    const page2 = await browser.newPage();

    page1.on("dialog", async (dialog) => await dialog.accept("Player1"));
    page2.on("dialog", async (dialog) => await dialog.accept("Player2"));

    await Promise.all([page1.goto("/"), page2.goto("/")]);

    await expect(page1.getByTestId("board-container")).toBeVisible();
    await expect(page2.getByTestId("board-container")).toBeVisible();

    await page1.close();
    await page2.close();
  });
});
