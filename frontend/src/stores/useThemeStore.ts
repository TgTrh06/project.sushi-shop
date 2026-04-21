import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light", // Default theme
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === "light" ? "dark" : "light";
          document.documentElement.setAttribute("data-theme", newTheme);
          return { theme: newTheme };
        }),
      setTheme: (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        set({ theme });
      },
    }),
    {
      name: "theme-storage", // Used to persist in localStorage
      onRehydrateStorage: () => (state) => {
        // Apply theme right after state is rehydrated to prevent flashing
        if (state) {
          document.documentElement.setAttribute("data-theme", state.theme);
        }
      },
    }
  )
);
