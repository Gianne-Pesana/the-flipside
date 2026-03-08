"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";

export default function LogoutButton() {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="glass glass-hover p-3 rounded-xl transition-all text-zinc-400 hover:text-red-400 group"
        title="Log out"
      >
        <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        description="Are you sure you want to sign out of your account?"
        confirmText="Sign Out"
        variant="danger"
      />
    </>
  );
}
