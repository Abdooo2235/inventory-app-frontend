// User Settings page - reuses the same theme selector as admin
import { Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useThemeStore } from '@/store/useThemeStore';
import { getThemesByType, type ThemeName } from '@/config/themes';
import { cn } from '@/lib/utils';

// Theme preview colors
const themeColors: Record<string, { bg: string; primary: string; secondary: string; accent: string }> = {
  light: { bg: '#ffffff', primary: '#171717', secondary: '#f5f5f5', accent: '#f5f5f5' },
  cupcake: { bg: '#faf7f5', primary: '#65c3c8', secondary: '#ef9fbc', accent: '#eeaf3a' },
  emerald: { bg: '#ffffff', primary: '#66cc8a', secondary: '#377cfb', accent: '#ea5234' },
  corporate: { bg: '#ffffff', primary: '#4b6bfb', secondary: '#7b92b2', accent: '#67cba0' },
  garden: { bg: '#e9e7e7', primary: '#5c7f67', secondary: '#ecf4e7', accent: '#f9d72f' },
  lofi: { bg: '#ffffff', primary: '#000000', secondary: '#e5e6e6', accent: '#1a1a1a' },
  pastel: { bg: '#ffeedd', primary: '#d1c1d7', secondary: '#f6cbd1', accent: '#b4e9d6' },
  winter: { bg: '#ffffff', primary: '#047aff', secondary: '#463aa2', accent: '#c148ac' },
  dark: { bg: '#1d232a', primary: '#661ae6', secondary: '#d926aa', accent: '#1fb2a5' },
  synthwave: { bg: '#1a103d', primary: '#e779c1', secondary: '#58c7f3', accent: '#f3cc30' },
  cyberpunk: { bg: '#ffee00', primary: '#ff00c5', secondary: '#00d4ff', accent: '#ff0000' },
  dracula: { bg: '#282a36', primary: '#ff79c6', secondary: '#bd93f9', accent: '#ffb86c' },
  night: { bg: '#0f1729', primary: '#38bdf8', secondary: '#818cf8', accent: '#fb7185' },
  forest: { bg: '#171212', primary: '#1eb854', secondary: '#1fd65f', accent: '#1db584' },
  luxury: { bg: '#09090b', primary: '#ffffff', secondary: '#152747', accent: '#513448' },
  coffee: { bg: '#20161f', primary: '#db924b', secondary: '#6f4e37', accent: '#ac8968' },
};

function ThemeCard({
  theme,
  isActive,
  onClick,
}: {
  theme: { name: ThemeName; label: string };
  isActive: boolean;
  onClick: () => void;
}) {
  const colors = themeColors[theme.name] || themeColors.light;

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all hover:scale-105',
        isActive ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
      )}
    >
      <div
        className="flex h-12 w-full overflow-hidden rounded-md"
        style={{ backgroundColor: colors.bg }}
      >
        <div className="w-1/4 h-full" style={{ backgroundColor: colors.primary }} />
        <div className="w-1/4 h-full" style={{ backgroundColor: colors.secondary }} />
        <div className="w-1/4 h-full" style={{ backgroundColor: colors.accent }} />
        <div className="w-1/4 h-full" style={{ backgroundColor: colors.bg }} />
      </div>
      <span className="text-sm font-medium">{theme.label}</span>
      {isActive && (
        <div className="absolute -right-1 -top-1 rounded-full bg-primary p-1">
          <Check className="h-3 w-3 text-primary-foreground" />
        </div>
      )}
    </button>
  );
}

export function SettingsPage() {
  const { theme, setTheme } = useThemeStore();
  const lightThemes = getThemesByType('light');
  const darkThemes = getThemesByType('dark');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Customize your dashboard appearance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>
            Choose a theme that suits your preference
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">Light Themes</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
              {lightThemes.map((t) => (
                <ThemeCard
                  key={t.name}
                  theme={t}
                  isActive={theme === t.name}
                  onClick={() => setTheme(t.name)}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">Dark Themes</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
              {darkThemes.map((t) => (
                <ThemeCard
                  key={t.name}
                  theme={t}
                  isActive={theme === t.name}
                  onClick={() => setTheme(t.name)}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SettingsPage;
