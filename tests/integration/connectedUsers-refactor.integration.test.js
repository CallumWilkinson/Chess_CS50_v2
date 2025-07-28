//integration tests to verify gameSession.connectedUsers refactor
//ensures all flows use connectedUsers as single source of truth

import GameSession from "../../backend/gameSetup/gameSession.js";
import Player from "../../backend/gameSetup/Player.js";
import SessionManager from "../../backend/gameSetup/SessionManager.js";
import {
  handleDisconnect,
  getAvailableGamesForListing,
} from "../../backend/gameSetup/launchServer.js";
import { createMockSocket } from "../helpers/testUtils.js";
import { createTestPlayer, createGameSessionWithPlayers, createTestScenario, TEST_PLAYERS } from "../helpers/testFactories.js";

describe("ConnectedUsers refactor integration", () => {
  let gameSession;
  let sessionManager;

  beforeEach(() => {
    gameSession = new GameSession();
    sessionManager = new SessionManager();
  });

  test("join flow maintains connectedUsers as single source of truth", () => {
    //create session with full game using factory
    const gameSession = createGameSessionWithPlayers(TEST_PLAYERS.CHESS_FULL_GAME);

    //verify connectedUsers has both players
    expect(gameSession.connectedUsers).toHaveLength(2);
    expect(gameSession.connectedUsers[0].username).toBe("blackplayer");
    expect(gameSession.connectedUsers[1].username).toBe("whiteplayer");

    //verify color assignment uses connectedUsers
    //when session is full, getPlayerColour should return null (no more spots)
    const thirdPlayerColor = gameSession.getPlayerColour();
    expect(thirdPlayerColor).toBe(null); //game is full, no color available
  });

  test("sessionManager methods use connectedUsers for player counting", () => {
    //create complete test scenario using factory
    const { sessionManager, session } = createTestScenario([
      { username: "alice", socketId: "socket1", colour: "black" },
      { username: "bob", socketId: "socket2", colour: "white" }
    ]);

    //verify getPlayersInSession returns connectedUsers array
    const players = sessionManager.getPlayersInSession(session.gameSessionID);
    expect(players).toHaveLength(2);
    expect(players[0].username).toBe("alice");
    expect(players[1].username).toBe("bob");
    
    //verify player count uses connectedUsers
    const playerCount = sessionManager.getPlayerCountInSession(session.gameSessionID);
    expect(playerCount).toBe(2);
  });

  test("getAvailableGames uses connectedUsers for game listing", () => {
    //create sessions using factories for consistency
    const waitingSession = createGameSessionWithPlayers([
      { username: "alice", socketId: "socket1", colour: "black" }
    ]);

    const fullSession = createGameSessionWithPlayers([
      { username: "bob", socketId: "socket2", colour: "black" },
      { username: "charlie", socketId: "socket3", colour: "white" }
    ]);

    //create session with no players (should not appear - no waiting player)
    const emptySession = createGameSessionWithPlayers([]);

    const gameSessions = {
      [waitingSession.gameSessionID]: waitingSession,
      [fullSession.gameSessionID]: fullSession,
      [emptySession.gameSessionID]: emptySession,
    };

    const availableGames = getAvailableGamesForListing(gameSessions);

    //only the waiting session should appear
    expect(availableGames).toHaveLength(1);
    expect(availableGames[0]).toEqual({
      gameSessionID: waitingSession.gameSessionID,
      waitingPlayer: {
        username: "alice",
        colour: "black",
      },
      playersConnected: 1,
      maxPlayers: 2,
    });
  });

  test("disconnect flow removes from connectedUsers and cleans up properly", () => {
    //set up session with two players using factories
    const player1 = createTestPlayer("alice", "socket1", "black");
    const player2 = createTestPlayer("bob", "socket2", "white");
    gameSession.addPlayerToSession(player1);
    gameSession.addPlayerToSession(player2);

    //set up legacy structures for compatibility
    gameSession.connectedPlayersSocketIDs = { players: {} };
    gameSession.connectedPlayersSocketIDs.players["socket1"] = player1;
    gameSession.connectedPlayersSocketIDs.players["socket2"] = player2;

    const gameSessions = { [gameSession.gameSessionID]: gameSession };
    const socketIDtoGameSessionID = {
      socket1: gameSession.gameSessionID,
      socket2: gameSession.gameSessionID,
    };
    const connectedPlayers = { socket1: player1, socket2: player2 };
    const mockSocket = createMockSocket("socket1");

    //simulate disconnect
    handleDisconnect(
      gameSessions,
      socketIDtoGameSessionID,
      mockSocket,
      connectedPlayers
    );

    //verify player removed from connectedUsers
    expect(gameSession.connectedUsers).toHaveLength(1);
    expect(gameSession.connectedUsers[0]).toBe(player2);

    //verify session still exists (one player remaining)
    expect(gameSessions[gameSession.gameSessionID]).toBeDefined();

    //disconnect second player
    const mockSocket2 = createMockSocket("socket2");
    handleDisconnect(
      gameSessions,
      socketIDtoGameSessionID,
      mockSocket2,
      connectedPlayers
    );

    //verify session is cleaned up when empty
    expect(gameSessions[gameSession.gameSessionID]).toBeUndefined();
  });

  test("color assignment consistency between sessions and players", () => {
    //test that connectedUsers maintains consistent color assignment
    const session1 = createGameSessionWithPlayers([]);
    const session2 = createGameSessionWithPlayers([]);

    //first players in each session should get black
    const firstColor1 = session1.getPlayerColour();
    const firstColor2 = session2.getPlayerColour();
    expect(firstColor1).toBe("black");
    expect(firstColor2).toBe("black");

    //add first players using factory
    const player1a = createTestPlayer("alice", "socket1", firstColor1);
    const player2a = createTestPlayer("bob", "socket2", firstColor2);
    session1.addPlayerToSession(player1a);
    session2.addPlayerToSession(player2a);

    //second players should get white
    const secondColor1 = session1.getPlayerColour();
    const secondColor2 = session2.getPlayerColour();
    expect(secondColor1).toBe("white");
    expect(secondColor2).toBe("white");

    //add second players using factory
    const player1b = createTestPlayer("charlie", "socket3", secondColor1);
    const player2b = createTestPlayer("diana", "socket4", secondColor2);
    session1.addPlayerToSession(player1b);
    session2.addPlayerToSession(player2b);

    //sessions should now be full - no more colors available
    expect(session1.getPlayerColour()).toBe(null);
    expect(session2.getPlayerColour()).toBe(null);
  });

  test("sessionManager available games uses connectedUsers correctly", () => {
    //create session with one player using factory
    const waitingPlayer = createTestPlayer("alice", "socket1", "black");
    gameSession.addPlayerToSession(waitingPlayer);
    sessionManager.addSession(gameSession.gameSessionID, gameSession);

    //verify available games finds the session
    const availableGames = sessionManager.getAvailableGames();

    expect(availableGames).toHaveLength(1);
    expect(availableGames[0]).toEqual({
      gameSessionID: gameSession.gameSessionID,
      waitingPlayer: {
        username: "alice",
        colour: "black",
      },
      playersConnected: 1,
      maxPlayers: 2,
    });

    //add second player - game should no longer be available
    const secondPlayer = createTestPlayer("bob", "socket2", "white");
    gameSession.addPlayerToSession(secondPlayer);

    const availableGamesAfterFull = sessionManager.getAvailableGames();
    expect(availableGamesAfterFull).toHaveLength(0);
  });
});
