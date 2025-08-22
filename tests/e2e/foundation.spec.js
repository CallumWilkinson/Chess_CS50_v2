import { test, expect } from "./fixtures.js";

test.describe("Foundation Tests of Core Gameplay", () => {
  test("both players move their pawns two spaces forward", async ({
    twoPlayerGame,
  }) => {
    const { player1, player2 } = twoPlayerGame;

    await player1.clickSquare("e2");
    await player1.clickSquare("e4");

    await player2.clickSquare("e7");
    await player2.clickSquare("e5");

    await expect(player1.getByTestId("board-container")).toBeVisible();
    await expect(player2.getByTestId("board-container")).toBeVisible();

    //should i have a better expect assertion here?
    //how do i assert that the move has actually happened?
  });
});
