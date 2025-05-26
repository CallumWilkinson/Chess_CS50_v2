import { TurnManager } from "../backend/gameLogic/turnManager";

describe("Turn Manager", () => {
  let turnManager;
  beforeEach(() => {
    //start each turnManager object as white first
    turnManager = new TurnManager("white");
  });

  test("switch from white to black turn", () => {
    expect(turnManager.currentPlayerColour).toBe("white");
    expect(turnManager.getCurrentPlayer()).toBe("white");
    turnManager.switchTurn();
    expect(turnManager.getCurrentPlayer()).toBe("black");
  });
});
