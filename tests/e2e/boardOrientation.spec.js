import { test, expect } from "./fixtures.js";

//i think my tests are flaky becuase they are not running in isolation, this is a known issue 11/9/25
//i believe the fix is to stop auto joining rooms on the backend 11/9/25
//tests will fail if i did not correctly shut down the server when manually testing as players get paired with players in other tests

test.describe("e2e Playwrite tests for board oritentation", () => {
  test("Both players see their pieces at bottom of screen", async ({
    twoPlayerGame,
  }) => {
    const { player1, player2 } = twoPlayerGame;

    //black player sees black pieces on bottom of page
    await expect(player1.getByTestId("board-container")).toHaveAttribute(
      "data-black-pieces-on-bottom",
      "true"
    );

    //white player sees white pieces on bottom of page
    await expect(player2.getByTestId("board-container")).toHaveAttribute(
      "data-black-pieces-on-bottom",
      "false"
    );

    await player1.clickSquare("a7");
    await player1.clickSquare("a5");

    await player2.clickSquare("h1");
    await player2.clickSquare("h4");

    //assert that white sees blacks move and its own move
    //asset that black sees whites move and its own move and that board shows as expected
    //this should confirm the mirroring flip of the ui for each player perspective is working as intended
  });
});
