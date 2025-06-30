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
    let gameInstanceID = Math.random().toString(36).slice(2, 8);
    let gameInstance = new GameInstance(gameInstanceID, player1, player2);
    this.gameInstance = gameInstance;
    return gameInstance;
  }

  addPlayerToSession() {}

  disconnectFromGameSession() {}
}
