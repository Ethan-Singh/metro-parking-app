import { lineBadge } from '../../css/lineBadge.ts';

export function routeBrandColor(label: string, fallback?: string) {
  const config =
    lineBadge.map[label.trim().toUpperCase() as keyof typeof lineBadge.map];
  return config?.color ?? fallback ?? '#0084D1';
}
