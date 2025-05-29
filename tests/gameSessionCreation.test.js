//sockerid is a string
function createMockSocket(socketID) {
  //to test if join was called we make a mock function
  //if no implementation is given, fn() will return undefined
  //this is used to record function calls
  const mock = jest.fn();

  return {
    id: socketID,
    //assign mock function to the join property
    join: mock,
  };
}

describe("Tests for when the server makes a new game session", () => {
  let gameSessions;

  beforeEach(() => {
    //reset gamesessions dictionary
    gameSessions = {};
  });
  test("Client chooses to make a new game session", () => {
    const socket = createMockSocket("socket1");
    const gameID = 
  });
});
