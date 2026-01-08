type CellValue = 'X' | 'O' | null;

export function checkWinner(board: CellValue[]): 'X' | 'O' | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as 'X' | 'O';
    }
  }

  return null;
}

export function getBestMove(board: CellValue[]): number {
  // Проверяем, может ли компьютер выиграть
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      const testBoard = [...board];
      testBoard[i] = 'O';
      if (checkWinner(testBoard) === 'O') {
        return i;
      }
    }
  }

  // Блокируем выигрыш игрока
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      const testBoard = [...board];
      testBoard[i] = 'X';
      if (checkWinner(testBoard) === 'X') {
        return i;
      }
    }
  }

  // Занимаем центр, если свободен
  if (board[4] === null) {
    return 4;
  }

  // Занимаем углы
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter(i => board[i] === null);
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }

  // Занимаем любую свободную клетку
  const available = board
    .map((cell, index) => cell === null ? index : -1)
    .filter(index => index !== -1);
  
  return available[Math.floor(Math.random() * available.length)];
}

export function generatePromoCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

