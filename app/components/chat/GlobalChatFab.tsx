"use client"
import { MessageCircle } from "lucide-react";

interface GlobalChatFabProps {
  onClick: () => void;
}

export default function GlobalChatFab({ onClick }: GlobalChatFabProps) {
  return (
    <button
      onClick={onClick}
      className="fixed z-[3001] bottom-6 right-6 bg-violet-600 hover:bg-violet-700 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-violet-300"
      aria-label="Open Group Chat"
      style={{ boxShadow: "0 4px 24px 0 rgba(139,92,246,0.25)" }}
    >
      <MessageCircle className="w-8 h-8" />
    </button>
  );
} 