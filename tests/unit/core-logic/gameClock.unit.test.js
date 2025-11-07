import { createTestScenario } from "../../helpers/testFactories.js";
import { TEST_PLAYERS } from "../../helpers/testFactories.js";

describe("gameClock tests", () => {
  beforeEach(() => {
    createTestScenario(TEST_PLAYERS.CHESS_FULL_GAME);
  });
});
//given a new game
//when two players are connected and game starts
//both players have 300000 milliseconds on their timer

//given 10 sec into the game when black is first
//timer for black is now 290000 milliseconds
//timer for white is 300000

//given black moves after 10 seconds
//black has 290000
//its whites turn
//white's timer starts moving down while blacks stays the same
