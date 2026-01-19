# Battleship Game 🚢

Hey there! This is a classic Battleship game I built using vanilla JavaScript and Webpack. It's got a pretty nice UI and you can play against the computer or challenge a friend in two-player mode.

## Features

- **Two Game Modes**: Play against the computer AI or go head-to-head with another player
- **Drag & Drop Ship Placement**: Just drag your ships onto the board - super intuitive
- **Ship Rotation**: Click the rotate button to flip ships between horizontal and vertical
- **Visual Feedback**: Hit markers, miss indicators, and sunk ship animations make it easy to see what's happening
- **Reset Option**: Messed up your placement? No worries, just hit reset and start over
- **Responsive Design**: Works pretty well on different screen sizes

## How to Play

### Getting Started

First, you'll need to install the dependencies:

```bash
npm install
```

Then fire up the dev server:

```bash
npm start
```

This will open the game in your browser automatically. Pretty straightforward!

### Gameplay

**Step 1: Choose Your Mode**

- **Play vs Computer**: Quick game against the AI
- **Two Player**: Pass the device back and forth with a friend

**Step 2: Place Your Ships**

- Drag each ship from the ship yard onto your board
- Use the rotate button to change ship orientation
- You need to place all 5 ships:
  - Carrier (5 cells)
  - Battleship (4 cells)
  - Cruiser (3 cells)
  - Submarine (3 cells)
  - Destroyer (2 cells)

**Step 3: Battle!**

- Click on the enemy board to attack
- Red cells with 💥 = Hit!
- Light blue cells with ○ = Miss
- Black cells with 💀 = Sunk ship
- Take turns until someone sinks all the enemy ships

## Project Structure

The code is organized pretty cleanly:

```
src/
├── js/
│   ├── index.js              # Entry point - just initializes everything
│   ├── gameController.js      # Main game logic and turn management
│   ├── domController.js       # Handles all the UI stuff and user interactions
│   ├── player.js              # Player class (works for both human and computer)
│   ├── board.js               # The 10x10 game board logic
│   ├── ships.js               # Ship class with hit tracking
│   └── shipPlacement.js       # Random ship placement for computer
├── template.html              # HTML structure
└── styles.css                 # All the styling
```

## Development

I used Webpack for bundling, which makes development pretty smooth. The dev server has hot reload, so changes show up immediately.

**Run tests:**

```bash
npm test
```

**Build for production:**

```bash
npm run build
```

The tests cover the core game logic (ships, boards, players) using Jest. I tried to keep the game logic separate from the UI, which makes testing easier.

## Deployment

### Automated Deployment to GitHub Pages

This project includes automated deployment scripts for quick and easy publishing.

**On Windows (PowerShell):**

```powershell
.\deploy.ps1
```

**On macOS/Linux (Bash):**

```bash
chmod +x deploy.sh
./deploy.sh
```

Both scripts will:

1. Build your project with Webpack
2. Create/update the `gh-pages` branch
3. Push your dist files to GitHub Pages
4. Switch back to main branch

Make sure you've configured GitHub Pages in your repository settings to use the `gh-pages` branch as the source.

## Technical Details

- **JavaScript (ES6+)**: Modern JavaScript with classes and modules
- **Webpack 5**: Module bundling and dev server
- **Jest**: Unit testing framework
- **CSS Grid**: For the board layout (makes it super clean)
- **Drag & Drop API**: For ship placement

The game logic is pretty solid - ships can't overlap, attacks are validated, and the win condition is checked after each hit. The computer AI is pretty basic (just random attacks), but it works fine for a casual game.

Enjoy the game! Hope you have fun sinking some ships! ⚓🎮
