/**
 * @returns {string} playerColour
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
