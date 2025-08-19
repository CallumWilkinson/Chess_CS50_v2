import { test, expect } from "./fixtures.js";

test.describe("Foundation Tests of Core Gameplay", () => {
  test("both players move their pawns two spaces forward", async ({
    twoPlayers,
  }) => {
    const { page1, page2 } = twoPlayers;

    await page1.clickSquare("e2");
    await page1.clickSquare("e4");

    await page2.clickSquare("e7");
    await page2.clickSquare("e5");

    await expect(page1.getByTestId("board-container")).toBeVisible();
    await expect(page2.getByTestId("board-container")).toBeVisible();

    //should i have a better expect assertion here?
    //how do i assert that the move has actually happened?
  });
});
