import { jest } from "@jest/globals";

describe("setupSocketWithAuthentication", () => {
  let ioMock;
  let setupSocketWithAuthentication;
  let originalMathRandom;
  let socketIoModule;

  beforeEach(async () => {
    ioMock = jest.fn();
    originalMathRandom = Math.random;
    socketIoModule = await import(
      "https://cdn.socket.io/4.7.2/socket.io.esm.min.js"
    );
    socketIoModule.__setSocketIoImplementation(ioMock);

    ({ setupSocketWithAuthentication } = await import(
      "../../../public/src/frontend/setupAuthentication.js"
    ));
  });

  afterEach(() => {
    if (socketIoModule && socketIoModule.__resetSocketIoImplementation) {
      socketIoModule.__resetSocketIoImplementation();
      socketIoModule = null;
    }
    Math.random = originalMathRandom;
    jest.resetModules();
    jest.clearAllMocks();
    if ("prompt" in globalThis) {
      //cleanup prompt stub between tests
      delete globalThis.prompt;
    }
  });

  test("uses provided promptUser to gather username", () => {
    const promptUser = jest.fn(() => "Carla");
    const mockSocket = {};
    ioMock.mockReturnValue(mockSocket);

    const socket = setupSocketWithAuthentication({ promptUser });

    expect(promptUser).toHaveBeenCalledTimes(1);
    expect(ioMock).toHaveBeenCalledWith(
      expect.objectContaining({
        auth: { username: "Carla" },
        autoConnect: false,
      })
    );
    expect(socket).toBe(mockSocket);
  });

  test("falls back to guest username when prompt override is disabled", () => {
    const mockSocket = {};
    ioMock.mockReturnValue(mockSocket);
    Math.random = () => 0.42;

    const socket = setupSocketWithAuthentication({ promptUser: null });

    expect(ioMock).toHaveBeenCalledWith(
      expect.objectContaining({
        auth: { username: "Guest420" },
        autoConnect: false,
      })
    );
    expect(socket).toBe(mockSocket);
  });

  test("defaults to global prompt when no override is supplied", () => {
    const promptSpy = jest.fn(() => "Dana");
    globalThis.prompt = promptSpy;
    const mockSocket = {};
    ioMock.mockReturnValue(mockSocket);

    const socket = setupSocketWithAuthentication();

    expect(promptSpy).toHaveBeenCalledTimes(1);
    expect(ioMock).toHaveBeenCalledWith(
      expect.objectContaining({
        auth: { username: "Dana" },
        autoConnect: false,
      })
    );
    expect(socket).toBe(mockSocket);
  });
});
