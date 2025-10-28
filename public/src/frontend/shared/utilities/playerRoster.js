import { normalizeChessColour } from "./chessColours.js";

/**
 * Create a roster map keyed by chess colour from a players array.
 * @param {Array<{username?: string, colour?: string}>} players - Raw players list.
 * @returns {Record<string, {username: string|null, colour: string|null}>} Roster map keyed by colour.
 */
export function createPlayerRoster(players = []) {
  const roster = {};

  if (!Array.isArray(players)) {
    return roster;
  }

  players.forEach((player) => {
    const colour = normalizeChessColour(player?.colour);
    if (!colour) {
      return;
    }

    let username = "";
    if (typeof player?.username === "string") {
      username = player.username;
    }

    roster[colour] = {
      username,
      colour,
    };
  });

  return roster;
}
