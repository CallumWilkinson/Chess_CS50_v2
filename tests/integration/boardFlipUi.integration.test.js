import { jest } from "@jest/globals";
import { UIConstants } from "../../shared/utilities/constants.js";
import { squareToCanvasCoordinates } from "../../public/src/frontend/domain/board/coordinates.js";
import { setupMovementEventListeners } from "../../public/src/frontend/interaction/board/setupEventListeners.js";

import { createTestGameState } from "../helpers/testFactories.js";

//jsdom lacks real layout, so provide a predictable bounding rect
function createTestCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = UIConstants.BOARDSIZE * UIConstants.TILESIZE;
  canvas.height = UIConstants.BOARDSIZE * UIConstants.TILESIZE;
  canvas.getBoundingClientRect = () => ({
    left: 0,
    top: 0,
    width: canvas.width,
    height: canvas.height,
  });
  return canvas;
}

function createSocketStub() {
  return {
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
  };
}

function clickAt(canvas, x, y) {
  const evt = new MouseEvent("click", {
    clientX: x,
    clientY: y,
    bubbles: true,
  });
  canvas.dispatchEvent(evt);
}

describe("Board flipping UI integration", () => {
  test("black player can move from bottom of the screen (pawn a7 -> a5)", () => {
    const canvas = createTestCanvas();
    const socket = createSocketStub();

    const { board, gameStateManager } = createTestGameState({
      startingColour: "black",
    });
    const currentGameState = { board, gameStateManager, playerColour: "black" };

    setupMovementEventListeners(socket, canvas, currentGameState);

    const start = squareToCanvasCoordinates("a7", "black");
    const end = squareToCanvasCoordinates("a5", "black");

    clickAt(canvas, start.x, start.y);
    clickAt(canvas, end.x, end.y);

    const moveCalls = socket.emit.mock.calls.filter(
      ([eventName]) => eventName === "move"
    );
    expect(moveCalls.length).toBe(1);
    const [, moveData] = moveCalls[0];
    expect(moveData.targetSquare).toBe("a5");
    expect(moveData.chessPiece).toBe(board.grid["a7"]);
    expect(moveData.chessPiece.colour).toBe("black");
  });

  test("white player can move from bottom of the screen (pawn a2 -> a4)", () => {
    const canvas = createTestCanvas();
    const socket = createSocketStub();

    const { board, gameStateManager } = createTestGameState({
      startingColour: "white",
    });
    const currentGameState = { board, gameStateManager, playerColour: "white" };

    setupMovementEventListeners(socket, canvas, currentGameState);

    const start = squareToCanvasCoordinates("a2", "white");
    const end = squareToCanvasCoordinates("a4", "white");

    clickAt(canvas, start.x, start.y);
    clickAt(canvas, end.x, end.y);

    const moveCalls = socket.emit.mock.calls.filter(
      ([eventName]) => eventName === "move"
    );
    expect(moveCalls.length).toBe(1);
    const [, moveData] = moveCalls[0];
    expect(moveData.targetSquare).toBe("a4");
    expect(moveData.chessPiece).toBe(board.grid["a2"]);
    expect(moveData.chessPiece.colour).toBe("white");
  });
});

