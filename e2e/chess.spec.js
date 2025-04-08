import { test, expect } from "@playwright/test";
import { squareToCanvasCoordinates } from "../src/utils/coordinates";
import { UIConstants } from "../src/constants";

test("white pawn moves from e2 to e4 on its first turn", async ({ page }) => {
  await page.goto("http://127.0.0.1:5500"); //live server url, need to manually click live server to start test

  const canvas = await page.locator("#chessBoard");
  await expect(canvas).toBeVisible();

  const startSquareCoordinates = squareToCanvasCoordinates("e2");
  const targetSquareCoordinates = squareToCanvasCoordinates("e4");

  //click e2
  await page.mouse.click(startSquareCoordinates.x, startSquareCoordinates.y);

  //click e4
  await page.mouse.click(targetSquareCoordinates.x, targetSquareCoordinates.y);

  //wait for board to update, 200ms just to be safe
  await page.waitForTimeout(200);

  //should return the chesspeice object at the key e2 in the dictionary (the value at that key)
  const pieceAtE2 = await page.evaluate(() => {
    return window.board.grid["e2"];
  });

  const pieceAtE4 = await page.evaluate(() => {
    return window.board.grid["e4"];
  });

  expect(pieceAtE2).toBeNull();
  expect(pieceAtE4.name).toBe("pawn");
  expect(pieceAtE4.colour).toBe("white");
  expect(pieceAtE4.position).toBe("e4");
});
