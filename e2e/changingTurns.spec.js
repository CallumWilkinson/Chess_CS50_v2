import { test, expect } from "@playwright/test";
import { squareToCanvasCoordinates } from "../src/utils/coordinates";
import { UIConstants } from "../src/constants";

test("black tries to move on whites turn and is unable to", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:5500"); //live server url, need to manually click live server to start test

  const canvas = await page.locator("#chessBoard");
  await expect(canvas).toBeVisible();

  // get canvas position on screen
  const box = await canvas.boundingBox();
  const startSquareCoordinates = squareToCanvasCoordinates("c2");
  const targetSquareCoordinates = squareToCanvasCoordinates("c3");

  //click c2
  await page.mouse.click(
    box.x + startSquareCoordinates.x,
    box.y + startSquareCoordinates.y
  );

  //click c3
  await page.mouse.click(
    box.x + targetSquareCoordinates.x,
    box.y + targetSquareCoordinates.y
  );

  //wait for board to update, 200ms just to be safe
  await page.waitForTimeout(200);

  const pieceAtC2 = await page.evaluate(() => {
    return window.board.grid["c2"];
  });

  const pieceAtC3 = await page.evaluate(() => {
    return window.board.grid["c3"];
  });

  expect(pieceAtC3).toBeNull();
  expect(pieceAtC2.name).toBe("pawn");
  expect(pieceAtC2.colour).toBe("black");
  expect(pieceAtC2.position.name).toBe("c2");
});
