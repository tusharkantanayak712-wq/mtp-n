"use client";

import { usePathname } from "next/navigation";
import ChatBot from "@/components/SocialFloat/Chatbot";

export default function ChatbotWrapper() {
    const pathname = usePathname();
    const isGamePage = pathname?.startsWith("/games/");

    if (isGamePage) return null;

    return <ChatBot />;
}
