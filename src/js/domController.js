import Ship from "./ship";

export default function DOMController(game) {
  const placementBoardEl = document.querySelector("#placement-board");
  const playerBoardEl = document.querySelector("#player-board");
  const computerBoardEl = document.querySelector("#computer-board");
  const statusEl = document.querySelector("#status");
  const shipYardEl = document.querySelector("#ship-yard");
  const rotateEl = document.querySelector("#rotate");
  const startEl = document.querySelector("#start");
  const boardsEl = document.querySelector(".boards");
  const setupSection = document.querySelector("#setup-section");
  const modeSelection = document.querySelector("#mode-selection");
  const resetBtn = document.querySelector("#reset-game");
  const resetBtnPlaying = document.querySelector("#reset-game-playing");
  const setupTitle = document.querySelector("#setup-title");
  const player1Title = document.querySelector("#player1-title");
  const player2Title = document.querySelector("#player2-title");
  const modeComputerBtn = document.querySelector("#mode-computer");
  const modeTwoPlayerBtn = document.querySelector("#mode-two-player");

  let draggedShipLength = null;
  let direction = "horizontal";
  let placedCount = 0;
  let currentPlayerBoard = null;

  boardsEl.style.display = "none";
  setupSection.style.display = "none";

  modeComputerBtn.addEventListener("click", () => {
    game.gameMode = "computer";
    game.reset();
    startSetup("computer");
  });

  modeTwoPlayerBtn.addEventListener("click", () => {
    game.gameMode = "twoPlayer";
    game.reset();
    startSetup("twoPlayer");
  });

  function startSetup(mode) {
    modeSelection.style.display = "none";
    setupSection.style.display = "none";
    boardsEl.style.display = "none";

    if (mode === "twoPlayer") {
      setupTitle.textContent = "Player1 - Place Your Ships";
      currentPlayerBoard = game.player1.gameBoard;
    } else {
      setupTitle.textContent = "Place Your Ships";
      currentPlayerBoard = game.player.gameBoard;
    }

    resetBoard();
    renderBoard(placementBoardEl, currentPlayerBoard, true);
    updateStatus(
      mode === "twoPlayer"
        ? "🚢 Player 1: Drag ships to place them on your board. Click Rotate to change direction."
        : "🚢 Drag ships from the ship yard to place them on your board. Click Rotate to change direction.",
    );
  }

  function resetBoard() {
    placedCount = 0;
    draggedShipLength = null;
    direction = "horizontal";

    const shipEls = document.querySelector("#ship-yard .ship");
    shipEls.forEach((ship) => {
      ship.classList.remove("placed");
    });

    startBtn.disabled = true;
    rotateBtn.textContent = `🔄 Rotate (${direction === "horizontal" ? "→" : "↓"})`;
  }

  function renderBoard(boardEl, gameBoard, showShips) {
    boardEl.innerHTML = "";
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.x = x;
        cell.dataset.y = y;
        const target = gameBoard.board[x][y];
        if (target === "hit") {
          cell.classList.add("hit");
          cell.textContent = "💥";
        } else if (target === "miss") {
          cell.classList.add("miss");
          cell.textContent = "○";
        } else if (typeof target === "object" && target !== null) {
          if (showShips) {
            cell.classList.add("ship");
            if (target.isSunk()) {
              cell.classList.add("sunk");
              cell.textContent = "💀";
            } else {
              cell.textContent = "🚢";
            }
          }
        }
        boardEl.appendChild(cell);
      }
    }
  }

  const shipEls = document.querySelector("#ship-yard .ship");
  shipEls.forEach((ship) => {
    ship.addEventListener("dragstart", (e) => {
      draggedShipLength = Number(e.target.dataset.length);
      ship.classList.add("dragging");
    });

    ship.addEventListener("dragged", (e) => {
      ship.classList.remove("dragging");
    });
  });

  placementBoardEl.addEventListener("dragover", (e) => e.preventDefault());
  placementBoardEl.addEventListener("drop", (e) => {
    e.preventDefault();
    let cell = e.target;
    while (cell && !cell.classList.contains("cell")) {
      cell = cell.parentElement;
    }
    if (!cell || !cell.classList.contains("cell")) return;

    const x = Number(cell.dataset.x);
    const y = Number(cell.dataset.y);

    if (draggedShipLength === null) return;

    const ship = new Ship(draggedShipLength);
    const placed = currentPlayerBoard.placeShip(ship, x, y, direction);
    if (placed) {
      const shipEl = document.querySelector(
        `.ship[data-length="${draggedShipLength}"]:not(.placed)`,
      );
      if (shipEl) {
        shipEl.classList.add("placed");
      }

      placedCount++;
      const remaining = shipEls.length - placedCount;
      if (placedCount === shipEls.length) {
        startBtn.disabled = false;
        if (game.gameMode === "twoPlayer" && game.phase === "setup") {
          updateStatus("✅ All ships placed! Ready to start Player 2 setup!");
        } else {
          updateStatus("✅ All ships placed! Ready to start the battle!");
        }
      } else {
        updateStatus(
          `✅ Ship placed! ${remaining} ship${remaining > 1 ? "s" : ""} remaining.`,
        );
      }
      renderBoard(placementBoardEl, currentPlayerBoard, true);
    } else {
      updateStatus("❌ Cannot place ship there! Try another position.");
    }
  });

  rotateBtn.addEventListener("click", () => {
    direction = direction === "horizontal" ? "vertical" : "horizontal";
    rotateBtn.textContent = `🔄 Rotate (${direction === "horizontal" ? "→" : "↓"})`;
    updateStatus(
      `Ship orientation: ${direction === "horizontal" ? "Horizontal (→)" : "Vertical (↓)"}`,
    );
  });

  startBtn.addEventListener("click", () => {
    const resutl = game.startGame();
    if (resutl === "setupPlayer2") {
      setupTitle.textContent = "Player2 - Place Your Ships";
      currentPlayerBoard = game.player2.gameBoard;
      resetBoard();
      renderBoard(placementBoardEl, currentPlayerBoard, true);
      updateStatus(
        "🚢 Player 2: Drag ships to place them on your board. Click Rotate to change direction.",
      );
      return;
    }

    setupSection.style.display = "none";
    boardsEl.style.display = "flex";

    if (game.gameMode === "twoPlayer") {
      player1Title.textContent = "Player 1's Fleet";
      player2Title.textContent = "Player 2's Fleet";
      updateStatus("🎯 Player 1's turn! Click on Player 2's board to attack.");
    } else {
      player1Title.textContent = "Your Fleet";
      player2Title.textContent = "Enemy Waters";
      updateStatus("🎯 Your turn! Click on the enemy waters to attack.");
    }

    renderGameBoard();
  });

  function renderGameBoard() {
    if (game.gameMode === "twoPlayer") {
      renderBoard(playerBoardEl, game.player1.gameBoard, true);
      renderBoard(computerBoardEl, game.player2.gameBoard, false);
    } else {
      renderBoard(playerBoardEl, game.player.gameBoard, true);
      renderBoard(computerBoardEl, game.computer.gameBoard, false);
    }
  }

  function handleReset() {
    const wasPlaying = game.phase === "playing" || game.phase === "gameover";
    const currentMode = game.gameMode;

    game.gameMode = "modeSelection";
    game.reset();

    if (
      wasPlaying ||
      currentMode === "modeSelection" ||
      currentMode === undefined
    ) {
      modeSelection.style.display = "block";
      setupSection.style.display = "none";
      boardsEl.style.display = "none";
    } else {
      game.gameMode = currentMode;
      if (currentMode === "computer") {
        startSetup("computer");
      } else if (currentMode === "twoPlayer") {
        startSetup("twoPlayer");
      }
    }
  }

  resetBtn.addEventListener("click", handleReset);
  resetBtnPlaying.addEventListener("click", handleReset);

  computerBoardEl.addEventListener("click", (e) => {
    if (game.phase !== "playing") return;

    const cell = e.target;
    if (!cell.classList.contains("cell")) return;
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);

    if (cell.classList.contains("hit") || cell.classList.contains("miss")) {
      updateStatus("⚠️ Already attacked that position! Choose another target.");
      return;
    }

    let result;
    if (game.gameMode === "twoPlayer") {
      if (game.currentTurn === "player1") {
        result = game.player1Attack(x, y);
        if (!result) {
          updateStatus("❌ Invalid attack. Try again!");
          return;
        }
      } else if (game.currentTurn === "player2") {
        result = game.player2Attack(x, y);
        if (!result) {
          updateStatus("❌ Invalid attack. Try again!");
          return;
        }
      } else {
        return;
      }
    } else {
      if (game.gameMode === "player") return;
      result = game.playerAttack(x, y);
      if (!result) {
        updateStatus("❌ Invalid attack. Try again!");
        return;
      }
    }
    renderGameBoard();

    if (result === "player-wins" || result === "player1-wins") {
      updateStatus("🎉🎉🎉 VICTORY! All enemy ships have been sunk! 🎉🎉🎉");
      return;
    }
    if (result === "player2-wisn" || result === "player2-wins") {
      updateStatus(
        "🎉🎉🎉 Player 2 Wins! All Player 1's ships have been sunk! 🎉🎉🎉",
      );
      return;
    }

    if (result === "hit") {
      if (game.gameMode === "twoPlayer") {
        const currentPlayer =
          game.currentTurn === "player1" ? "Player 1" : "Player 2";
        updateStatus(`💥 ${currentPlayer} hit! Switching turns...`);
        setTimeout(() => {
          const nextPlayer =
            game.currentTurn === "player1" ? "Player 1" : "Player 2";
          updateStatus(
            `🎯 ${nextPlayer}'s turn! Click on the opponent's board to attack.`,
          );
        }, 1000);
      } else {
        updateStatus(
          "💥 Direct hit! Enemy ship damaged! Computer is attacking...",
        );
        setTimeout(() => {
          const compResult = game.computerAttack();
          renderGameBoard();
          if (compResult === "computer-wins") {
            updateStatus(
              "💀 Defeat! All your ships have been sunk. Better luck next time!",
            );
          } else if (compResult === "hit") {
            updateStatus("💥 Enemy hit your ship! Your turn - strike back!");
          } else {
            updateStatus("🌊 Enemy missed! Your turn - choose your target!");
          }
        }, 1000);
      }
    } else {
      if (game.gameMode === "twoPlayer") {
        const currentPlayer =
          game.currentTurn === "player1" ? "Player 1" : "Player 2";
        updateStatus(`🌊 ${currentPlayer} missed! Switching turns...`);
        setTimeout(() => {
          const nextPlayer =
            game.currentTurn === "player1" ? "Player 1" : "Player 2";
          updateStatus(
            `🎯 ${nextPlayer}'s turn! Click on the opponent's board to attack.`,
          );
        }, 1000);
      } else {
        updateStatus(
          "🌊 Miss! The shot splashed into the water. Computer is attacking...",
        );
        // Computer turn
        setTimeout(() => {
          const compResult = game.computerAttack();
          renderGameBoards();
          if (compResult === "computer-wins") {
            updateStatus(
              "💀 Defeat! All your ships have been sunk. Better luck next time!",
            );
          } else if (compResult === "hit") {
            updateStatus("💥 Enemy hit your ship! Your turn - strike back!");
          } else {
            updateStatus("🌊 Enemy missed! Your turn - choose your target!");
          }
        }, 1000);
      }
    }
  });

  function updateStatus(message) {
    if (statusEl) {
      statusEl.textContent = message;
    }
  }

  updateStatus("Choose a game mode to start playing!");
}
