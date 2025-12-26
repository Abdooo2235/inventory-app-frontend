import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { useEffect } from 'react';
import { useThemeStore } from '@/store/useThemeStore';
import { Toaster } from '@/components/ui/sonner';

export function App() {
  const { theme } = useThemeStore();

  // Initialize theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    const darkThemes = ['dark', 'synthwave', 'cyberpunk', 'dracula', 'night', 'forest', 'luxury', 'coffee'];
    if (darkThemes.includes(theme)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}

export default App;