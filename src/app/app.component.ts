import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {

  player2 = { name: 'Player 2', symbol: 'o' };
  player1 = { name: 'Você', symbol: 'x' };
  DRAW = { name: 'Empate' };

  board: any[];
  currentPlayer = this.player1;
  lastWinner: any;
  gameOver: boolean;
  boardLocked: boolean;

  constructor() { }

  ngOnInit() {
    this.newGame();
  }

  square_click(square) {
    if (square.value === '' && !this.gameOver) {
      square.value = this.player1.symbol;
      this.completeMove(this.player1);
    }
  }

  computerMove(firstMove: boolean = false) {
    this.boardLocked = true;

    setTimeout(() => {
      const square = firstMove ? this.board[4] : this.getRandomAvailableSquare();
      square.value = this.player2.symbol;
      this.completeMove(this.player2);
      this.boardLocked = false;
    }, 600);
  }

  completeMove(player) {
    if (this.isWinner(player.symbol)) {
      this.showGameOver(player);
    } else if (!this.availableSquaresExist()) {
      this.showGameOver(this.DRAW);
 } else {
      this.currentPlayer = (this.currentPlayer === this.player2 ? this.player1 : this.player2);

      if (this.currentPlayer === this.player2) {
        this.computerMove();
      }
    }
  }

  availableSquaresExist(): boolean {
    return this.board.filter(s => s.value === '').length > 0;
  }

  getRandomAvailableSquare(): any {
    const availableSquares = this.board.filter(s => s.value === '');
    const squareIndex = this.getRndInteger(0, availableSquares.length - 1);

    return availableSquares[squareIndex];
  }

  showGameOver(winner) {
    this.gameOver = true;
    this.lastWinner = winner;

    if (winner !== this.DRAW) {
      this.currentPlayer = winner;
    }
  }

  get winningIndexes(): any[] {
    return [
      [0, 1, 2],  // top row
      [3, 4, 5],  // middle row
      [6, 7, 8],  // bottom row
      [0, 3, 6],  // first col
      [1, 4, 7],  // second col
      [2, 5, 8],  // third col
      [0, 4, 8],  // first diagonal
      [2, 4, 6]   // second diagonal
    ];
  }

  isWinner(symbol): boolean {
    for (const pattern of this.winningIndexes) {
      const foundWinner = this.board[pattern[0]].value === symbol
        && this.board[pattern[1]].value === symbol
        && this.board[pattern[2]].value === symbol;

      if (foundWinner) {
        for (const index of pattern) {
          this.board[index].winner = true;
        }

        return true;
      }
    }

    return false;
  }

  newGame() {
    this.board = [
      { value: '' }, { value: '' }, { value: '' },
      { value: '' }, { value: '' }, { value: '' },
      { value: '' }, { value: '' }, { value: '' }
    ];

    this.gameOver = false;
    this.boardLocked = false;

    if (this.currentPlayer === this.player2) {
      this.boardLocked = true;
      this.computerMove(true);
    }
  }

  getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
