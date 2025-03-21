/**
 * Rock Paper Scissors Game
 * Improved implementation with modular structure, OOP approach,
 * and enhanced functionality
 */

// Game Configuration
class GameConfig {
  static OPTIONS = ["rock", "paper", "scissors"];
  static COLORS = {
    WIN: "#6ac475",
    LOSE: "#c4736a",
    DRAW: "#5865f2",
  };
  static IMAGES = {
    rock: "rock.png",
    paper: "paper.png",
    scissors: "scissor.png",
  };
  static RULES = {
    rock: { beats: "scissors" },
    paper: { beats: "rock" },
    scissors: { beats: "paper" },
  };
  static ANIMATION_DURATION = 1000; // ms
}

// Game State Management
class GameState {
  constructor() {
    this.score = {
      player: 0,
      computer: 0,
    };
    this.isAnimating = false;
    this.theme = localStorage.getItem("theme") || "dark";
  }

  reset() {
    this.score.player = 0;
    this.score.computer = 0;
    this.updateScoreDisplay();
    this.setResultText("");
    this.resetHands();
  }

  updateScoreDisplay() {
    DOM.playerScore.innerText = this.score.player;
    DOM.computerScore.innerText = this.score.computer;
  }

  setResultText(text, colorClass = "") {
    DOM.resultText.innerText = text;

    // Remove all possible color classes
    DOM.resultText.classList.remove("win-text", "lose-text", "draw-text");

    if (colorClass) {
      DOM.resultText.classList.add(colorClass);
    }
  }

  resetHands() {
    DOM.playerHand.src = GameConfig.IMAGES.rock;
    DOM.computerHand.src = GameConfig.IMAGES.rock;
    DOM.playerHand.classList.remove("shake-player");
    DOM.computerHand.classList.remove("shake-computer");
  }

  toggleTheme() {
    this.theme = this.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", this.theme);
    document.body.classList.toggle("light-theme");

    // Update theme toggle button text
    DOM.themeToggle.innerText =
      this.theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
  }
}

// DOM Elements Cache
const DOM = {
  init() {
    this.playerHand = document.querySelector(".hands .player-hand");
    this.computerHand = document.querySelector(".hands .computer-hand");
    this.resultText = document.querySelector(".hands .result");
    this.winnerText = document.querySelector(".winner");
    this.playerScore = document.querySelector(".score .you");
    this.computerScore = document.querySelector(".score .computer");
    this.optionButtons = document.querySelectorAll(".options button");
    this.resetButton = document.querySelector(".reset");

    // Add theme toggle button
    this.themeToggle = document.createElement("button");
    this.themeToggle.className = "theme-toggle";
    this.themeToggle.setAttribute("aria-label", "Toggle theme");
    document.querySelector(".reset-div").appendChild(this.themeToggle);
  },
};

// Game Logic Controller
class GameController {
  constructor() {
    this.state = new GameState();
    DOM.init();
    this.setupEventListeners();
    this.initTheme();
  }

  initTheme() {
    if (this.state.theme === "light") {
      document.body.classList.add("light-theme");
      DOM.themeToggle.innerText = "🌙 Dark Mode";
    } else {
      DOM.themeToggle.innerText = "☀️ Light Mode";
    }
  }

  setupEventListeners() {
    // Option buttons
    DOM.optionButtons.forEach((button) => {
      button.addEventListener("click", () => this.handlePlayerChoice(button));
    });

    // Reset button
    DOM.resetButton.addEventListener("click", () => this.state.reset());

    // Theme toggle
    DOM.themeToggle.addEventListener("click", () => this.state.toggleTheme());

    // Accessibility: keyboard navigation for game options
    DOM.optionButtons.forEach((button) => {
      button.setAttribute("tabindex", "0");
      button.setAttribute("role", "button");
      button.setAttribute(
        "aria-label",
        button.querySelector("label").innerText
      );

      button.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.handlePlayerChoice(button);
        }
      });
    });
  }

  /**
   * Handles player's choice and initiates game round
   * @param {HTMLElement} button - The button element clicked by player
   */
  handlePlayerChoice(button) {
    // Prevent spam clicks during animation
    if (this.state.isAnimating) return;

    this.state.isAnimating = true;

    // Reset hands and update message
    DOM.playerHand.src = GameConfig.IMAGES.rock;
    DOM.computerHand.src = GameConfig.IMAGES.rock;
    DOM.winnerText.innerText = "...";

    // Start animation
    DOM.playerHand.classList.add("shake-player");
    DOM.computerHand.classList.add("shake-computer");

    // Get player and computer choices
    const playerChoice = button.querySelector("label").innerText;
    const computerChoice = this.getComputerChoice();

    // Compare choices after animation completes
    setTimeout(() => {
      this.compareChoices(playerChoice, computerChoice);
      this.state.isAnimating = false;
      DOM.winnerText.innerText = "Choose an option";
    }, GameConfig.ANIMATION_DURATION);
  }

  /**
   * Generates computer's random choice
   * @returns {string} Computer's choice
   */
  getComputerChoice() {
    const randomIndex = Math.floor(Math.random() * GameConfig.OPTIONS.length);
    return GameConfig.OPTIONS[randomIndex];
  }

  /**
   * Compares player and computer choices to determine the winner
   * @param {string} playerChoice - Player's choice
   * @param {string} computerChoice - Computer's choice
   */
  compareChoices(playerChoice, computerChoice) {
    // Update hand images
    this.updateHandImages(playerChoice, computerChoice);

    // Determine the result
    if (playerChoice === computerChoice) {
      this.handleDraw();
    } else if (GameConfig.RULES[playerChoice].beats === computerChoice) {
      this.handlePlayerWin();
    } else {
      this.handleComputerWin();
    }
  }

  /**
   * Updates the hand images based on choices
   * @param {string} playerChoice - Player's choice
   * @param {string} computerChoice - Computer's choice
   */
  updateHandImages(playerChoice, computerChoice) {
    DOM.playerHand.src = GameConfig.IMAGES[playerChoice];
    DOM.computerHand.src = GameConfig.IMAGES[computerChoice];

    DOM.playerHand.classList.remove("shake-player");
    DOM.computerHand.classList.remove("shake-computer");
  }

  /**
   * Handles draw result
   */
  handleDraw() {
    this.state.setResultText("DRAW", "draw-text");
  }

  /**
   * Handles player win result
   */
  handlePlayerWin() {
    this.state.score.player++;
    this.state.setResultText("YOU WON", "win-text");
    this.state.updateScoreDisplay();
  }

  /**
   * Handles computer win result
   */
  handleComputerWin() {
    this.state.score.computer++;
    this.state.setResultText("YOU LOST", "lose-text");
    this.state.updateScoreDisplay();
  }
}

// Initialize the game when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  new GameController();
});
