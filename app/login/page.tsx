"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";

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
    <div className="flex flex-col w-full px-8 sm:max-w-md justify-center mx-auto min-h-screen">
      <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="flex justify-center mb-6">
          <BookOpen className="w-10 h-10 text-zinc-900" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-6">Study Decks</h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 text-zinc-800"
        >
          {!isLogin && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" htmlFor="name">
                Full Name
              </label>
              <input
                className="rounded-md px-4 py-2 bg-zinc-50 border border-zinc-200 focus:outline-zinc-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              className="rounded-md px-4 py-2 bg-zinc-50 border border-zinc-200 focus:outline-zinc-400"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              className="rounded-md px-4 py-2 bg-zinc-50 border border-zinc-200 focus:outline-zinc-400"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-zinc-900 text-white rounded-md px-4 py-2 mt-2 font-medium hover:bg-zinc-800 transition disabled:opacity-50"
          >
            {isLoading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
          </button>

          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-zinc-500 hover:text-zinc-800 transition text-center mt-2"
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </button>

          {errorMsg && (
            <p className="mt-2 p-3 bg-red-50 text-red-600 text-center text-sm rounded-md border border-red-100">
              {errorMsg}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
