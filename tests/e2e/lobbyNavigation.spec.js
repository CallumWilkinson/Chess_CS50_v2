import { test, expect } from "@playwright/test";

test("creator remains the only player after navigating to the game page", async ({
  browser,
}) => {
  // Given
  const creatorContext = await browser.newContext();
  const observerContext = await browser.newContext();

  const creatorPage = await creatorContext.newPage();
  const observerPage = await observerContext.newPage();

  creatorPage.on("dialog", async (dialog) => {
    if (dialog.message() === "Enter a lobby name:") {
      await dialog.accept("Regression Lobby");
      return;
    }

    if (dialog.message() === "Enter your username:") {
      await dialog.accept("Creator");
    }
  });

  await creatorPage.goto("/welcome.html");

  // When
  await creatorPage.getByRole("link", { name: /create new game/i }).click();

  await expect(creatorPage).toHaveURL(/index\.html\?session=/);

  // Give the game-page socket time to connect and join the session.
  await creatorPage.waitForLoadState("load");

  // And another independent client checks the available lobbies.
  await observerPage.goto("/welcome.html");

  await observerPage.getByRole("link", { name: /join existing game/i }).click();

  // Then
  const lobbyRow = observerPage.getByRole("row").filter({
    hasText: "Regression Lobby",
  });

  await expect(lobbyRow).toBeVisible();
  await expect(lobbyRow).toContainText("1/2");

  await creatorContext.close();
  await observerContext.close();
});
