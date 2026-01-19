import Player from "./player.js";
import Ship from "./ship.js";

test("player has a gameboard", () => {
  const player = new Player();
  expect(player.gameBoard).toBeDefined();
});

test("computer can attack without coordinates", () => {
  const player = new Player();
  const computer = new Player("computer");

  player.gameBoard.placeShip(new Ship(1), 0, 0, "horizontal");
  expect(computer.attack(player.gameBoard)).toBeDefined();
});
