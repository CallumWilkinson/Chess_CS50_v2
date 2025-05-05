/**
 * @returns {string} playerColour
 */

export function selectColour() {
  const whiteBtn = document.getElementById("color-select-white");
  const blackBtn = document.getElementById("color-select-black");

  whiteBtn.addEventListener("click", () => {
    let playerColour = "white";
    return playerColour;
  });
  blackBtn.addEventListener("click", () => {
    let playerColour = "black";
    return playerColour;
  });
}
