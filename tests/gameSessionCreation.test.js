import { jest } from "@jest/globals";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import { launchServer } from "../backend/gameSetup/launchServer.js";

//socketid is a string
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

describe("Testing that the server is sending and receiving data over sockets as intended", () => {
  let appMock, httpServerMock, socketServerMock, listenMock;

  beforeEach(() => {
    //create an express application
    appMock = express();

    listenMock;
  });

  test("Client chooses to make a new game session", () => {
    const socket = createMockSocket("socket1");
    socket.emit("createNewGame");
  });
});
