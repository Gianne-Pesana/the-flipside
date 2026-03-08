"use client";
import { useState } from "react";
import { ChevronRight, RefreshCw, Eye } from "lucide-react";

export default function StudyDeck({ cards }: { cards: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = cards[currentIndex];

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setCurrentIndex(0);
      }
    }, 150);
  };

  return (
    <div className="w-full max-w-xl flex flex-col items-center gap-8">
      <div className="flex items-center gap-4 mb-4">
        <span className="h-px w-8 bg-zinc-800" />
        <p className="text-xs font-bold text-zinc-500 tracking-[0.2em] uppercase">
          Card {currentIndex + 1} of {cards.length}
        </p>
        <span className="h-px w-8 bg-zinc-800" />
      </div>

      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className={`w-full aspect-[16/10] glass rounded-[2rem] flex items-center justify-center p-12 cursor-pointer transition-all duration-500 preserve-3d relative group ${isFlipped ? '[transform:rotateY(10deg)]' : ''} hover:scale-[1.02] active:scale-[0.98] shadow-2xl`}
      >
        <div className="absolute top-6 right-8 flex items-center gap-2 text-zinc-500 group-hover:text-zinc-300 transition-colors">
          <RefreshCw className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Flip</span>
        </div>
        
        <div className="text-center">
          <p className={`text-sm font-bold uppercase tracking-[0.3em] mb-6 transition-colors ${isFlipped ? 'text-zinc-500' : 'text-zinc-400'}`}>
            {isFlipped ? "The Answer" : "The Question"}
          </p>
          <p className="text-3xl md:text-4xl font-semibold text-white leading-tight transition-all duration-300">
            {isFlipped ? currentCard.back_text : currentCard.front_text}
          </p>
        </div>
      </div>

      <div className="flex gap-4 w-full max-w-md mt-4">
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex-1 py-4 glass glass-hover text-zinc-300 rounded-2xl font-bold transition-all active:scale-[0.95] flex items-center justify-center gap-2 border border-zinc-800"
        >
          <Eye className="w-5 h-5" />
          {isFlipped ? "See Question" : "Reveal Answer"}
        </button>
        <button
          onClick={nextCard}
          className="flex-1 py-4 bg-white text-black rounded-2xl font-bold hover:bg-zinc-200 transition-all active:scale-[0.95] shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2"
        >
          Next Card
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      <div className="w-full max-w-xs h-1.5 bg-zinc-900 rounded-full overflow-hidden mt-4 border border-zinc-800/50">
        <div 
          className="h-full bg-white transition-all duration-500 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
