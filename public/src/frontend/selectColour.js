/**
 * Set up color selection event listeners (legacy/unused)
 * Adds click handlers to color selection buttons
 * Note: Color assignment is now handled automatically by the server
 * @deprecated This function is not currently used - colors are auto-assigned
 * @returns {string} Selected player color (but return value is not captured)
 */
export function selectColour() {
  const whiteBtn = document.getElementById("color-select-white");
  const blackBtn = document.getElementById("color-select-black");

  whiteBtn.addEventListener("click", () => {
    const playerColour = "white";
    return playerColour;
  });
  blackBtn.addEventListener("click", () => {
    const playerColour = "black";
    return playerColour;
  });
}
