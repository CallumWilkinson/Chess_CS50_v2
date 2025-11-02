import {
  formatColourLabel,
  getOppositeColour,
  normalizeChessColour,
} from "../../domain/players/chessColours.js";

const OPPONENT_PLACEHOLDER = "Waiting for player";

/**
 * Render the player identity cards around the board.
 * @param {Record<string, {username: string|null, colour: string|null}>} rosterByColour - Players keyed by colour.
 * @param {Object} options - Rendering options.
 * @param {string|null|undefined} options.viewerColour - Local player's colour.
 * @param {string|null|undefined} options.viewerUsername - Local player's username.
 */
export function renderPlayerCards(
  rosterByColour = {},
  { viewerColour, viewerUsername } = {}
) {
  const normalizedViewerColour = normalizeChessColour(viewerColour);
  const opponentColour = getOppositeColour(normalizedViewerColour);

  const selfEntry = getEntryForColour(rosterByColour, normalizedViewerColour);
  const opponentEntry = getEntryForColour(rosterByColour, opponentColour);

  const selfUsername = resolveUsername(selfEntry?.username, viewerUsername);
  setElementText("player-self-username", selfUsername, "Unknown");

  const selfColourLabel = formatColourLabel(resolveColour(selfEntry?.colour, normalizedViewerColour));
  setElementText("player-self-colour", selfColourLabel, "");

  const opponentUsername = resolveUsername(opponentEntry?.username, null);
  setElementText(
    "player-opponent-username",
    opponentUsername,
    OPPONENT_PLACEHOLDER
  );

  const opponentColourValue = resolveColour(opponentEntry?.colour, opponentColour);
  const opponentColourLabel = formatColourLabel(opponentColourValue);
  setElementText("player-opponent-colour", opponentColourLabel, "");
}

function getEntryForColour(rosterByColour, colour) {
  if (!colour) {
    return undefined;
  }
  if (!rosterByColour || typeof rosterByColour !== "object") {
    return undefined;
  }
  return rosterByColour[colour];
}

function resolveUsername(primary, fallback) {
  if (typeof primary === "string" && primary.trim().length > 0) {
    return primary;
  }
  if (typeof fallback === "string" && fallback.trim().length > 0) {
    return fallback;
  }
  return null;
}

function resolveColour(primary, fallback) {
  const normalizedPrimary = normalizeChessColour(primary);
  if (normalizedPrimary) {
    return normalizedPrimary;
  }
  return normalizeChessColour(fallback);
}

function setElementText(elementId, value, fallback) {
  const element = document.getElementById(elementId);
  if (!element) {
    return;
  }

  if (typeof value === "string" && value.length > 0) {
    element.textContent = value;
    return;
  }

  if (typeof fallback === "string") {
    element.textContent = fallback;
    return;
  }

  element.textContent = "";
}
