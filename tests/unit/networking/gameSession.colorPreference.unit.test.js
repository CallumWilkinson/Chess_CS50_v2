import GameSession from "../../../backend/gameSetup/gameSession.js";
import { createTestPlayer } from "../../helpers/testFactories.js";

describe("GameSession host color preference", () => {
  test("defaults to black then white when no preference set", () => {
    const session = new GameSession();

    const first = session.getPlayerColour();
    const p1 = createTestPlayer("p1", "s1", first);
    session.addPlayerToSession(p1);

    const second = session.getPlayerColour();

    expect(first).toBe("black");
    expect(second).toBe("white");
  });

  test("hostPreferredColour=white gives white to first player and black to second", () => {
    const session = new GameSession();
    session.hostPreferredColour = "white";

    const first = session.getPlayerColour();
    expect(first).toBe("white");

    const p1 = createTestPlayer("host", "sock1", first);
    session.addPlayerToSession(p1);

    const second = session.getPlayerColour();
    expect(second).toBe("black");
  });

  test("hostPreferredColour=black gives black to first player and white to second", () => {
    const session = new GameSession();
    session.hostPreferredColour = "black";

    const first = session.getPlayerColour();
    expect(first).toBe("black");

    const p1 = createTestPlayer("host", "sock1", first);
    session.addPlayerToSession(p1);

    const second = session.getPlayerColour();
    expect(second).toBe("white");
  });
});

