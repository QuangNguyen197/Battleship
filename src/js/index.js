import GameController from "./gameController.js";
import DOMController from "./domController.js";
import "../styles.css";

const game = new GameController("modeSelection");
DOMController(game);
