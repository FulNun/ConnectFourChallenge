document.addEventListener('DOMContentLoaded', function () {
  class Player {
    constructor(color) {
      this.color = color;
    }
  }

  class Game {
    constructor(height = 6, width = 7) {
      this.HEIGHT = height;
      this.WIDTH = width;
      this.currPlayer = null;
      this.board = [];
      this.gameOver = false;

      this.startButton = document.getElementById('start-game');
      this.colorForm = document.getElementById('color-form');
      this.startButton.addEventListener('click', this.startGame.bind(this));
      this.colorForm.addEventListener('submit', this.setPlayerColors.bind(this));

      this.makeBoard();
      this.makeHtmlBoard();
    }

    setPlayerColors(event) {
      event.preventDefault();
      const p1Color = document.getElementById('p1-color').value;
      const p2Color = document.getElementById('p2-color').value;

      this.currPlayer1 = new Player(p1Color);
      this.currPlayer2 = new Player(p2Color);
    }

    startGame() {
      if (!this.currPlayer1 || !this.currPlayer2) {
        alert('Please set player colors first.');
        return;
      }

      this.currPlayer = this.currPlayer1;
      this.board = Array.from({ length: this.HEIGHT }, () => Array(this.WIDTH).fill(null));
      this.gameOver = false;

      this.makeHtmlBoard();
    }

    makeBoard() {
      this.board = Array.from ({ length: this.HEIGHT }, () => Array(this.WIDTH).fill(null));
    }

    makeHtmlBoard() {
      const board = document.getElementById('board');
      board.innerHTML = '';

      for (let y = 0; y < this.HEIGHT; y++) {
        const row = document.createElement('tr');

        for (let x = 0; x < this.WIDTH; x++) {
          const cell = document.createElement('td');
          cell.setAttribute('id', `${y}-${x}`);
          cell.addEventListener('click', () => this.handleClick(x));
          row.appendChild(cell);
        }

        board.appendChild(row);
      }
    }

    // Inside the handleClick method
    handleClick(x) {
      if (this.gameOver) {
        return;
      }

      const y = this.findAvailableRow(x);
      if (y === -1) {
        return; // Column is full
      }

      this.board[y][x] = this.currPlayer;
      this.placeInTable(y, x);

      if (this.checkForWin(y, x)) {
        this.gameOver = true;
        if (this.currPlayer) { // Add this null check
          this.endGame(`${this.currPlayer.color} wins!`);
        }
      }

      if (this.board.every((row) => row.every((cell) => cell))) {
        this.gameOver = true;
        this.endGame('Tie Game!');
      }

      this.currPlayer = this.currPlayer === this.currPlayer1 ? this.currPlayer2 : this.currPlayer1;
    }

    findAvailableRow(x) {
      for (let y = this.HEIGHT - 1; y >= 0; y--) {
        if (!this.board[y][x]) {
          return y;
        }
      }
      return -1;
    }

    placeInTable(y, x) {
      const cell = document.getElementById(`${y}-${x}`);
      const piece = document.createElement('div');
      piece.className = `piece ${this.currPlayer === this.currPlayer1 ? 'p1' : 'p2'}`;
      cell.appendChild(piece);
    }

    checkForWin(y, x) {
      // Check for a win condition
      const directions = [
        [-1, 0],  // Vertical
        [0, 1],   // Horizontal
        [1, 1],   // Diagonal /
        [1, -1],  // Diagonal \
      ];

      for (const [dx, dy] of directions) {
        let count = 1;
        const color = this.board[y][x];

        for (let i = 1; i <= 3; i++) {
          const newX = x + i * dx;
          const newY = y + i * dy;

          if (newX >= 0 && newX < this.WIDTH && newY >= 0 && newY < this.HEIGHT && this.board[newY][newX] === color) {
            count++;
          } else {
            break;
          }
        }

        for (let i = 1; i <= 3; i++) {
          const newX = x - i * dx;
          const newY = y - i * dy;

          if (newX >= 0 && newX < this.WIDTH && newY >= 0 && newY < this.HEIGHT && this.board[newY][newX] === color) {
            count++;
          } else {
            break;
          }
        }

        if (count >= 4) {
          return true;
        }
      }

      return false;
    }

    endGame(message) {
      alert(message);
    }
  }

  document.getElementById('start-game').addEventListener('click', () => {
    new Game();
  });
});
