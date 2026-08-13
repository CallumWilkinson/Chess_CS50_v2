import { test, expect } from "./fixtures.js";

test.describe("Smoke Test", () => {
  test("loads the welcome page", async ({ welcomePage }) => {
    // Given
    // A user opens the application

    // When
    // The root route redirects them to the welcome page
    await expect(welcomePage).toHaveURL(/\/welcome\.html$/);

    // Then
    // The main welcome page controls are visible
    await expect(welcomePage).toHaveTitle("Online Multiplayer Chess");

    await expect(
      welcomePage.getByRole("heading", {
        name: "Online Multiplayer Chess",
      }),
    ).toBeVisible();

    await expect(
      welcomePage.getByRole("link", {
        name: "Create New Game",
      }),
    ).toBeVisible();

    await expect(
      welcomePage.getByRole("link", {
        name: "Join Existing Game",
      }),
    ).toBeVisible();
  });
});
