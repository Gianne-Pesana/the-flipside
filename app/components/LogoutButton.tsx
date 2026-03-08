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
        router.refresh();
      }}
      className="p-2 rounded-md hover:bg-zinc-200 text-zinc-600 transition flex items-center justify-center"
      title="Log out"
    >
      <LogOut className="w-5 h-5" />
    </button>
  );
}
