import {
  createConnectedTestClient,
  createLobbyTestEnvironment,
  createTestLobby,
  joinTestLobby,
} from "./lobbyTestFactories.js";

export function givenLobbyEnvironment() {
  return createLobbyTestEnvironment();
}

export function givenCreatorHasTwoConnectedClients(environment) {
  const { socket: welcomeSocket } = createConnectedTestClient(
    environment,
    "welcome-socket",
    "Creator",
  );

  const { socket: gamePageSocket } = createConnectedTestClient(
    environment,
    "game-page-socket",
    "Creator",
  );

  return {
    welcomeSocket,
    gamePageSocket,
  };
}

export function whenCreatorCreatesLobby(environment, welcomeSocket) {
  return createTestLobby(
    environment,
    welcomeSocket,
    "Creator",
    "Regression Lobby",
  );
}

export function whenCreatorJoinsLobbyFromGamePage(
  environment,
  gamePageSocket,
  sessionId,
) {
  return joinTestLobby(environment, gamePageSocket, "Creator", sessionId);
}

export function thenLobbyIsReserved(environment, sessionId) {
  const session = environment.gameSessions[sessionId];

  expect(session).toBeDefined();
  expect(session.connectedUsers).toHaveLength(0);
}

export function thenCreatorIsFirstPlayer(
  environment,
  gamePageSocket,
  sessionId,
) {
  const session = environment.gameSessions[sessionId];

  expect(session.connectedUsers).toHaveLength(1);

  expect(session.connectedUsers[0]).toMatchObject({
    username: "Creator",
    socketID: gamePageSocket.id,
  });
}

export function thenLobbyRemainsAvailable(environment, sessionId) {
  expect(environment.sessionManager.getAvailableGames()).toEqual([
    expect.objectContaining({
      gameSessionID: sessionId,
      lobbyName: "Regression Lobby",
      playersConnected: 1,
      maxPlayers: 2,
      waitingPlayer: expect.objectContaining({
        username: "Creator",
      }),
    }),
  ]);
}
