import React, { useState } from 'react';
import FireworkCanvas from './components/FireworkCanvas';
import BirthdayCard from './components/BirthdayCard';
import { AppStage } from './types';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.INTRO);

  const startCelebration = () => {
    setStage(AppStage.CELEBRATION);
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-900 overflow-hidden flex items-center justify-center">
      
      {/* Background Visuals */}
      <FireworkCanvas isActive={stage === AppStage.CELEBRATION} />

      {/* Intro Overlay */}
      {stage === AppStage.INTRO && (
        <div className="relative z-20 text-center animate-fade-in">
          <button 
            onClick={startCelebration}
            className="group relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white text-white focus:ring-4 focus:outline-none focus:ring-blue-800 scale-125 transition-transform duration-300 hover:scale-135 active:scale-110"
          >
            <span className="relative px-8 py-4 transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0 text-xl font-bold">
              🎁 Нажми меня
            </span>
            
            {/* Glow effect */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-600 to-blue-600 opacity-50 blur-lg group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          </button>
          <p className="mt-4 text-slate-400 text-sm font-light tracking-widest uppercase">
            У меня есть сюрприз
          </p>
        </div>
      )}

      {/* Main Content */}
      <BirthdayCard visible={stage === AppStage.CELEBRATION} />
      
      {/* Audio hint (Visual only as we don't have file assets) */}
      {stage === AppStage.CELEBRATION && (
        <div className="absolute bottom-4 text-slate-500 text-xs text-center w-full opacity-50">
          Сгенерировано нейросетью специально для тебя ❤️
        </div>
      )}
    </div>
  );
};

export default App;