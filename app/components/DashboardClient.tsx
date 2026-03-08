"use client";

import { motion, AnimatePresence, Reorder } from "framer-motion";
import Link from "next/link";
import { Plus, Sparkles, BookOpen, Loader2, Save } from "lucide-react";
import LogoutButton from "./LogoutButton";
import { useOptimistic, useTransition, useRef, useState, useEffect } from "react";

export default function DashboardClient({ 
  flashcards, 
  user, 
  addCardAction,
  updatePositionsAction
}: { 
  flashcards: any[], 
  user: any,
  addCardAction: (formData: FormData) => Promise<void>,
  updatePositionsAction: (ids: string[]) => Promise<void>
}) {
  const [isPending, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  
  const [items, setItems] = useState(flashcards);

  useEffect(() => {
    setItems(flashcards);
  }, [flashcards]);

  const [optimisticCards, addOptimisticCard] = useOptimistic(
    items,
    (state, newCard: any) => [newCard, ...state]
  );

  const handleAction = async (formData: FormData) => {
    const front = formData.get("front_text") as string;
    const back = formData.get("back_text") as string;
    
    if (!front || !back) return;

    formRef.current?.reset();

    startTransition(async () => {
      const newCard = {
        id: Math.random().toString(),
        front_text: front,
        back_text: back,
        created_at: new Date().toISOString(),
        position: -1 // New cards go to the top
      };
      addOptimisticCard(newCard);
      await addCardAction(formData);
    });
  };

  const handleReorder = (newOrder: any[]) => {
    setItems(newOrder);
  };

  const saveOrder = async () => {
    setIsSaving(true);
    try {
      await updatePositionsAction(items.map(i => i.id));
    } finally {
      setIsSaving(false);
    }
  };

  const hasOrderChanged = JSON.stringify(items.map(i => i.id)) !== JSON.stringify(flashcards.map(i => i.id));

  return (
    <main className="max-w-5xl mx-auto p-6 pt-16 pb-24">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12"
      >
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ rotate: 5, scale: 1.05 }}
            className="p-3 bg-zinc-800/50 rounded-2xl border border-zinc-700/50 glass"
          >
            <BookOpen className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              My Decks
            </h1>
            <p className="text-zinc-400 text-sm">Welcome back, {user.name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {hasOrderChanged && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={saveOrder}
              disabled={isSaving}
              className="flex-1 sm:flex-none bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 hover:bg-blue-500 shadow-lg shadow-blue-500/20"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Order
            </motion.button>
          )}
          {items.length > 0 && (
            <Link
              href="/study"
              className="flex-1 sm:flex-none glass glass-hover px-6 py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-yellow-400 group-hover:animate-pulse" />
              Study Now
            </Link>
          )}
          <LogoutButton />
        </div>
      </motion.header>

      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass p-8 rounded-3xl mb-12 relative overflow-hidden"
      >
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-zinc-400" />
            Quick Add
          </h2>
          <form 
            ref={formRef}
            action={handleAction} 
            className="grid grid-cols-1 md:grid-cols-7 gap-4"
          >
            <div className="md:col-span-3">
              <input
                name="front_text"
                placeholder="Front (Question)"
                required
                disabled={isPending}
                autoComplete="off"
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 focus:border-zinc-500 focus:outline-none transition-colors text-white placeholder:text-zinc-600 focus:ring-1 ring-zinc-500/20 disabled:opacity-50"
              />
            </div>
            <div className="md:col-span-3">
              <input
                name="back_text"
                placeholder="Back (Answer)"
                required
                disabled={isPending}
                autoComplete="off"
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 focus:border-zinc-500 focus:outline-none transition-colors text-white placeholder:text-zinc-600 focus:ring-1 ring-zinc-500/20 disabled:opacity-50"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isPending}
              className="md:col-span-1 bg-white text-black font-bold py-4 px-6 rounded-xl hover:bg-zinc-200 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Add"}
            </motion.button>
          </form>
        </div>
      </motion.section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-zinc-400 flex items-center gap-2">
            Recent Cards <span className="bg-zinc-800 text-zinc-300 text-xs px-2 py-0.5 rounded-full">{items.length}</span>
          </h2>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Drag cards to reorder</p>
        </div>

        {items.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass p-12 rounded-3xl text-center border-dashed"
          >
            <p className="text-zinc-500 mb-2 italic">
              "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice."
            </p>
            <p className="text-zinc-400 font-medium">
              Start by creating your first flashcard above.
            </p>
          </motion.div>
        ) : (
          <Reorder.Group 
            axis="y" 
            values={items} 
            onReorder={handleReorder}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {items.map((card) => (
                <Reorder.Item
                  key={card.id}
                  value={card}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileDrag={{ 
                    scale: 1.05, 
                    zIndex: 50,
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)" 
                  }}
                  className="glass glass-hover p-6 rounded-2xl flex flex-col justify-between min-h-[160px] group transition-all cursor-grab active:cursor-grabbing relative"
                >
                  <div className="relative z-10">
                    <div className="w-8 h-1 bg-zinc-800 rounded-full mb-4 group-hover:bg-zinc-500 transition-colors" />
                    <p className="text-lg font-medium text-white leading-snug">
                      {card.front_text}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-zinc-800/50 relative z-10">
                    <p className="text-zinc-400 text-sm line-clamp-2 italic">
                      {card.back_text}
                    </p>
                  </div>
                  
                  {/* Subtle drag indicator that appears on hover */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-0.5">
                      <div className="w-1 h-1 bg-zinc-600 rounded-full" />
                      <div className="w-1 h-1 bg-zinc-600 rounded-full" />
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        )}
      </section>
    </main>
  );
}
