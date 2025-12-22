import React, { useEffect, useState } from 'react';
import { generateBirthdayWish } from '../services/geminiService';

interface BirthdayCardProps {
  visible: boolean;
}

const BirthdayCard: React.FC<BirthdayCardProps> = ({ visible }) => {
  const [wish, setWish] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Initial load
  useEffect(() => {
    if (visible && !wish) {
      handleGenerateWish();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleGenerateWish = async () => {
    setLoading(true);
    const text = await generateBirthdayWish();
    setWish(text);
    setLoading(false);
  };

  if (!visible) return null;

  return (
    <div className={`
      relative z-10 flex flex-col items-center justify-center p-6 text-center
      transition-all duration-1000 ease-out transform
      ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
    `}>
      <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 drop-shadow-lg mb-8 animate-pulse font-['Montserrat']">
        С ДНЁМ<br/>РОЖДЕНИЯ!
      </h1>

      <div className="max-w-md w-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl">
        {loading ? (
          <div className="h-32 flex flex-col items-center justify-center space-y-4">
             <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-pink-200 text-sm animate-pulse">Генерирую поздравление...</p>
          </div>
        ) : (
          <div className="animate-fade-in-up">
            <p className="text-xl md:text-2xl text-white font-['Pacifico'] leading-relaxed mb-6">
              {wish}
            </p>
            <button 
              onClick={handleGenerateWish}
              className="px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-transform"
            >
              ✨ Ещё одно пожелание
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthdayCard;