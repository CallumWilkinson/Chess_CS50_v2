//unit tests for gameSession connectedUsers architecture
//tests the new single source of truth pattern for player tracking

import GameSession from "../backend/gameSetup/gameSession.js";
import Player from "../backend/gameSetup/Player.js";

describe("GameSession connectedUsers architecture", () => {
  let gameSession;

  beforeEach(() => {
    gameSession = new GameSession();
  });

  test("getPlayerColour uses connectedUsers directly without external parameters", () => {
    //when no users connected, first player gets black
    const firstColor = gameSession.getPlayerColour();
    expect(firstColor).toBe("black");

    //add first player to connectedUsers
    const firstPlayer = new Player("player1", "socket1", "black");
    gameSession.addPlayerToSession(firstPlayer);

    //second player should get white based on connectedUsers state
    const secondColor = gameSession.getPlayerColour();
    expect(secondColor).toBe("white");
  });

  test("addPlayerToSession maintains connectedUsers as single source of truth", () => {
    const player1 = new Player("alice", "socket1", "black");
    const player2 = new Player("bob", "socket2", "white");

    //initially empty
    expect(gameSession.connectedUsers).toHaveLength(0);

    //add first player
    gameSession.addPlayerToSession(player1);
    expect(gameSession.connectedUsers).toHaveLength(1);
    expect(gameSession.connectedUsers[0]).toBe(player1);

    //add second player
    gameSession.addPlayerToSession(player2);
    expect(gameSession.connectedUsers).toHaveLength(2);
    expect(gameSession.connectedUsers[1]).toBe(player2);
  });

  test("removePlayerFromSession correctly removes players by socketID", () => {
    const player1 = new Player("alice", "socket1", "black");
    const player2 = new Player("bob", "socket2", "white");

    //add both players
    gameSession.addPlayerToSession(player1);
    gameSession.addPlayerToSession(player2);
    expect(gameSession.connectedUsers).toHaveLength(2);

    //remove first player
    gameSession.removePlayerFromSession(player1);
    expect(gameSession.connectedUsers).toHaveLength(1);
    expect(gameSession.connectedUsers[0]).toBe(player2);

    //remove second player
    gameSession.removePlayerFromSession(player2);
    expect(gameSession.connectedUsers).toHaveLength(0);
  });

  test("removePlayerFromSession handles non-existent players gracefully", () => {
    const existingPlayer = new Player("alice", "socket1", "black");
    const nonExistentPlayer = new Player("bob", "socket2", "white");

    gameSession.addPlayerToSession(existingPlayer);
    expect(gameSession.connectedUsers).toHaveLength(1);

    //try to remove player that was never added
    gameSession.removePlayerFromSession(nonExistentPlayer);
    expect(gameSession.connectedUsers).toHaveLength(1);
    expect(gameSession.connectedUsers[0]).toBe(existingPlayer);
  });

  test("color assignment follows chess rules using connectedUsers state", () => {
    //empty session - first player gets black
    expect(gameSession.getPlayerColour()).toBe("black");

    //add black player
    const blackPlayer = new Player("player1", "socket1", "black");
    gameSession.addPlayerToSession(blackPlayer);

    //second player gets white
    expect(gameSession.getPlayerColour()).toBe("white");

    //remove black player
    gameSession.removePlayerFromSession(blackPlayer);

    //next player gets black again
    expect(gameSession.getPlayerColour()).toBe("black");
  });

  test("connectedUsers integrates with assignChessColor logic", () => {
    //this test ensures the architecture change preserves existing chess color logic
    const whitePlayer = new Player("player1", "socket1", "white");
    gameSession.addPlayerToSession(whitePlayer);

    //when only white exists, next player should get black
    expect(gameSession.getPlayerColour()).toBe("black");

    const blackPlayer = new Player("player2", "socket2", "black");
    gameSession.addPlayerToSession(blackPlayer);

    //when both colors exist, next player gets white (following chess priority)
    expect(gameSession.getPlayerColour()).toBe("white");
  });
});
