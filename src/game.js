function initializeBoard() {
  const board = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));
  return board;
}

module.exports = initializeBoard; // ✅ Must be exported properly
