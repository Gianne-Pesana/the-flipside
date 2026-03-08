"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { BookOpen, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await authClient.signIn.email({ email, password });
        if (error) setErrorMsg(error.message || "Login failed");
        else router.push("/");
      } else {
        const { error } = await authClient.signUp.email({
          email,
          password,
          name,
        });
        if (error) setErrorMsg(error.message || "Signup failed");
        else router.push("/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full px-8 sm:max-w-md justify-center mx-auto min-h-screen relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="glass p-8 rounded-3xl shadow-2xl relative z-10 border border-white/10"
      >
        <div className="flex justify-center mb-6">
          <motion.div 
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="p-3 bg-zinc-800/50 rounded-2xl border border-zinc-700/50"
          >
            <BookOpen className="w-8 h-8 text-zinc-100" />
          </motion.div>
        </div>
        
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold tracking-tight text-white mb-2"
          >
            The Flipside
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-zinc-400 text-sm"
          >
            {isLogin ? "Welcome back to your study space" : "Create an account to start learning"}
          </motion.p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-1.5"
              >
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1" htmlFor="name">
                  Full Name
                </label>
                <input
                  className="rounded-xl px-4 py-3 bg-zinc-900/50 border border-zinc-800 focus:border-zinc-500 focus:outline-none transition-colors text-white placeholder:text-zinc-600"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1" htmlFor="email">
              Email Address
            </label>
            <input
              className="rounded-xl px-4 py-3 bg-zinc-900/50 border border-zinc-800 focus:border-zinc-500 focus:outline-none transition-colors text-white placeholder:text-zinc-600"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1" htmlFor="password">
              Password
            </label>
            <input
              className="rounded-xl px-4 py-3 bg-zinc-900/50 border border-zinc-800 focus:border-zinc-500 focus:outline-none transition-colors text-white placeholder:text-zinc-600"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="bg-white text-black rounded-xl px-4 py-3 mt-4 font-semibold hover:bg-zinc-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              isLogin ? "Sign In" : "Create Account"
            )}
          </motion.button>

          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors text-center mt-2"
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </button>

          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-3 bg-red-500/10 text-red-400 text-center text-sm rounded-xl border border-red-500/20"
            >
              {errorMsg}
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
}
