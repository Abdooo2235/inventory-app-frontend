import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeName } from '@/config/themes';

interface ThemeStore {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => {
        // Update DOM attribute for CSS theming
        document.documentElement.setAttribute('data-theme', theme);
        // Add or remove 'dark' class for Tailwind dark mode
        if (['dark', 'synthwave', 'cyberpunk', 'dracula', 'night', 'forest', 'luxury', 'coffee'].includes(theme)) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ theme });
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        // Apply theme on app load from localStorage
        if (state?.theme) {
          document.documentElement.setAttribute('data-theme', state.theme);
          if (['dark', 'synthwave', 'cyberpunk', 'dracula', 'night', 'forest', 'luxury', 'coffee'].includes(state.theme)) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },
    }
  )
);
