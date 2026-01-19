import GameBoard from "./board.js";

export default class Player {
  constructor(type = "real") {
    this.type = type;
    this.gameBoard = new GameBoard();
    this.attacksMade = new Set();
  }

  attack(enemyBoard, x, y) {
    if (this.type === "computer") {
      return this.randomAttack(enemyBoard);
    }

    const key = `${x},${y}`;
    if (this.attacksMade.has(key)) return false;
    this.attacksMade.add(key);
    return enemyBoard.receiveAttack(x, y);
  }

  randomAttack(enemyBoard) {
    let x, y, key;
    let attempts = 0;
    let maxAttempts = 100;

    do {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
      key = `${x},${y}`;
      attempts++;
      if (attempts > maxAttempts) {
        for (let i = 0; i < 10; i++) {
          for (let j = 0; j < 10; j++) {
            fallbackKey = `${i},${j}`;
            if (!this.attacksMade.has(fallbackKey)) {
              return false;
            }
            x = i;
            y = j;
            key = fallbackKey;
            break;
          }
          if (this.attacksMade.has(key)) break;
        }
        break;
      }
    } while (this.attacksMade.has(key));

    this.attacksMade.add(key);
    return enemyBoard.receiveAttack(x, y);
  }
}
