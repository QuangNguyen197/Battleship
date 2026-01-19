import Ship from "./ship.js";

let battleShip;

beforeEach(() => {
  battleShip = new Ship(4);
});

test("ship object creation", () => {
  expect(battleShip.length).toBe(4);
  expect(battleShip.hits).toBe(0);
});

test("hit() increases number of hits", () => {
  battleShip.hit();
  expect(battleShip.hits).toBe(1);
});

test("isSunk() return false whene ship is not sunk", () => {
  battleShip.hit();
  battleShip.hit();
  expect(battleShip.isSunk()).toBe(false);
});

test("isSunk() return true when hits equal length", () => {
  battleShip.hit();
  battleShip.hit();
  battleShip.hit();
  battleShip.hit();
  expect(battleShip.isSunk()).toBe(true);
});
