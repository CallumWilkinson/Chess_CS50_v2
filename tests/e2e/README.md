# E2E Testing with Playwright

This directory contains end-to-end tests for the Chess application using Playwright.

## Test Structure

```
tests/e2e/
├── README.md                 # This file
├── foundation.spec.js       # Core infrastructure tests
├── smoke.spec.js            # Basic smoke test
├── core-flow.spec.js        # Game flow tests
├── fixtures.js              # Shared test fixtures
└── selectors.md            # Test selector documentation
```

## Test Data Attributes

All interactive elements should have `data-testid` attributes for stable test selectors:

### Authentication & Setup
- `data-testid="username-input"` - Username input field
- `data-testid="username-submit"` - Submit username button

### Game Lobby  
- `data-testid="join-button"` - Join existing game button
- `data-testid="create-button"` - Create new game button
- `data-testid="leave-button"` - Leave current game button

### Game Board
- `data-testid="board-container"` - Chess board container
- `data-testid="square-{position}"` - Individual squares (e.g. "square-e4")
- `data-testid="piece-{type}-{color}"` - Pieces (e.g. "piece-pawn-white")

### Game State
- `data-testid="turn-banner"` - Current turn indicator
- `data-testid="game-status"` - Game status (ongoing/checkmate/etc)
- `data-testid="winner-display"` - Winner announcement

### Error Handling
- `data-testid="error-message"` - Error message display
- `data-testid="connection-status"` - Connection status indicator

## Running Tests

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test smoke.spec.js

# Run with UI mode
npx playwright test --ui

# Run in headed mode (see browser)
npx playwright test --headed

# Generate test report
npx playwright show-report
```

## Test Environment Variables

- `TEST_FORCE_COLOR=white|black` - Force player color assignment
- `TEST_SESSION=session-id` - Use specific session ID
- `PORT=3000` - Server port (default: 3000)

## Best Practices

1. **Use data-testid selectors**: `page.getByTestId('username-input')`
2. **Explicit waits**: `await expect(element).toBeVisible()`
3. **No hard sleeps**: Avoid `page.waitForTimeout()` unless absolutely necessary
4. **Clean state**: Each test should start with a fresh game session
5. **Deterministic**: Tests should be repeatable and not flaky

## Test Categories

### Foundation Tests
- Server startup and connectivity
- Socket.IO connection establishment  
- Basic page rendering

### Core Flow Tests
- User authentication
- Game session creation
- Basic piece movement
- Turn switching

### Game Logic Tests
- Move validation
- Piece capture
- Win conditions
- Error handling

### UI Tests
- Board rendering
- Piece positioning
- Visual feedback
- Responsive behavior