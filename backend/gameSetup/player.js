export default class Player {
  constructor(user) {
    this.user = user;
    this.colour = this._getPlayerColour;
  }

  _getPlayerColour(players) {
    //assign new player a colour
    //get array of colours currently being used by connected players so we can assign black or white to the new player
    const connectedPlayers = Object.values(players).map((p) => p.colour);

    //if black is taken, assign white to new player, otherwise assign black so that black is always player 1
    let assignedColour;

    if (connectedPlayers.includes("black")) {
      assignedColour = "white";
    } else {
      assignedColour = "black";
    }
    return assignedColour;
  }
}
