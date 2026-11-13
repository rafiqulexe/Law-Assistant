import { Copy, ExternalLink } from 'lucide-react';
import { useApp } from '@/lib/app';
import { Button, Sheet, SourceChip } from './ui';

// A source from the API: { label, act, section, text, url }. Older chats only have a label.
export function sourceTitle(source) {
  if (!source.act) return source.label;
  return source.section ? `${source.act} · ${source.section}` : source.act;
}

export function SourceSheet({ source, onClose }) {
  const { t, toast } = useApp();
  return (
    <Sheet
      open={!!source}
      onClose={onClose}
      title={t('Source', 'উৎস')}
      footer={
        source && (
          <div className="flex gap-2">
            <Button
              variant="neutral"
              className="flex-1"
              icon={<Copy className="size-4" />}
              onClick={() => {
                navigator.clipboard?.writeText(source.label);
                toast(t('Citation copied', 'উদ্ধৃতি কপি হয়েছে'));
              }}
            >
              {t('Copy citation', 'উদ্ধৃতি কপি')}
            </Button>
            {source.url && (
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 text-[15px] font-medium text-accent-ink hover:bg-accent-hover"
              >
                {t('Official text', 'সরকারি পাঠ')} <ExternalLink className="size-4" />
              </a>
            )}
          </div>
        )
      }
    >
      {source && (
        <article className="anim-fade">
          <p className="text-[13px] font-medium text-muted">{source.act || t('Law library', 'আইন লাইব্রেরি')}</p>
          <h3 className="mt-1 text-[22px] font-semibold tracking-tight">{source.section || source.label}</h3>
          {source.text ? (
            <blockquote className="mt-5 rounded-2xl border border-line bg-surface p-5 text-[15px] leading-[1.7] whitespace-pre-line">
              {source.text}
            </blockquote>
          ) : (
            <p className="mt-5 text-[15px] text-muted">
              {t(
                'The passage text was not saved for this older answer.',
                'পুরোনো এই উত্তরের জন্য অংশটির লেখা সংরক্ষিত নেই।',
              )}
            </p>
          )}
          <p className="mt-4 text-[13px] text-muted">
            {source.url
              ? t(
                  'Source: Laws of Bangladesh, Legislative and Parliamentary Affairs Division.',
                  'উৎস: বাংলাদেশের আইন, লেজিসলেটিভ ও সংসদ বিষয়ক বিভাগ।',
                )
              : source.label}
          </p>
        </article>
      )}
    </Sheet>
  );
}

export function SourceChips({ sources, onOpen }) {
  return (
    <div className="flex flex-wrap gap-2">
      {sources.map((source) => (
        <SourceChip key={source.label} label={sourceTitle(source)} onClick={() => onOpen(source)} />
      ))}
    </div>
  );
}
