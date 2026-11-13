// Text for one change found on the official law site ({ change_type, sections, ... }).
export function changedSections(update, t, num) {
  if (update.change_type === 'new') return t('Full text', 'পূর্ণ পাঠ');
  const count = update.sections?.length || 0;
  if (!count) return t('Text changed', 'লেখা বদলেছে');
  const list = update.sections.slice(0, 3).map(num).join(', ') + (count > 3 ? '…' : '');
  return t(`s.${list}`, `ধারা ${list}`);
}
