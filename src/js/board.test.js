import GameBoard from "./board.js";
import Ship from "./ship.js";

test("places ship horizontally", () => {
  const newBoard = new GameBoard();
  const newShip = new Ship(3);

  expect(newBoard.placeShip(newShip, 0, 0, "horizontal")).toBe(true);

  expect(newBoard.board[0][0]).toBe(newShip);
  expect(newBoard.board[0][1]).toBe(newShip);
  expect(newBoard.board[0][2]).toBe(newShip);
});

test("receiveAttack hits a ship", () => {
  const board = new GameBoard();
  const ship = new Ship(2);

  board.placeShip(ship, 0, 0, "horizontal");
  board.receiveAttack(0, 0);

  expect(ship.hits).toBe(1);
});

test("allShipSunk return true when all ships are sunk", () => {
  const board = new GameBoard();
  const ship = new Ship(1);

  board.placeShip(ship, 0, 0, "horizontal");
  board.receiveAttack(0, 0);

  expect(board.allShipsSunk()).toBe(true);
});
