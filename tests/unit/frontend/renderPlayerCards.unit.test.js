import { renderPlayerCards } from "../../../public/src/frontend/renderPlayerCards.js";

describe("renderPlayerCards", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <aside id="player-card-self">
        <h2 class="player-card__label">You</h2>
        <p id="player-self-username"></p>
        <p id="player-self-colour"></p>
      </aside>
      <aside id="player-card-opponent">
        <h2 class="player-card__label">Opponent</h2>
        <p id="player-opponent-username"></p>
        <p id="player-opponent-colour"></p>
      </aside>
    `;
  });

  test("renders both player cards when roster available", () => {
    const roster = {
      white: { username: "Alice", colour: "white" },
      black: { username: "Bob", colour: "black" },
    };

    renderPlayerCards(roster, {
      viewerColour: "white",
      viewerUsername: "Alice",
    });

    expect(document.getElementById("player-self-username").textContent).toBe(
      "Alice"
    );
    expect(document.getElementById("player-self-colour").textContent).toBe(
      "White"
    );
    expect(
      document.getElementById("player-opponent-username").textContent
    ).toBe("Bob");
    expect(document.getElementById("player-opponent-colour").textContent).toBe(
      "Black"
    );
  });

  test("renders placeholder when opponent missing", () => {
    const roster = {
      white: { username: "Alice", colour: "white" },
    };

    renderPlayerCards(roster, {
      viewerColour: "white",
      viewerUsername: "Alice",
    });

    expect(document.getElementById("player-opponent-username").textContent).toBe(
      "Waiting for player"
    );
    expect(document.getElementById("player-opponent-colour").textContent).toBe(
      "Black"
    );
  });
});
