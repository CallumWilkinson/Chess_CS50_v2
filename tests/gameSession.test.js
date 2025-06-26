import gameSession from "../backend/gameSetup/gameSession.js";

test("gameSession class should hold all data and functions related to a gameSession", () => {
  let session = new gameSession();

  expect(session).toBeInstanceOf(gameSession);
});
