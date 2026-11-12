import { useQuery } from '@tanstack/react-query';
import { legal } from '@/api/client';

// Shared by the banner on every page and the Law Updates page.
export function useLawUpdates(limit = 20) {
  return useQuery({
    queryKey: ['law-updates', limit],
    queryFn: () => legal.lawUpdates(limit),
    staleTime: 5 * 60 * 1000,
  });
}

// SQLite stores UTC as "YYYY-MM-DD HH:MM:SS".
export function formatDate(value, language = 'en') {
  if (!value) return '';
  const date = new Date(value.replace(' ', 'T') + 'Z');
  const locale = language === 'bn' ? 'bn-BD' : 'en-GB';
  return date.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function describeChange(update, t, formatNumber) {
  if (update.change_type === 'new') return t('updates.newLaw');
  const count = update.sections?.length || 0;
  if (!count) return t('updates.amended');
  return count === 1 ? t('updates.sectionChanged') : t('updates.sectionsChanged', { count: formatNumber(count) });
}
