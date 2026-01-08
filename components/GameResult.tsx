'use client';

type GameStatus = 'player-won' | 'computer-won' | 'draw';

interface GameResultProps {
  status: GameStatus;
  promoCode: string | null;
  onPlayAgain: () => void;
}

export default function GameResult({ status, promoCode, onPlayAgain }: GameResultProps) {
  if (status === 'player-won') {
    return (
      <div className="mt-6 text-center animate-fade-in">
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 rounded-2xl p-5 md:p-6 shadow-xl border-2 border-white/20">
          <p className="text-2xl md:text-3xl mb-4 text-white font-bold drop-shadow-lg">🎉 Поздравляем! Вы выиграли! 🎉</p>
          {promoCode && (
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 md:p-5 mb-4 shadow-lg border-2 border-pink-200">
              <p className="text-xs md:text-sm text-pink-600 mb-2 font-semibold">Ваш промокод на скидку:</p>
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent tracking-wider">
                {promoCode}
              </p>
            </div>
          )}
          <p className="text-white text-xs md:text-sm mb-4 font-medium">
            Сообщение отправлено в Telegram! ✉️
          </p>
          <button
            onClick={onPlayAgain}
            className="bg-white text-pink-600 px-6 py-3 rounded-xl font-bold hover:bg-pink-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            Играть снова ✨
          </button>
        </div>
      </div>
    );
  }

  if (status === 'computer-won') {
    return (
      <div className="mt-6 text-center animate-fade-in">
        <div className="bg-gradient-to-r from-rose-400 via-pink-400 to-rose-500 rounded-2xl p-5 md:p-6 shadow-xl border-2 border-white/20">
          <p className="text-2xl md:text-3xl mb-4 text-white font-bold drop-shadow-lg">😔 Увы, вы проиграли</p>
          <p className="text-white text-xs md:text-sm mb-4 font-medium">
            Сообщение отправлено в Telegram ✉️
          </p>
          <button
            onClick={onPlayAgain}
            className="bg-white text-pink-600 px-6 py-3 rounded-xl font-bold hover:bg-pink-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            Попробовать ещё раз 💪
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 text-center animate-fade-in">
      <div className="bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl p-5 md:p-6 shadow-xl border-2 border-white/20">
        <p className="text-2xl md:text-3xl mb-4 text-white font-bold drop-shadow-lg">🤝 Ничья!</p>
        <button
          onClick={onPlayAgain}
          className="bg-white text-pink-600 px-6 py-3 rounded-xl font-bold hover:bg-pink-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
        >
          Играть снова ✨
        </button>
      </div>
    </div>
  );
}

