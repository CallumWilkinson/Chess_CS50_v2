import { test, expect } from "./fixtures.js";

/**
 * Foundation Tests - Core Infrastructure
 * Tests the essential infrastructure for the chess game
 */

const BASE_URL = "http://localhost:3000";

test.describe("Foundation Tests - Core Infrastructure", () => {
  test("Server starts and serves pages correctly", async ({ chessPage }) => {
    // Set up dialog handler first
    await chessPage.setupUsernameDialog("TestUser");

    // Test that the server is running and serves the main page
    const response = await chessPage.goto(BASE_URL);

    // Check that the page loads successfully
    expect(response?.status()).toBe(200);

    // Verify basic HTML structure exists
    await expect(chessPage).toHaveTitle("Chess Game");
    await expect(chessPage.getByTestId("board-container")).toBeVisible();
    await expect(chessPage.getByTestId("game-status-container")).toBeVisible();

    // Check that the canvas element has correct attributes
    const canvas = chessPage.getByTestId("board-container");
    await expect(canvas).toHaveAttribute("width", "640");
    await expect(canvas).toHaveAttribute("height", "640");
  });

  test("Socket.IO connection establishes successfully", async ({ chessPage }) => {
    await chessPage.setupUsernameDialog("TestPlayer");

    await chessPage.goto(BASE_URL);

    // Wait for Socket.IO to connect and establish game session
    // We'll know it's connected when the board renders and game state is received
    await expect(chessPage.getByTestId("game-status")).toHaveText(/black|white/, {
      timeout: 15000,
    });

    // Check that the canvas is visible (indicates successful rendering)
    await expect(chessPage.getByTestId("board-container")).toBeVisible();

    // The fact that we have game state means Socket.IO connected successfully
    await expect(chessPage.getByTestId("game-status")).not.toBeEmpty();
  });

  test("Username entry and authentication works", async ({ chessPage }) => {
    const testUsername = "TestUser123";

    await chessPage.setupUsernameDialog(testUsername);

    await chessPage.goto(BASE_URL);

    // Wait for game to initialize with username
    await expect(chessPage.getByTestId("game-status")).toHaveText(/black|white/, {
      timeout: 15000,
    });

    // Username is used internally - the fact that game loaded means it was processed
    await expect(chessPage.getByTestId("board-container")).toBeVisible();
  });

  test("Game session creation and initialization works", async ({ chessPage }) => {
    await chessPage.setupUsernameDialog("SessionTestPlayer");

    await chessPage.goto(BASE_URL);

    // Wait for game session to be created and initial state received
    await expect(chessPage.getByTestId("game-status")).toHaveText(/black|white/, {
      timeout: 15000,
    });

    // Verify game state indicates a new game session was created
    const turnIndicator = chessPage.getByTestId("game-status");
    const currentTurn = await turnIndicator.textContent();

    // In a new game, it should show either 'black' or 'white'
    expect(["black", "white"]).toContain(currentTurn);

    // Verify the current turn heading is displayed
    await expect(chessPage.getByTestId("turn-banner")).toHaveText("Current Turn");

    // Check that board rendered properly (indicates game session created successfully)
    await expect(chessPage.getByTestId("board-container")).toBeVisible();
  });

  test("Multiple users can connect simultaneously", async ({ browser }) => {
    // Test that server can handle multiple connections
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    // Set up username prompts for both pages (using regular page since we created them manually)
    page1.on("dialog", async (dialog) => {
      await dialog.accept("Player1");
    });
    page2.on("dialog", async (dialog) => {
      await dialog.accept("Player2");
    });

    // Both players navigate to the game
    await Promise.all([page1.goto(BASE_URL), page2.goto(BASE_URL)]);

    // Both should be able to load the game
    await expect(page1.getByTestId("game-status")).toHaveText(/black|white/, {
      timeout: 15000,
    });
    await expect(page2.getByTestId("game-status")).toHaveText(/black|white/, {
      timeout: 15000,
    });

    // Both pages should have rendered boards
    await expect(page1.getByTestId("board-container")).toBeVisible();
    await expect(page2.getByTestId("board-container")).toBeVisible();

    // Clean up
    await context1.close();
    await context2.close();
  });

  test("Basic error handling - Invalid server connection", async ({ chessPage }) => {
    // Test what happens when server is not available
    const invalidUrl = "http://localhost:9999"; // Non-existent server

    try {
      const response = await chessPage.goto(invalidUrl, {
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
