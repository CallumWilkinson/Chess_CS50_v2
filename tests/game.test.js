// const initializeBoard = require("../src/game.js"); // Correct relative path

// describe("initializeBoard", () => {
//   test("should return an 8x8 board", () => {
//     const board = initializeBoard();

//     // Check if the board is an array with length 8
//     expect(Array.isArray(board)).toBe(true);
//     expect(board.length).toBe(8);

//     // Check if each row is also an array with length 8
//     board.forEach((row) => {
//       expect(Array.isArray(row)).toBe(true);
//       expect(row.length).toBe(8);
//     });
//   });

//   test("should initialize board with null values", () => {
//     const board = initializeBoard();

//     // Check if every cell in the board is null
//     board.forEach((row) => {
//       row.forEach((cell) => {
//         expect(cell).toBeNull();
//       });
//     });
//   });
// });
