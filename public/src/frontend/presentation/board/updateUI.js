import {
  UIConstants,
  FilesAndRanks,
  GameStatus,
} from "@shared/utilities/constants.js";
import {
  getFileIndex,
  getRankIndex,
  isLightSquare,
} from "@shared/utilities/toSquareNotation.js";
import {
  squareToPixelCoordinates,
  squareToPieceCenterCoordinates,
  getRankLabelCoordinates,
  getFileLabelCoordinates,
} from "../../domain/board/coordinateMapping.js";
import {
  transformCoordinatesForPlayer,
  updateHTMLTestAttributesForFlippedBoard,
} from "../../domain/board/boardOrientation.js";
import {
  formatColourLabel,
  normalizeChessColour,
} from "../../domain/players/chessColours.js";
import { renderPlayerCards } from "../players/renderPlayerCards.js";

/**
 * Update the visual chess board UI with current game state
 * Redraws the entire board, pieces, coordinates, and turn indicator
 * Called every time a turn ends or game state changes
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context
 * @param {Board} board - Current board state with piece positions
 * @param {GameStateManager} gameStateManager - Game state for turn tracking
 * @param {string} playerColour - Current player's color for board orientation
 * @param {Record<string, {username: string|null, colour: string|null}>} playerRoster - Players keyed by colour.
 * @param {string} viewerUsername - Username of the local viewer.
 */
export function updateUI(
  ctx,
  board,
  gameStateManager,
  playerColour,
  playerRoster = {},
  viewerUsername = ""
) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.canvas.setAttribute("data-game-status", gameStateManager.gameStatus);
  ctx.canvas.setAttribute(
    "data-current-turn",
    gameStateManager.currentPlayerColour
  );

  ctx.font = `${UIConstants.TILESIZE - 65}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  Object.keys(board.grid).forEach((square) => {
    const row = getRankIndex(square);
    const col = getFileIndex(square);

    const { rank: transformedRow, file: transformedCol } =
      transformCoordinatesForPlayer(row, col, playerColour);
    const { x, y } = squareToPixelCoordinates(transformedCol, transformedRow);

    updateHTMLTestAttributesForFlippedBoard(playerColour);

    if (isLightSquare(square)) {
      ctx.fillStyle = "#EEEED5";
    } else {
      ctx.fillStyle = "#7D945D";
    }
    ctx.fillRect(x, y, UIConstants.TILESIZE, UIConstants.TILESIZE);

    if (transformedCol === 0) {
      ctx.fillStyle = "black";
      const rankCoordinates = getRankLabelCoordinates(transformedRow);
      ctx.fillText(
        FilesAndRanks.RANKS[row],
        rankCoordinates.x,
        rankCoordinates.y
      );
    }

    if (transformedRow === 7) {
      ctx.fillStyle = "black";
      const fileCoordinates = getFileLabelCoordinates(transformedCol);
      ctx.fillText(
        FilesAndRanks.FILES[col],
        fileCoordinates.x,
        fileCoordinates.y
      );
    }
  });

  ctx.font = `${UIConstants.TILESIZE - 15}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (const square in board.grid) {
    if (!board.grid[square]) {
      continue;
    }

    const currentPiece = board.grid[square];
    const file = getFileIndex(square);
    const rank = getRankIndex(square);
    const { rank: transformedRank, file: transformedFile } =
      transformCoordinatesForPlayer(rank, file, playerColour);
    const { x, y } = squareToPieceCenterCoordinates(
      transformedFile,
      transformedRank
    );

    if (currentPiece.colour === "white") {
      ctx.fillText(currentPiece.whiteUnicodeLogo, x, y);
    } else if (currentPiece.colour === "black") {
      ctx.fillText(currentPiece.blackUnicodeLogo, x, y);
    }
  }

  renderPlayerCards(playerRoster, {
    viewerColour: playerColour,
    viewerUsername,
  });

  updateTurnDisplay(gameStateManager, playerRoster);
}

function updateTurnDisplay(gameStateManager, playerRoster) {
  const headingElement = document.getElementById("current-turn-heading");
  const contentElement = document.getElementById("current-turn-contents");
  if (!headingElement || !contentElement) {
    return;
  }

  if (gameStateManager.gameStatus === GameStatus.CHECKMATE) {
    headingElement.textContent = "Game Over";

    const winnerColour = normalizeChessColour(gameStateManager.winner);
    const winnerDetails = resolvePlayerDetails(playerRoster, winnerColour);
    const winnerName =
      winnerDetails.username || winnerDetails.colourLabel || "Unknown";

    contentElement.textContent = `${winnerName} wins by checkmate!`;
    contentElement.setAttribute("data-testid", "winner-display");
    let winnerAttributeValue = "";
    if (typeof gameStateManager.winner === "string") {
      winnerAttributeValue = gameStateManager.winner;
    }

    contentElement.setAttribute("data-winner", winnerAttributeValue);
    if (winnerColour) {
      contentElement.setAttribute("data-winner-colour", winnerColour);
    } else {
      contentElement.removeAttribute("data-winner-colour");
    }
    contentElement.removeAttribute("data-current-turn");
    return;
  }

  headingElement.textContent = "Current Turn";

  const currentColour = normalizeChessColour(
    gameStateManager.currentPlayerColour
  );
  const currentDetails = resolvePlayerDetails(playerRoster, currentColour);
  const turnMessage = buildTurnMessage(
    currentDetails.colourLabel,
    currentDetails.username
  );

  contentElement.textContent = turnMessage;
  contentElement.setAttribute("data-current-turn", currentColour || "");
  contentElement.removeAttribute("data-testid");
  contentElement.removeAttribute("data-winner");
  contentElement.removeAttribute("data-winner-colour");
}

function resolvePlayerDetails(playerRoster, colour) {
  if (!colour || !playerRoster || typeof playerRoster !== "object") {
    return { username: null, colourLabel: "" };
  }

  const rosterEntry = playerRoster[colour];
  let username = null;
  if (
    typeof rosterEntry?.username === "string" &&
    rosterEntry.username.trim().length > 0
  ) {
    username = rosterEntry.username;
  }
  const colourLabel = formatColourLabel(colour);

  return { username, colourLabel };
}

function buildTurnMessage(colourLabel, username) {
  if (colourLabel && username) {
    return `${colourLabel} - ${username}'s turn`;
  }

  if (colourLabel) {
    return `${colourLabel}'s turn`;
  }

  if (username) {
    return `${username}'s turn`;
  }

  return "Waiting for turn data";
}
