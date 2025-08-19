# E2E Testing with Playwright

Simple end-to-end tests for the Chess application using Playwright.

## Test Structure

```
tests/e2e/
├── README.md                 # This file
├── foundation.spec.js       # Basic server and connectivity tests
├── smoke.spec.js            # Simple page load test
├── core-flow.spec.js        # Game interaction tests
└── fixtures.js              # Simple test helpers
```

## Key Test Elements

- `data-testid="board-container"` - Chess board canvas
- `data-testid="game-status"` - Game status text
- `data-testid="game-status-container"` - Status container

## Running Tests

```bash
# Run all tests
npx playwright test

# Run with UI mode
npx playwright test --ui

# Run in headed mode (see browser)
npx playwright test --headed
```

## Test Helpers

- `chessPage.startGame(username)` - Handle username dialog and load game
- `chessPage.clickSquare('e2')` - Click chess square by notation

Tests focus on basic functionality: page loads, board appears, clicks work.