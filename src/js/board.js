export default class Board {
  constructor() {
    this.board = Array(10)
      .fill(null)
      .map(() => Array(10).fill(null));

    this.missedAttacks = [];
    this.ships = new Set();
  }

  placeShip(ship, x, y, direction) {
    if (!ship | (typeof ship.hit != "function")) {
      throw new Error("placeship expect a ship class-like object.");
    }

    if (direction === "horizontal") {
      if (y + ship.length > 10) {
        return false;
      }

      for (let i = 0; i < ship.length; i++) {
        if (this.board[x][y + i] !== null) {
          return false;
        }
      }
      for (let i = 0; i < ship.length; i++) {
        this.board[x][y + i] = ship;
      }
    }

    if (direction === "vertical") {
      if (x + ship.length > 10) return false;

      for (let i = 0; i < ship.length; i++) {
        if (this.board[x + i][y] !== null) {
          return false;
        }
      }
      for (let i = 0; i < ship.length; i++) {
        this.board[x + i][y] = ship;
      }
    }

    this.ships.add(ship);
    return true;
  }

  receiveAttack(x, y) {
    const target = this.board[x][y];

    if (target === "hit" || target === "miss") {
      return false;
    }
    if (target === null) {
      this.board[x][y] = "miss";
      this.missedAttacks.push([x, y]);
      return "miss";
    }

    target.hit();
    this.board[x][y] = "hit";
    return "hit";
  }

  allShipsSunk() {
    for (const ship of this.ships) {
      if (!ship.isSunk()) {
        return false;
      }
    }
    return true;
  }
}
