import { createTestScenario } from "../../helpers/testFactories.js";
import { TEST_PLAYERS } from "../../helpers/testFactories.js";
import GameClock from "../../../chessCore/gameLogic/gameClock.js";

describe("GameClock tests", () => {
  let gameClock;
  let session;
  let currentPlayer;
  beforeEach(() => {
    ({ session } = createTestScenario(TEST_PLAYERS.CHESS_FULL_GAME));
    gameClock = new GameClock();
    currentPlayer =
      session.gameInstance.gameStateManager.turnManager.getCurrentPlayer();
  });

  test("both players start with 3 mins each", () => {
    expect(gameClock.blackTimeRemaining).toBe(300000);
    expect(gameClock.whiteTimeRemaining).toBe(300000);
  });

  test("after 10 seconds black timer goes down but whites stays the same", () => {
    expect(currentPlayer).toBe("black");
    gameClock.start(currentPlayer);
    GameClock.advanceTimeBy(10000);
    expect(GameClock.blackTimeRemaining).toBe(290000);
    expect(GameClock.whiteTimeRemaining).toBe(300000);
  });

  //   test("black moves after 20 seconds, then white waits 10 seconds", () =>{
  //     expect(currentturn).toBe("black");
  //     GameClock.advanceTimeBy(20000);
  //     expect(GameClock.blackTimeRemaining).toBe(280000);

  //     black.move(any peice up 1)
  //     expect(currentturn).toBe("white")
  //     GameClock.advanceTimeBy(10000);
  //     expect(GameCloock.whiteTimeRemaining).toBe(290000);
  //     expect(GameClock.blackTimeRemaining).toBe(280000);
  //   });

  //   test("white wins when blacks time runs out", () => {
  //     expect(currentturn).toBe("black");
  //     GameClock.advanceTimeBy(300000);
  //     expect(winner).toBe("white")
  //   })
});
