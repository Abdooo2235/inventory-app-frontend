// Theme configuration for the inventory dashboard
// Similar to DaisyUI themes with shadcn/ui compatibility

export const THEMES = [
  // Light themes
  { name: 'light', label: 'Light', type: 'light' },
  { name: 'cupcake', label: 'Cupcake', type: 'light' },
  { name: 'emerald', label: 'Emerald', type: 'light' },
  { name: 'corporate', label: 'Corporate', type: 'light' },
  { name: 'garden', label: 'Garden', type: 'light' },
  { name: 'lofi', label: 'Lo-Fi', type: 'light' },
  { name: 'pastel', label: 'Pastel', type: 'light' },
  { name: 'winter', label: 'Winter', type: 'light' },
  // Dark themes
  { name: 'dark', label: 'Dark', type: 'dark' },
  { name: 'synthwave', label: 'Synthwave', type: 'dark' },
  { name: 'cyberpunk', label: 'Cyberpunk', type: 'dark' },
  { name: 'dracula', label: 'Dracula', type: 'dark' },
  { name: 'night', label: 'Night', type: 'dark' },
  { name: 'forest', label: 'Forest', type: 'dark' },
  { name: 'luxury', label: 'Luxury', type: 'dark' },
  { name: 'coffee', label: 'Coffee', type: 'dark' },
] as const;

export type ThemeName = (typeof THEMES)[number]['name'];
export type ThemeType = 'light' | 'dark';

export interface Theme {
  name: ThemeName;
  label: string;
  type: ThemeType;
}

// Helper to get theme by name
export function getTheme(name: ThemeName): Theme | undefined {
  return THEMES.find((t) => t.name === name);
}

// Helper to get themes by type
export function getThemesByType(type: ThemeType): Theme[] {
  return THEMES.filter((t) => t.type === type);
}
