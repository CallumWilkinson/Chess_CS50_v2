import GameInstance from "./GameInstance.js";
import { assignChessColor } from "../gameLogic/chessColorAssignment.js";

export default class GameSession {
  constructor() {
    //generate a 6 character random id (letters and numbers)
    //tostring(36) is base 36 so letters are included
    //slice makes it 6 chars long
    this.gameSessionID = Math.random().toString(36).slice(2, 8);
    //a user belongs to the game session, but a player belongs to the gameInstance
    this.connectedUsers = [];
    //this is set when you run gamesession.createGameInstance()
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

  addPlayerToSession(player) {
    //add player to connectedUsers to maintain single source of truth
    this.connectedUsers.push(player);
  }

  removePlayerFromSession(player) {
    //remove player from connectedUsers when they disconnect
    const index = this.connectedUsers.findIndex(p => p.socketID === player.socketID);
    if (index !== -1) {
      this.connectedUsers.splice(index, 1);
    }
  }

  //abstraction layer for color assignment - uses internal connectedUsers as single source of truth
  //delegates to chess-specific logic but could be extended for other game types
  //this keeps networking/session code separate from game-specific rules
  //uses chess rules: first player black, second player white
  getPlayerColour() {
    return assignChessColor(this.connectedUsers);
  }
}
