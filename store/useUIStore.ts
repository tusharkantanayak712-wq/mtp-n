import { create } from "zustand";

interface UIStore {
    isChatbotOpen: boolean;
    isSocialMenuOpen: boolean;
    setChatbotOpen: (open: boolean) => void;
    setSocialMenuOpen: (open: boolean) => void;
    toggleChatbot: () => void;
    toggleSocialMenu: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
    isChatbotOpen: false,
    isSocialMenuOpen: false,
    setChatbotOpen: (open) => set({ isChatbotOpen: open, isSocialMenuOpen: false }),
    setSocialMenuOpen: (open) => set({ isSocialMenuOpen: open, isChatbotOpen: false }),
    toggleChatbot: () => set((state) => ({ isChatbotOpen: !state.isChatbotOpen, isSocialMenuOpen: false })),
    toggleSocialMenu: () => set((state) => ({ isSocialMenuOpen: !state.isSocialMenuOpen, isChatbotOpen: false })),
}));
