/**
 * Editable brand identity colors. The generator keeps Starwind brand tokens
 * and the favicon in sync. Non-brand tokens stay Tailwind palette variables.
 */
export interface BrandColors {
  primary: string;
  primaryForeground: string;
  primaryAccent: string;
  faviconForeground: string;
}

export const brandColors: BrandColors = {
  primary: '#991b1b',
  primaryForeground: '#f8fafc',
  primaryAccent: '#7f1d1d',
  faviconForeground: '#f8fafc',
};
