"use client";
import { useState } from "react";
import { ChevronRight, ChevronLeft, RefreshCw, Eye, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StudyDeck({ cards }: { cards: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(1); // 1 for next, -1 for prev

  const currentCard = cards[currentIndex];

  const nextCard = () => {
    setDirection(1);
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setCurrentIndex(0);
      }
    }, 100);
  };

  const prevCard = () => {
    setDirection(-1);
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      } else {
        setCurrentIndex(cards.length - 1);
      }
    }, 100);
  };

  return (
    <div className="w-full max-w-xl flex flex-col items-center gap-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-4"
      >
        <span className="h-px w-8 bg-zinc-800" />
        <p className="text-xs font-bold text-zinc-500 tracking-[0.2em] uppercase">
          Card {currentIndex + 1} of {cards.length}
        </p>
        <span className="h-px w-8 bg-zinc-800" />
      </motion.div>

      <div className="w-full aspect-[16/10] relative [perspective:1000px] group">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction * 50, rotateY: direction * 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -direction * 50, rotateY: -direction * 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full h-full relative [transform-style:preserve-3d] cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
              className="w-full h-full relative [transform-style:preserve-3d]"
            >
              {/* Front Side */}
              <div className="absolute inset-0 glass rounded-[2rem] flex flex-col items-center justify-center p-12 [backface-visibility:hidden] shadow-2xl border border-white/10 overflow-hidden">
                <div className="absolute top-6 right-8 flex items-center gap-2 text-zinc-500 group-hover:text-zinc-300 transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Flip</span>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] mb-6 text-zinc-500">
                    Question
                  </p>
                  <h2 className="text-2xl md:text-3xl font-semibold text-white leading-tight">
                    {currentCard.front_text}
                  </h2>
                </div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
              </div>

              {/* Back Side */}
              <div className="absolute inset-0 glass rounded-[2rem] flex flex-col items-center justify-center p-12 [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-2xl border border-white/20 overflow-hidden bg-white/[0.02]">
                <div className="absolute top-6 right-8 flex items-center gap-2 text-zinc-300">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Answer</span>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] mb-6 text-zinc-400">
                    The Answer
                  </p>
                  <h2 className="text-2xl md:text-3xl font-semibold text-white leading-tight">
                    {currentCard.back_text}
                  </h2>
                </div>
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-yellow-500/5 blur-3xl rounded-full" />
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 w-full mt-4"
      >
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex-1 py-4 glass glass-hover text-zinc-300 rounded-2xl font-bold transition-all active:scale-[0.95] flex items-center justify-center gap-2 border border-zinc-800"
        >
          <Eye className="w-5 h-5" />
          {isFlipped ? "See Question" : "Reveal Answer"}
        </button>
        
        <div className="flex flex-1 gap-4">
          <button
            onClick={prevCard}
            className="flex-1 py-4 glass glass-hover text-zinc-300 rounded-2xl font-bold transition-all active:scale-[0.95] flex items-center justify-center gap-2 border border-zinc-800"
          >
            <ChevronLeft className="w-5 h-5" />
            Prev
          </button>
          <button
            onClick={nextCard}
            className="flex-1 py-4 bg-white text-black rounded-2xl font-bold hover:bg-zinc-200 transition-all active:scale-[0.95] shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        className="w-full max-w-xs h-1.5 bg-zinc-900 rounded-full overflow-hidden mt-4 border border-zinc-800/50"
      >
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
        />
      </motion.div>
    </div>
  );
}
