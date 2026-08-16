import {
  givenLobbyEnvironment,
  givenCreatorHasTwoConnectedClients,
  whenCreatorCreatesLobby,
  whenCreatorJoinsLobbyFromGamePage,
  thenLobbyIsReserved,
  thenCreatorIsFirstPlayer,
  thenLobbyRemainsAvailable,
} from "../helpers/lobbyTestSteps.js";

describe("Lobby creation lifecycle", () => {
  test("creating a lobby reserves the session and joining from the game page adds the first player", () => {
    // Given
    const environment = givenLobbyEnvironment();

    const { welcomeSocket, gamePageSocket } =
      givenCreatorHasTwoConnectedClients(environment);

    // When
    const createResponse = whenCreatorCreatesLobby(environment, welcomeSocket);

    const sessionId = createResponse.gameSessionID;

    // Then
    thenLobbyIsReserved(environment, sessionId);

    // When
    whenCreatorJoinsLobbyFromGamePage(environment, gamePageSocket, sessionId);

    // Then
    thenCreatorIsFirstPlayer(environment, gamePageSocket, sessionId);

    thenLobbyRemainsAvailable(environment, sessionId);
  });
});
