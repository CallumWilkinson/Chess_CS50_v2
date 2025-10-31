/**
 * Normalize chess colour tokens to lowercase.
 * @param {string|null|undefined} colour - Input colour value.
 * @returns {string|null} Lowercase colour or null when unknown.
 */
export function normalizeChessColour(colour) {
  if (typeof colour !== "string") {
    return null;
  }

  const trimmed = colour.trim().toLowerCase();
  if (trimmed === "white" || trimmed === "black") {
    return trimmed;
  }

  return null;
}

/**
 * Determine the opposite colour for a given chess player.
 * @param {string|null|undefined} colour - Base colour value.
 * @returns {string|null} Opposite colour or null when unknown.
 */
export function getOppositeColour(colour) {
  const normalized = normalizeChessColour(colour);
  if (normalized === "white") {
    return "black";
  }
  if (normalized === "black") {
    return "white";
  }
  return null;
}

/**
 * Convert a chess colour into a user-facing label.
 * @param {string|null|undefined} colour - Colour to format.
 * @returns {string} Title-case label or empty string when unknown.
 */
export function formatColourLabel(colour) {
  const normalized = normalizeChessColour(colour);
  if (!normalized) {
    return "";
  }

  const firstLetter = normalized.slice(0, 1).toUpperCase();
  const remainder = normalized.slice(1);
  return `${firstLetter}${remainder}`;
}