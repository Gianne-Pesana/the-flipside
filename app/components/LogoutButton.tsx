"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await authClient.signOut();
        router.push("/login");
      }}
      className="glass glass-hover p-3 rounded-xl transition-all text-zinc-400 hover:text-red-400 group"
      title="Log out"
    >
      <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
    </button>
  );
}
