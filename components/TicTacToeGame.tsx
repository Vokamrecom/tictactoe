'use client';

import { useState, useEffect } from 'react';
import GameBoard from './GameBoard';
import GameResult from './GameResult';
import TelegramSetup from './TelegramSetup';
import { checkWinner, getBestMove, generatePromoCode } from '@/lib/gameLogic';

type CellValue = 'X' | 'O' | null;
type GameStatus = 'playing' | 'player-won' | 'computer-won' | 'draw';

export default function TicTacToeGame() {
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [telegramChatId, setTelegramChatId] = useState<string | null>(null);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setGameStatus('playing');
    setPromoCode(null);
    setIsPlayerTurn(true);
  };

  const handleCellClick = async (index: number) => {
    if (board[index] || gameStatus !== 'playing' || !isPlayerTurn) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);

    const winner = checkWinner(newBoard);
    if (winner === 'X') {
      const code = generatePromoCode();
      setPromoCode(code);
      setGameStatus('player-won');
      
      // Отправляем сообщение в Telegram
      if (telegramChatId) {
        try {
          const response = await fetch('/api/telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              type: 'win', 
              promoCode: code,
              chatId: telegramChatId
            }),
          });
          const result = await response.json();
          if (!response.ok) {
            console.error('Ошибка отправки в Telegram:', result);
          } else {
            console.log('Сообщение успешно отправлено в Telegram:', result);
          }
        } catch (error) {
          console.error('Ошибка отправки в Telegram:', error);
        }
      }
      return;
    }

    if (!newBoard.includes(null)) {
      setGameStatus('draw');
      return;
    }

    // Ход компьютера
    setTimeout(async () => {
      const computerMove = getBestMove(newBoard);
      const updatedBoard = [...newBoard];
      updatedBoard[computerMove] = 'O';
      setBoard(updatedBoard);
      setIsPlayerTurn(true);

      const computerWinner = checkWinner(updatedBoard);
      if (computerWinner) {
        if (computerWinner === 'O') {
          setGameStatus('computer-won');
          
          if (telegramChatId) {
            try {
              const response = await fetch('/api/telegram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  type: 'lose',
                  chatId: telegramChatId
                }),
              });
              const result = await response.json();
              if (!response.ok) {
                console.error('Ошибка отправки в Telegram:', result);
              } else {
                console.log('Сообщение успешно отправлено в Telegram:', result);
              }
            } catch (error) {
              console.error('Ошибка отправки в Telegram:', error);
            }
          }
        }
      } else if (!updatedBoard.includes(null)) {
        setGameStatus('draw');
      }
    }, 500);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-pink-200/50 backdrop-blur-sm">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
          ✨ Крестики-нолики ✨
        </h1>
        <p className="text-center text-pink-600 mb-6 text-sm md:text-base font-medium">
          Играй и выигрывай промокоды! 💝
        </p>
        
        <TelegramSetup onChatIdSet={setTelegramChatId} />
        
        <GameBoard 
          board={board} 
          onCellClick={handleCellClick}
          disabled={!isPlayerTurn || gameStatus !== 'playing'}
        />
        
        {gameStatus !== 'playing' && (
          <GameResult 
            status={gameStatus}
            promoCode={promoCode}
            onPlayAgain={resetGame}
          />
        )}
        
        {gameStatus === 'playing' && (
          <p className="text-center mt-4 text-pink-700 font-semibold text-sm md:text-base animate-pulse">
            {isPlayerTurn ? '👤 Ваш ход!' : '🤖 Думаю...'}
          </p>
        )}
      </div>
    </div>
  );
}

