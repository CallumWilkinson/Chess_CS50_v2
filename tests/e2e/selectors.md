# Test Selector Reference

## Data Test IDs

### Game Status and UI
- `data-testid="game-status-container"` - Container for game status elements
- `data-testid="turn-banner"` - Current turn heading ("Current Turn" or "Game Over")
- `data-testid="game-status"` - Game status text (color name or winner message)
- `data-testid="winner-display"` - Winner announcement (when game ends)
- `data-testid="board-container"` - Chess board canvas element

### Canvas Data Attributes
Since pieces and squares are drawn on canvas, we use data attributes on the canvas:
- `data-game-status` - Current game status (ongoing/checkmate/etc)
- `data-current-turn` - Current player turn (white/black)
- `data-winner` - Winner color (when game ends)

### Authentication (Future)
When implementing test-friendly auth:
- `data-testid="username-input"` - Username input field
- `data-testid="username-submit"` - Submit username button

### Game Actions (Future)
When implementing lobby/game controls:
- `data-testid="join-button"` - Join existing game button
- `data-testid="create-button"` - Create new game button  
- `data-testid="leave-button"` - Leave current game button

### Error Handling (Future)
- `data-testid="error-message"` - Error message display
- `data-testid="connection-status"` - Connection status indicator

## Canvas Testing Strategy

For canvas-based chess board:

1. **Board State Testing**: Use canvas data attributes
   ```javascript
   await expect(page.getByTestId('board-container')).toHaveAttribute('data-current-turn', 'white');
   ```

2. **Piece Movement Testing**: Use coordinate-based clicks
   ```javascript
   const canvas = page.getByTestId('board-container');
   const box = await canvas.boundingBox();
   await page.mouse.click(box.x + 320, box.y + 320); // Click center square
   ```

3. **Game State Verification**: Check data attributes
   ```javascript
   await expect(page.getByTestId('board-container')).toHaveAttribute('data-game-status', 'ongoing');
   ```

## Usage Examples

### Basic Game State Check
```javascript
// Wait for game to load
await expect(page.getByTestId('board-container')).toBeVisible();

// Check initial state
await expect(page.getByTestId('game-status')).toHaveText('black');
await expect(page.getByTestId('turn-banner')).toHaveText('Current Turn');
```

### Win Condition Check
```javascript
// After a winning move
await expect(page.getByTestId('turn-banner')).toHaveText('Game Over');
await expect(page.getByTestId('winner-display')).toContainText('wins by checkmate');
await expect(page.getByTestId('board-container')).toHaveAttribute('data-game-status', 'checkmate');
```

### Canvas Click Helper
```javascript
async function clickSquare(page, file, rank) {
  const canvas = page.getByTestId('board-container');
  const box = await canvas.boundingBox();
  
  // Convert chess notation to pixel coordinates
  const fileIndex = file.charCodeAt(0) - 97; // a=0, b=1, etc
  const rankIndex = 8 - parseInt(rank); // 8=0, 7=1, etc (flipped for canvas)
  
  const x = box.x + (fileIndex * 80) + 40; // 80px per square, center of square
  const y = box.y + (rankIndex * 80) + 40;
  
  await page.mouse.click(x, y);
}

// Usage
await clickSquare(page, 'e', '2'); // Click e2
await clickSquare(page, 'e', '4'); // Click e4
```

## Notes

- Canvas testing requires coordinate calculations
- Data attributes provide reliable state checking
- Future UI elements should follow the data-testid pattern
- Always prefer data-testid over CSS selectors or IDs for stability