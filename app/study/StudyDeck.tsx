"use client";
import { useState } from "react";

export default function StudyDeck({ cards }: { cards: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = cards[currentIndex];

  const nextCard = () => {
    setIsFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-6">
      <p className="text-sm font-semibold text-zinc-400 tracking-widest uppercase">
        Card {currentIndex + 1} of {cards.length}
      </p>

      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full aspect-[4/3] bg-white border border-zinc-200 shadow-lg rounded-2xl flex items-center justify-center p-8 cursor-pointer hover:shadow-xl transition-all relative group"
      >
        <span className="absolute top-4 right-4 text-xs font-medium text-zinc-300 group-hover:text-zinc-400 transition-colors">
          Click to flip
        </span>
        <p className="text-3xl font-medium text-center text-zinc-800 leading-tight">
          {isFlipped ? currentCard.back_text : currentCard.front_text}
        </p>
      </div>

      <div className="flex gap-4 w-full mt-4">
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex-1 py-3 bg-zinc-100 text-zinc-700 rounded-xl font-medium hover:bg-zinc-200 transition active:scale-[0.98]"
        >
          {isFlipped ? "Show Question" : "Reveal Answer"}
        </button>
        <button
          onClick={nextCard}
          className="flex-1 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition active:scale-[0.98] shadow-md hover:shadow-lg"
        >
          Next Card
        </button>
      </div>
    </div>
  );
}
