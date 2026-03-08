"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Plus, Sparkles, BookOpen, Loader2, Edit2, Trash2, Check, X } from "lucide-react";
import LogoutButton from "./LogoutButton";
import ConfirmationModal from "./ConfirmationModal";
import { useOptimistic, useTransition, useRef, useState } from "react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function DashboardClient({ 
  flashcards, 
  user, 
  addCardAction,
  editCardAction,
  deleteCardAction
}: { 
  flashcards: any[], 
  user: any,
  addCardAction: (formData: FormData) => Promise<void>,
  editCardAction: (formData: FormData) => Promise<void>,
  deleteCardAction: (id: string) => Promise<void>
}) {
  const [isPending, startTransition] = useTransition();
  const [editingCard, setEditingCard] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  const [optimisticCards, addOptimisticCard] = useOptimistic(
    flashcards,
    (state, action: { type: 'add' | 'edit' | 'delete', payload: any }) => {
      switch (action.type) {
        case 'add':
          return [action.payload, ...state];
        case 'edit':
          return state.map(card => card.id === action.payload.id ? { ...card, ...action.payload } : card);
        case 'delete':
          return state.filter(card => card.id !== action.payload);
        default:
          return state;
      }
    }
  );

  const handleAdd = async (formData: FormData) => {
    const front = formData.get("front_text") as string;
    const back = formData.get("back_text") as string;
    if (!front || !back) return;

    formRef.current?.reset();

    startTransition(async () => {
      addOptimisticCard({
        type: 'add',
        payload: { id: Math.random().toString(), front_text: front, back_text: back, created_at: new Date().toISOString() }
      });
      await addCardAction(formData);
    });
  };

  const handleEdit = async (formData: FormData) => {
    const id = formData.get("id") as string;
    const front = formData.get("front_text") as string;
    const back = formData.get("back_text") as string;
    if (!id || !front || !back) return;

    setEditingCard(null);

    startTransition(async () => {
      addOptimisticCard({
        type: 'edit',
        payload: { id, front_text: front, back_text: back }
      });
      await editCardAction(formData);
    });
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    const id = deletingId;

    startTransition(async () => {
      addOptimisticCard({
        type: 'delete',
        payload: id
      });
      await deleteCardAction(id);
    });
    setDeletingId(null);
  };

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
          {optimisticCards.length > 0 && (
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
            action={handleAdd} 
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
            Recent Cards <span className="bg-zinc-800 text-zinc-300 text-xs px-2 py-0.5 rounded-full">{optimisticCards.length}</span>
          </h2>
        </div>

        <AnimatePresence mode="popLayout" initial={false}>
          {optimisticCards.length === 0 ? (
            <motion.div 
              key="empty-state"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
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
            <motion.div 
              key="grid-state"
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {optimisticCards.map((card) => (
                <motion.div
                  key={card.id}
                  variants={item}
                  layout
                  className="glass p-6 rounded-2xl flex flex-col justify-between min-h-[160px] group transition-all relative overflow-hidden"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-8 h-1 bg-zinc-800 rounded-full group-hover:bg-zinc-500 transition-colors" />
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingCard(card)}
                          className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(card.id)}
                          className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-red-400 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-lg font-medium text-white leading-snug">
                      {card.front_text}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-zinc-800/50">
                    <p className="text-zinc-400 text-sm line-clamp-2 italic">
                      {card.back_text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingCard(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass w-full max-w-lg p-8 rounded-[2.5rem] relative z-10 shadow-2xl border border-white/10"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-800 rounded-xl">
                    <Edit2 className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Edit Card</h2>
                </div>
                <button
                  onClick={() => setEditingCard(null)}
                  className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form action={handleEdit} className="flex flex-col gap-6">
                <input type="hidden" name="id" value={editingCard.id} />
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">
                    Front side (Question)
                  </label>
                  <input
                    name="front_text"
                    defaultValue={editingCard.front_text}
                    autoFocus
                    autoComplete="off"
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 text-white focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">
                    Back side (Answer)
                  </label>
                  <textarea
                    name="back_text"
                    defaultValue={editingCard.back_text}
                    autoComplete="off"
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 text-zinc-200 focus:outline-none focus:border-zinc-500 min-h-[120px] resize-none transition-colors"
                  />
                </div>

                <div className="flex gap-4 mt-4">
                  <button
                    type="button"
                    onClick={() => setEditingCard(null)}
                    className="flex-1 py-4 glass glass-hover text-zinc-300 rounded-2xl font-bold transition-all active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-white text-black rounded-2xl font-bold hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Flashcard"
        description="Are you sure you want to delete this flashcard? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </main>
  );
}
