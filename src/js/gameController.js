import Player from "./player.js";
import { randomizeShips } from "./shipPlacement.js";

export default class GameController {
  constructor(gameMode = "modeSelection") {
    this.gameMode = gameMode;
    this.player1 = new Player("real");
    this.player2 =
      this.gameMode === "computer"
        ? new Player("computer")
        : new Player("real");

    this.player = this.player1;
    this.computer = this.player2;

    this.phase = gameMode;
    this.currentSetupPlayer = null;
    this.currentTurn = "player1";

    if (this.gameMode === "computer") {
      this.setupComputer();
      this.phase = "setup";
    }
  }

  setupComputer() {
    randomizeShips(this.computer.gameBoard);
  }

  setupPlayer2() {
    this.currentSetupPlayer = "player2";
    this.phase = "setupPlayer";
  }

  startGame() {
    if (this.gameMode === "twoPlayer" && this.phase === "setup") {
      this.setupPlayer2();
      return "setupPlayer2";
    }

    if (this.phase !== "setup" && this.phase !== "setupPlayer2") {
      return;
    }
    this.phase = "playing";
    this.currentTurn = this.gameMode === "computer" ? "player" : "player1";
    return "started";
  }

  performAttack(attacker, defender, attackerName, returnWinMessage, x, y) {
    const isValidTurn =
      this.phase === "playing" && this.currentTurn === attackerName;
    if (!isValidTurn) return;

    const result = attacker.attack(defender.gameBoard, x, y);
    if (!result) return;

    if (defender.gameBoard.allShipsSunk()) {
      this.phase = "gameOver";
      return returnWinMessage;
    }

    this.currentTurn = this.getNextTurn(attackerName);
    return result;
  }

  getNextTurn(currentPlayer) {
    if (this.gameMode === "computer") {
      return currentPlayer === "computer" ? "player" : "computer";
    }
    return currentPlayer === "player1" ? "player2" : "player1";
  }

  player1Attack(x, y) {
    return this.performAttack(
      this.player1,
      this.player2,
      "player1",
      "player1-wins",
      x,
      y
    );
  }

  player2Attack(x, y) {
    return this.performAttack(
      this.player2,
      this.player1,
      "player2",
      "player2-wins",
      x,
      y
    );
  }

  playerAttack(x, y) {
    if (this.gameMode !== "computer") return;
    return this.performAttack(
      this.player,
      this.computer,
      "player",
      "player-wins",
      x,
      y
    );
  }

  computerAttack() {
    if (this.gameMode !== "computer") return;
    return this.performAttack(
      this.computer,
      this.player,
      "computer",
      "computer-wins"
    );
  }

  reset() {
    const currentMode = this.gameMode;
    this.player1 = new Player("real");
    this.player2 =
      currentMode === "computer" ? new Player("computer") : new Player("real");
    this.player = this.player1;
    this.computer = this.player2;

    this.phase =
      currentMode === "computer"
        ? "setup"
        : currentMode === "twoPlayer"
          ? "setup"
          : "modeSelection";

    this.currentTurn = null;
    this.currentSetupPlayer = "player1";

    if (currentMode === "computer") {
      this.setupComputer();
    }
  }
}
