import { createPlayerRoster } from "../../../public/src/frontend/domain/players/playerRoster.js";

describe("createPlayerRoster", () => {
  test("maps players by colour", () => {
    const roster = createPlayerRoster([
      { username: "Alice", colour: "white" },
      { username: "Bob", colour: "black" },
    ]);

    expect(roster.white).toEqual({ username: "Alice", colour: "white" });
    expect(roster.black).toEqual({ username: "Bob", colour: "black" });
  });

  test("ignores players without a valid colour", () => {
    const roster = createPlayerRoster([
      { username: "Spectator", colour: "green" },
      { username: "Carol" },
    ]);

    expect(roster).toEqual({});
  });

  test("returns empty object when input is not an array", () => {
    expect(createPlayerRoster(null)).toEqual({});
  });
});
