import Ship from "./ship.js";

const SHIP_LENGTHS = [5, 4, 3, 3, 2];

export function randomizeShips(board) {
  board.board.forEach((row) => row.fill(null));
  board.ships.clear();

  SHIP_LENGTHS.forEach((length) => {
    let placed = false;

    while (!placed) {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      const direction = Math.random() > 0.5 ? "horizontal" : "vertical";
      placed = board.placeShip(new Ship(length), x, y, direction);
    }
  });
}
