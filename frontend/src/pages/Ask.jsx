import { ArrowUp, Check, Copy, MessageSquare, PanelLeft, Pencil, Plus, Share, SquarePen, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { legal } from '@/api/client';
import { useApp } from '@/lib/app';
import { EXAMPLE_QUESTIONS } from '@/lib/data';
import { SourceChips, SourceSheet } from '@/components/SourceSheet';
import { Button, Disclaimer, EmptyState, LogoMark, Sheet, Skeleton, cx } from '@/components/ui';

let tempId = 0;
const localId = () => `local-${++tempId}`;

// Answers come back as Markdown; keep the styling calm.
const markdown = {
  p: (props) => <p {...props} />,
  ul: (props) => <ul className="list-disc space-y-1 pl-5" {...props} />,
  ol: (props) => <ol className="list-decimal space-y-1 pl-5" {...props} />,
  strong: (props) => <strong className="font-semibold" {...props} />,
  a: (props) => <a className="text-accent-text underline" target="_blank" rel="noreferrer" {...props} />,
  h1: (props) => <p className="font-semibold" {...props} />,
  h2: (props) => <p className="font-semibold" {...props} />,
  h3: (props) => <p className="font-semibold" {...props} />,
};

export default function Ask() {
  const { t, tr, tError, pendingQuestion, setPendingQuestion, confirm, toast, date } = useApp();
  const [convos, setConvos] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [source, setSource] = useState(null);
  const [sidebar, setSidebar] = useState(false);
  const [editing, setEditing] = useState(null);
  const scrollRef = useRef(null);
  const taRef = useRef(null);

  const active = convos?.find((c) => c.id === activeId) || null;

  useEffect(() => {
    legal
      .conversations()
      .then(setConvos)
      .catch(() => setConvos([]));
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length, thinking]);

  useEffect(() => {
    const ta = taRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
    }
  }, [input]);

  const openConversation = async (id) => {
    setSidebar(false);
    if (id === activeId) return;
    setActiveId(id);
    setMessages([]);
    setLoadingChat(true);
    try {
      const rows = await legal.conversation(id);
      setMessages(rows.map((row) => ({ id: localId(), ...row })));
    } catch (error) {
      toast(tError(error.message), 'error');
    } finally {
      setLoadingChat(false);
    }
  };

  const send = useCallback(
    async (text) => {
      const question = text.trim();
      if (!question || thinking) return;
      const pending = { id: localId(), role: 'user', content: question };
      setMessages((list) => [...list, pending]);
      setInput('');
      setThinking(true);
      try {
        const data = await legal.chat(question, activeId);
        if (!activeId) {
          setActiveId(data.conversation_id);
          setConvos((list) => [
            { id: data.conversation_id, title: question.slice(0, 80), created_at: new Date().toISOString() },
            ...(list || []),
          ]);
        }
        setMessages((list) => [
          ...list,
          { id: localId(), role: 'assistant', content: data.answer, sources: data.sources || [] },
        ]);
      } catch (error) {
        // The server drops an unanswered question, so take it off the screen too.
        setMessages((list) => list.filter((m) => m.id !== pending.id));
        setInput(question);
        toast(tError(error.message), 'error');
      } finally {
        setThinking(false);
      }
    },
    [activeId, thinking, tError, toast],
  );

  // A question typed on the home page.
  const consumed = useRef(false);
  useEffect(() => {
    if (pendingQuestion && !consumed.current) {
      consumed.current = true;
      setPendingQuestion('');
      send(pendingQuestion);
    }
  }, [pendingQuestion, setPendingQuestion, send]);

  const newChat = () => {
    setActiveId(null);
    setMessages([]);
    setSidebar(false);
    setTimeout(() => taRef.current?.focus(), 50);
  };

  const rename = async (convo, title) => {
    setEditing(null);
    if (!title || title === convo.title) return;
    try {
      const data = await legal.renameConversation(convo.id, title);
      setConvos((list) => list.map((c) => (c.id === convo.id ? { ...c, title: data.title } : c)));
    } catch (error) {
      toast(tError(error.message), 'error');
    }
  };

  const remove = async (convo) => {
    const ok = await confirm({
      title: t('Delete this chat?', 'এই চ্যাট মুছবেন?'),
      body: t(`“${convo.title}” will be permanently deleted.`, `“${convo.title}” স্থায়ীভাবে মুছে যাবে।`),
      confirmLabel: t('Delete', 'মুছুন'),
      destructive: true,
    });
    if (!ok) return;
    try {
      await legal.deleteConversation(convo.id);
      setConvos((list) => list.filter((c) => c.id !== convo.id));
      if (activeId === convo.id) newChat();
      toast(t('Chat deleted', 'চ্যাট মুছে ফেলা হয়েছে'));
    } catch (error) {
      toast(tError(error.message), 'error');
    }
  };

  const sidebarBody = (
    <div className="flex h-full flex-col">
      <Button
        variant="neutral"
        className="w-full justify-start"
        icon={<SquarePen className="size-[18px]" />}
        onClick={newChat}
      >
        {t('New chat', 'নতুন চ্যাট')}
      </Button>
      <p className="mt-6 mb-2 px-3 text-[12px] font-semibold text-muted">{t('Recent', 'সাম্প্রতিক')}</p>
      {convos === null ? (
        <div className="flex flex-col gap-2 px-3">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-4/5" />
        </div>
      ) : convos.length === 0 ? (
        <p className="px-3 text-[13px] text-muted">{t('No conversations yet.', 'এখনো কোনো কথোপকথন নেই।')}</p>
      ) : (
        <ul className="flex flex-col gap-0.5">
          {convos.map((c) => (
            <li key={c.id} className="group relative">
              {editing === c.id ? (
                <input
                  autoFocus
                  defaultValue={c.title}
                  maxLength={80}
                  aria-label={t('Rename chat', 'চ্যাটের নাম বদলান')}
                  onBlur={(e) => rename(c, e.target.value.trim())}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.currentTarget.blur();
                    if (e.key === 'Escape') setEditing(null);
                  }}
                  className="h-11 w-full rounded-xl border border-[var(--focus)] bg-surface px-3 text-[14px] ring-4 ring-accent/15 outline-none"
                />
              ) : (
                <>
                  <button
                    onClick={() => openConversation(c.id)}
                    aria-current={activeId === c.id ? 'true' : undefined}
                    className={cx(
                      'flex min-h-11 w-full flex-col justify-center rounded-xl py-2 pr-20 pl-3 text-left transition-colors',
                      activeId === c.id ? 'bg-fg/[0.07]' : 'hover:bg-fg/[0.04]',
                    )}
                  >
                    <span className="block truncate text-[14px]">{c.title}</span>
                    <span className="text-[12px] text-muted">
                      {date(c.created_at, { day: 'numeric', month: 'short' })}
                    </span>
                  </button>
                  <div className="absolute top-1/2 right-1 flex -translate-y-1/2 opacity-100 transition-opacity md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
                    <button
                      onClick={() => setEditing(c.id)}
                      aria-label={t('Rename', 'নাম বদলান')}
                      className="flex size-9 items-center justify-center rounded-lg text-muted hover:bg-fg/[0.06] hover:text-fg"
                    >
                      <Pencil className="size-4" strokeWidth={1.75} />
                    </button>
                    <button
                      onClick={() => remove(c)}
                      aria-label={t('Delete', 'মুছুন')}
                      className="flex size-9 items-center justify-center rounded-lg text-muted hover:bg-high-tint hover:text-high"
                    >
                      <Trash2 className="size-4" strokeWidth={1.75} />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const empty = !activeId && messages.length === 0;
  return (
    <div className="flex h-[calc(100dvh-57px)]">
      <aside className="hidden w-[288px] shrink-0 overflow-y-auto border-r border-line bg-surface-2 p-3 md:block">
        {sidebarBody}
      </aside>
      <Sheet open={sidebar} onClose={() => setSidebar(false)} side="left" title={t('Chats', 'চ্যাট')}>
        {sidebarBody}
      </Sheet>

      <section className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-12 items-center gap-1 border-b border-line px-2 md:hidden">
          <button
            onClick={() => setSidebar(true)}
            aria-label={t('Show chats', 'চ্যাট দেখুন')}
            className="flex size-11 items-center justify-center rounded-full hover:bg-fg/5"
          >
            <PanelLeft className="size-5" strokeWidth={1.75} />
          </button>
          <p className="flex-1 truncate text-center text-[15px] font-medium">
            {active?.title || t('New chat', 'নতুন চ্যাট')}
          </p>
          <button
            onClick={newChat}
            aria-label={t('New chat', 'নতুন চ্যাট')}
            className="flex size-11 items-center justify-center rounded-full hover:bg-fg/5"
          >
            <Plus className="size-5" strokeWidth={1.75} />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto" aria-live="polite">
          <div className="mx-auto w-full max-w-[760px] px-4 py-8 sm:px-6">
            {empty ? (
              <div className="flex min-h-[55dvh] flex-col items-center justify-center">
                <EmptyState
                  icon={<MessageSquare className="size-6" strokeWidth={1.5} />}
                  title={t('What would you like to know?', 'আপনি কী জানতে চান?')}
                  body={t(
                    'Ask about any Bangladeshi law. Answers show the exact sections they come from.',
                    'বাংলাদেশের যেকোনো আইন সম্পর্কে জিজ্ঞাসা করুন। উত্তরে সুনির্দিষ্ট ধারা দেখানো হয়।',
                  )}
                />
                <div className="grid w-full gap-2 sm:grid-cols-2">
                  {EXAMPLE_QUESTIONS.map((e) => (
                    <button
                      key={e.en}
                      onClick={() => send(tr(e))}
                      className="min-h-14 rounded-2xl border border-line bg-surface px-4 py-3 text-left text-[14px] transition-colors hover:border-fg/20"
                    >
                      {tr(e)}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {loadingChat && (
                  <div className="flex flex-col gap-3" aria-busy="true">
                    <Skeleton className="ml-auto h-10 w-2/3 rounded-[20px]" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                )}
                {messages.map((m) =>
                  m.role === 'user' ? (
                    <UserBubble key={m.id} text={m.content} />
                  ) : (
                    <AiBubble key={m.id} message={m} onSource={setSource} />
                  ),
                )}
                {thinking && <Thinking />}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-line bg-bg/80 px-4 pt-3 pb-4 backdrop-blur sm:px-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="mx-auto flex max-w-[760px] items-end gap-2 rounded-[24px] border border-line bg-surface p-1.5 pl-4 shadow-soft focus-within:border-[var(--focus)] focus-within:ring-4 focus-within:ring-accent/15"
          >
            <label htmlFor="composer" className="sr-only">
              {t('Message', 'বার্তা')}
            </label>
            <textarea
              id="composer"
              ref={taRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder={t('Ask a legal question…', 'আইনি প্রশ্ন লিখুন…')}
              className="max-h-[200px] min-h-11 flex-1 resize-none bg-transparent py-2.5 text-[15px] outline-none placeholder:text-muted/80"
            />
            <Button
              type="submit"
              pill
              iconOnly
              disabled={!input.trim()}
              loading={thinking}
              aria-label={t('Send', 'পাঠান')}
            >
              <ArrowUp className="size-5" strokeWidth={2.25} />
            </Button>
          </form>
          <Disclaimer className="mx-auto mt-2 max-w-[760px] justify-center" />
        </div>
      </section>
      <SourceSheet source={source} onClose={() => setSource(null)} />
    </div>
  );
}

function UserBubble({ text }) {
  return (
    <div className="anim-fade-up flex justify-end">
      <p className="max-w-[85%] rounded-[20px] rounded-br-md bg-bubble px-4 py-2.5 text-[15px] whitespace-pre-wrap">
        {text}
      </p>
    </div>
  );
}

function AiBubble({ message, onSource }) {
  const { t, toast } = useApp();
  const [copied, setCopied] = useState(false);
  const action =
    'flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-fg/[0.06] hover:text-fg';
  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: message.content });
      } catch {
        // Closing the share sheet is not an error.
      }
      return;
    }
    navigator.clipboard?.writeText(message.content);
    toast(t('Answer copied to share', 'শেয়ারের জন্য উত্তর কপি হয়েছে'));
  };
  return (
    <div className="anim-fade-up flex gap-3">
      <span className="mt-0.5 shrink-0 text-accent-text [--logo-ink:var(--surface)]">
        <LogoMark className="size-7" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-3 text-[15px] leading-[1.7] break-words">
          <ReactMarkdown components={markdown}>{message.content}</ReactMarkdown>
        </div>
        {message.sources?.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-[12px] font-semibold text-muted">{t('Sources', 'উৎস')}</p>
            <SourceChips sources={message.sources} onOpen={onSource} />
          </div>
        )}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="-ml-2 flex">
            <button
              className={action}
              aria-label={t('Copy', 'কপি')}
              onClick={() => {
                navigator.clipboard?.writeText(message.content);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
            >
              {copied ? (
                <Check className="size-4 text-accent-text" />
              ) : (
                <Copy className="size-4" strokeWidth={1.75} />
              )}
            </button>
            <button className={action} aria-label={t('Share', 'শেয়ার')} onClick={share}>
              <Share className="size-4" strokeWidth={1.75} />
            </button>
          </div>
          <Disclaimer />
        </div>
      </div>
    </div>
  );
}

function Thinking() {
  const { t } = useApp();
  return (
    <div className="anim-fade flex items-center gap-3" role="status">
      <span className="shrink-0 text-accent-text [--logo-ink:var(--surface)]">
        <LogoMark className="size-7" />
      </span>
      <span className="flex items-center gap-2 text-[14px] text-muted">
        {t('Searching Bangladesh law', 'বাংলাদেশের আইন খোঁজা হচ্ছে')}
        <span className="flex gap-1" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="thinking-dot size-1.5 rounded-full bg-muted"
              style={{ animationDelay: `${i * 0.16}s` }}
            />
          ))}
        </span>
      </span>
    </div>
  );
}
