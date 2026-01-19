export default class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
  }

  hit() {
    return this.hits++;
  }

  isSunk() {
    return this.hits >= this.length;
  }
}
