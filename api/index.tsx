import { Button, Frog } from 'frog';
import { handle } from 'frog/vercel';

// Set up the app and the basic frame structure
export const app = new Frog({
  basePath: '/api',
  title: 'Tic Tac Toe',
});

// Tic Tac Toe Game Logic
app.frame('/game', (c) => {
  let board: string[] = Array(9).fill('');
  let currentPlayer: 'X' | 'O' = 'X'; // 'X' for user, 'O' for computer

  function checkWin(board: string[], player: 'X' | 'O'): boolean {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    return winPatterns.some(pattern =>
      pattern.every(index => board[index] === player)
    );
  }

  function makeMove(index: number): void {
    if (board[index] === '') {
      board[index] = currentPlayer;
      if (checkWin(board, currentPlayer)) {
        return endGame(currentPlayer);
      }
      if (board.includes('')) {
        currentPlayer = 'O';
        computerMove();
      }
    }
  }

  // Simple AI for the computer
  function computerMove(): void {
    const availableMoves = board
      .map((cell, index) => (cell === '' ? index : null))
      .filter(index => index !== null) as number[];
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    board[randomMove] = 'O';
    if (checkWin(board, 'O')) {
      return endGame('O');
    }
    currentPlayer = 'X';
  }

  function endGame(winner: 'X' | 'O'): void {
    alert(`${winner} wins!`);
    resetGame();
  }

  function resetGame(): void {
    board = Array(9).fill('');
    currentPlayer = 'X';
  }

  return c.res({
    image: (
      <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <h1>Tic Tac Toe</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)', gap: '5px', justifyContent: 'center' }}>
          {board.map((cell, index) => (
            <div
              key={index}
              onClick={() => makeMove(index)}
              style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#f0f0f0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '32px',
                cursor: 'pointer',
                border: '1px solid black',
              }}
            >
              {cell}
            </div>
          ))}
        </div>
        <Button action="/game">Restart Game</Button>
      </div>
    ),
  });
});

// Handle GET and POST requests
export const GET = handle(app);
export const POST = handle(app);
