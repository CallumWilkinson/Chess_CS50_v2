import GameInstance from "./GameInstance.js";

export default class GameSession {
  constructor() {
    //generate a 6 character random id (letters and numbers)
    //tostring(36) is base 36 so letters are included
    //slice makes it 6 chars long
    this.gameSessionID = Math.random().toString(36).slice(2, 8);
    //a user belongs to the game session, but a player belongs to the gameInstance
    this.connectedUsers = [];
    this.gameInstance;
  }

  createGameInstance() {
    //generate a 6 character random id (letters and numbers)
    //tostring(36) is base 36 so letters are included
    //slice makes it 6 chars long
    const gameInstanceID = Math.random().toString(36).slice(2, 8);

    //create a new game instance inside this session
    const gameInstance = new GameInstance(gameInstanceID);

    this.gameInstance = gameInstance;
    return gameInstance;
  }

  addPlayerToSession() {}

  disconnectFromGameSession() {}

  getPlayerColour(players) {
    const connectedPlayers = Object.values(players).map((p) => p.colour);

    //assigns black to the player, or if black exists then assign white
    return connectedPlayers.includes("black") ? "white" : "black";
  }
}
