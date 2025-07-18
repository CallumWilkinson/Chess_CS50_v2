export default class Player {
  constructor(username, socketID, colour = null) {
    this.username = username;
    this.socketID = socketID;
    this.colour = colour;
  }

  //assign a color to this player
  setColour(colour) {
    this.colour = colour;
  }
}
