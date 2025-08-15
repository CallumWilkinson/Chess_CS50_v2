import { test, expect } from "@playwright/test";

/**
 * Foundation Tests - Core Infrastructure
 * Tests the essential infrastructure for the chess game:
 * 1. Server starts and serves pages
 * 2. Socket.IO connection established
 * 3. Username entry works
 * 4. Game session creation
 */

const BASE_URL = "http://localhost:3000";

/**
 * Helper function to handle username dialog consistently
 */
async function setupUsernameDialog(page, username = "TestPlayer") {
  page.on("dialog", async (dialog) => {
    expect(dialog.type()).toBe("prompt");
    expect(dialog.message()).toBe("Enter your username:");
    await dialog.accept(username);
  });
}

test.describe("Foundation Tests - Core Infrastructure", () => {
  test("Server starts and serves pages correctly", async ({ page }) => {
    // Set up dialog handler first
    setupUsernameDialog(page, "TestUser");

    // Test that the server is running and serves the main page
    const response = await page.goto(BASE_URL);

    // Check that the page loads successfully
    expect(response?.status()).toBe(200);

    // Verify basic HTML structure exists
    await expect(page).toHaveTitle("Chess Game");
    await expect(page.locator("#chessBoard")).toBeVisible();
    await expect(page.locator("#current-turn-container")).toBeVisible();

    // Check that the canvas element has correct attributes
    const canvas = page.locator("#chessBoard");
    await expect(canvas).toHaveAttribute("width", "640");
    await expect(canvas).toHaveAttribute("height", "640");
  });

  test("Socket.IO connection establishes successfully", async ({ page }) => {
    setupUsernameDialog(page, "TestPlayer");

    await page.goto(BASE_URL);

    // Wait for Socket.IO to connect and establish game session
    // We'll know it's connected when the board renders and game state is received
    await expect(page.locator("#current-turn-contents")).toHaveText(
      /black|white/,
      { timeout: 15000 }
    );

    // Check that the canvas is visible (indicates successful rendering)
    await expect(page.locator("#chessBoard")).toBeVisible();

    // The fact that we have game state means Socket.IO connected successfully
    await expect(page.locator("#current-turn-contents")).not.toBeEmpty();
  });

  test("Username entry and authentication works", async ({ page }) => {
    const testUsername = "TestUser123";

    setupUsernameDialog(page, testUsername);

    await page.goto(BASE_URL);

    // Wait for game to initialize with username
    await expect(page.locator("#current-turn-contents")).toHaveText(
      /black|white/,
      { timeout: 15000 }
    );

    // Username is used internally - the fact that game loaded means it was processed
    await expect(page.locator("#chessBoard")).toBeVisible();
  });

  test("Game session creation and initialization works", async ({ page }) => {
    setupUsernameDialog(page, "SessionTestPlayer");

    await page.goto(BASE_URL);

    // Wait for game session to be created and initial state received
    await expect(page.locator("#current-turn-contents")).toHaveText(
      /black|white/,
      { timeout: 15000 }
    );

    // Verify game state indicates a new game session was created
    const turnIndicator = page.locator("#current-turn-contents");
    const currentTurn = await turnIndicator.textContent();

    // In a new game, it should show either 'black' or 'white'
    expect(["black", "white"]).toContain(currentTurn);

    // Verify the current turn heading is displayed
    await expect(page.locator("#current-turn-heading")).toHaveText(
      "Current Turn"
    );

    // Check that board rendered properly (indicates game session created successfully)
    await expect(page.locator("#chessBoard")).toBeVisible();
  });

  test("Multiple users can connect simultaneously", async ({ browser }) => {
    // Test that server can handle multiple connections
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    // Set up username prompts for both pages
    setupUsernameDialog(page1, "Player1");
    setupUsernameDialog(page2, "Player2");

    // Both players navigate to the game
    await Promise.all([page1.goto(BASE_URL), page2.goto(BASE_URL)]);

    // Both should be able to load the game
    await expect(page1.locator("#current-turn-contents")).toHaveText(
      /black|white/,
      { timeout: 15000 }
    );
    await expect(page2.locator("#current-turn-contents")).toHaveText(
      /black|white/,
      { timeout: 15000 }
    );

    // Both pages should have rendered boards
    await expect(page1.locator("#chessBoard")).toBeVisible();
    await expect(page2.locator("#chessBoard")).toBeVisible();

    // Clean up
    await context1.close();
    await context2.close();
  });

  test("Basic error handling - Invalid server connection", async ({ page }) => {
    // Test what happens when server is not available
    const invalidUrl = "http://localhost:9999"; // Non-existent server

    try {
      const response = await page.goto(invalidUrl, {
        waitUntil: "networkidle",
        timeout: 5000,
      });
      // If we get here, something unexpected happened
      expect(response?.status()).not.toBe(200);
    } catch (error) {
      // Expected behavior - connection should fail
      const errorMessage = error.message.toLowerCase();
      const hasConnectionError =
        errorMessage.includes("connection_refused") ||
        errorMessage.includes("could not connect") ||
        errorMessage.includes("ns_error_connection_refused") ||
        errorMessage.includes("timeout") ||
        errorMessage.includes("net::err");
      expect(hasConnectionError).toBe(true);
    }
  });
});
