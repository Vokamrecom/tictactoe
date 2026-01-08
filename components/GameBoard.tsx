'use client';

type CellValue = 'X' | 'O' | null;

interface GameBoardProps {
  board: CellValue[];
  onCellClick: (index: number) => void;
  disabled: boolean;
}

export default function GameBoard({ board, onCellClick, disabled }: GameBoardProps) {
  return (
    <div className="grid grid-cols-3 gap-3 bg-white/50 p-4 rounded-2xl shadow-inner">
      {board.map((cell, index) => (
        <button
          key={index}
          onClick={() => onCellClick(index)}
          disabled={disabled || cell !== null}
          className={`
            aspect-square rounded-xl text-4xl font-bold
            transition-all duration-200 transform
            ${cell === null 
              ? 'bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100 hover:from-pink-200 hover:via-rose-100 hover:to-purple-200 active:scale-95 border-2 border-pink-200 shadow-md hover:shadow-lg' 
              : 'bg-white shadow-lg cursor-not-allowed'
            }
            ${disabled && cell === null ? 'opacity-50 cursor-not-allowed hover:shadow-md' : ''}
            ${cell === 'X' ? 'text-pink-600' : cell === 'O' ? 'text-purple-600' : ''}
          `}
        >
          {cell === 'X' && <span className="animate-bounce-in">❌</span>}
          {cell === 'O' && <span className="animate-bounce-in">⭕</span>}
        </button>
      ))}
    </div>
  );
}

