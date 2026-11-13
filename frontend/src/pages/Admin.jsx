import { AlertCircle, CheckCircle2, FileSpreadsheet, FileText, Mail, RefreshCw, Reply, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { admin } from '@/api/client';
import { useApp } from '@/lib/app';
import { Avatar, Page } from '@/components/Layout';
import { Badge, Button, Card, Dropzone, EmptyState, ErrorState, PageHeader, Skeleton, Spinner, cx } from '@/components/ui';

function FileIcon({ name }) {
  const Icon = name.toLowerCase().endsWith('.csv') ? FileSpreadsheet : FileText;
  return <Icon className="size-5 shrink-0 text-muted" strokeWidth={1.75} />;
}

export default function Admin() {
  const { t, num, date, toast, confirm, tError, user } = useApp();
  const [error, setError] = useState('');
  const [users, setUsers] = useState(null);
  const [files, setFiles] = useState([]);
  const [msgs, setMsgs] = useState(null);
  const [openMsg, setOpenMsg] = useState(null);
  const [sync, setSync] = useState(null);
  const [uploading, setUploading] = useState([]);

  const loadUsers = useCallback(async () => {
    const data = await admin.users();
    setUsers(data.users);
    setFiles(data.data_files);
  }, []);

  const loadAll = useCallback(async () => {
    setError('');
    try {
      const [, inbox, status] = await Promise.all([loadUsers(), admin.messages(), admin.lawSyncStatus()]);
      setMsgs(inbox.messages);
      setSync(status);
    } catch (err) {
      setError(tError(err.message));
    }
  }, [loadUsers, tError]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // While a law check runs, ask the server for its status every few seconds.
  const running = !!sync?.running;
  useEffect(() => {
    if (!running) return;
    const id = setInterval(async () => {
      try {
        const status = await admin.lawSyncStatus();
        setSync(status);
        if (!status.running) {
          const run = status.run || {};
          if (run.status === 'failed') toast(t('The law check failed.', 'আইন যাচাই ব্যর্থ হয়েছে।'), 'error');
          else
            toast(
              t(
                `Check complete · ${run.updates_found || 0} changes found`,
                `যাচাই সম্পন্ন · ${num(run.updates_found || 0)}টি পরিবর্তন পাওয়া গেছে`,
              ),
            );
        }
      } catch {
        // Keep polling; a single failed request is not worth showing.
      }
    }, 3000);
    return () => clearInterval(id);
  }, [running, t, num, toast]);

  const startSync = async () => {
    try {
      await admin.startLawSync();
      setSync((s) => ({ ...s, running: true }));
    } catch (err) {
      toast(tError(err.message), 'error');
    }
  };

  const upload = async (picked) => {
    for (const file of picked) {
      setUploading((list) => [...list, file.name]);
      try {
        await admin.upload(file);
        toast(t(`${file.name} added to the library`, `${file.name} লাইব্রেরিতে যোগ হয়েছে`));
        await loadUsers();
      } catch (err) {
        toast(`${file.name}: ${tError(err.message)}`, 'error');
      } finally {
        setUploading((list) => list.filter((name) => name !== file.name));
      }
    }
  };

  const toggleAdmin = async (u) => {
    const ok = await confirm({
      title: u.is_admin
        ? t(`Remove admin from ${u.username}?`, `${u.username}-এর অ্যাডমিন সরাবেন?`)
        : t(`Make ${u.username} an admin?`, `${u.username}-কে অ্যাডমিন করবেন?`),
      body: u.is_admin
        ? t('They will lose access to this page.', 'তিনি এই পেজে প্রবেশাধিকার হারাবেন।')
        : t(
            'They will be able to manage laws, users and messages.',
            'তিনি আইন, ব্যবহারকারী ও বার্তা পরিচালনা করতে পারবেন।',
          ),
      confirmLabel: u.is_admin ? t('Remove admin', 'অ্যাডমিন সরান') : t('Make admin', 'অ্যাডমিন করুন'),
      destructive: !!u.is_admin,
    });
    if (!ok) return;
    try {
      await admin.setAdmin(u.id, !u.is_admin);
      setUsers((list) => list.map((x) => (x.id === u.id ? { ...x, is_admin: !u.is_admin } : x)));
      toast(u.is_admin ? t('Admin removed', 'অ্যাডমিন সরানো হয়েছে') : t('Admin added', 'অ্যাডমিন যোগ হয়েছে'));
    } catch (err) {
      toast(tError(err.message), 'error');
    }
  };

  const deleteMessage = async (m) => {
    const ok = await confirm({
      title: t('Delete this message?', 'এই বার্তা মুছবেন?'),
      body: t('This can’t be undone.', 'এটি আর ফেরানো যাবে না।'),
      confirmLabel: t('Delete', 'মুছুন'),
      destructive: true,
    });
    if (!ok) return;
    try {
      await admin.deleteMessage(m.id);
      setMsgs((list) => list.filter((x) => x.id !== m.id));
      toast(t('Message deleted', 'বার্তা মুছে ফেলা হয়েছে'));
    } catch (err) {
      toast(tError(err.message), 'error');
    }
  };

  const run = sync?.run;
  const failed = !running && run?.status === 'failed';

  return (
    <Page>
      <PageHeader eyebrow={t('Admin', 'অ্যাডমিন')} title={t('Manage Bidhanshala', 'বিধানশালা পরিচালনা')} />
      {error && (
        <div className="mt-8">
          <ErrorState title={t('Admin data could not load', 'অ্যাডমিন তথ্য লোড হয়নি')} body={error} onRetry={loadAll} />
        </div>
      )}
      <div className="mt-8 grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        {/* Law sync */}
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[17px] font-semibold">{t('Law sync', 'আইন সিঙ্ক')}</h2>
              <p className="text-[13px] text-muted">bdlaws.minlaw.gov.bd</p>
            </div>
            {sync && (
              <Badge
                tone={running ? 'cyan' : failed ? 'high' : 'low'}
                icon={
                  running ? (
                    <Spinner className="size-3" />
                  ) : failed ? (
                    <AlertCircle className="size-3.5" />
                  ) : (
                    <CheckCircle2 className="size-3.5" />
                  )
                }
              >
                {running ? t('Running', 'চলছে') : failed ? t('Failed', 'ব্যর্থ') : t('Healthy', 'সচল')}
              </Badge>
            )}
          </div>
          <dl className="mt-6 grid grid-cols-3 gap-4">
            {[
              [t('Tracked acts', 'পর্যবেক্ষিত আইন'), sync ? num(sync.tracked) : '–'],
              [
                t('Last run', 'সর্বশেষ'),
                run?.finished_at ? date(run.finished_at, { day: 'numeric', month: 'short' }) : '–',
              ],
              [t('Changes found', 'পরিবর্তন'), run ? num(run.updates_found || 0) : '–'],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[12px] text-muted">{k}</dt>
                <dd className="mt-0.5 text-[20px] font-semibold tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
          {running && (
            <p className="anim-fade mt-5 text-[13px] text-muted">
              {t(
                'Checking the official site. This can take a while; you can leave this page.',
                'সরকারি ওয়েবসাইট যাচাই হচ্ছে। কিছুটা সময় লাগতে পারে; আপনি এই পেজ ছেড়ে যেতে পারেন।',
              )}
            </p>
          )}
          {failed && run.error && <p className="mt-5 text-[13px] text-high">{run.error}</p>}
          <Button
            className="mt-6 w-full"
            variant="secondary"
            loading={running}
            disabled={!sync}
            icon={<RefreshCw className="size-4" />}
            onClick={startSync}
          >
            {running ? t('Checking…', 'যাচাই হচ্ছে…') : t('Check now', 'এখনই যাচাই করুন')}
          </Button>
        </Card>

        {/* Upload */}
        <Card className="p-6">
          <h2 className="text-[17px] font-semibold">{t('Law library', 'আইন লাইব্রেরি')}</h2>
          <p className="mb-4 text-[13px] text-muted">
            {t(
              'Add an act as PDF, or a list of acts as CSV. It is indexed for answers right away.',
              'পিডিএফ হিসেবে আইন, অথবা সিএসভি হিসেবে আইনের তালিকা যোগ করুন। সঙ্গে সঙ্গে উত্তরের জন্য সূচিভুক্ত হবে।',
            )}
          </p>
          <Dropzone
            compact
            multiple
            accept=".pdf,.csv"
            title={t('Drop PDF or CSV files', 'পিডিএফ বা সিএসভি ফাইল দিন')}
            hint={t('Up to 16 MB each', 'প্রতিটি সর্বোচ্চ ১৬ এমবি')}
            onFiles={upload}
          />
          <ul className="mt-4 flex max-h-72 flex-col gap-2 overflow-y-auto">
            {uploading.map((name) => (
              <li key={`up-${name}`} className="flex items-center gap-3 rounded-xl border border-line px-3 py-2.5">
                <FileIcon name={name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium">{name}</p>
                  <p className="text-[12px] text-muted">{t('Indexing…', 'সূচিভুক্ত হচ্ছে…')}</p>
                </div>
                <Spinner />
              </li>
            ))}
            {files.map((name) => (
              <li key={name} className="flex items-center gap-3 rounded-xl border border-line px-3 py-2.5">
                <FileIcon name={name} />
                <p className="min-w-0 flex-1 truncate text-[14px] font-medium">{name}</p>
                <span className="text-[12px] text-muted">{t('Indexed', 'সূচিভুক্ত')}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Users */}
        <Card className="p-2">
          <h2 className="px-4 pt-4 pb-2 text-[17px] font-semibold">
            {t('Users', 'ব্যবহারকারী')} <span className="font-normal text-muted">{users && num(users.length)}</span>
          </h2>
          {!users ? (
            <div className="flex flex-col gap-3 p-4">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <ul className="max-h-[420px] overflow-y-auto">
              {users.map((u) => (
                <li key={u.id} className="flex min-h-[64px] items-center gap-3 px-4 py-2">
                  <Avatar name={u.username} size="size-10" />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 truncate text-[15px] font-medium">
                      {u.username} {!!u.is_admin && <Badge tone="admin">{t('Admin', 'অ্যাডমিন')}</Badge>}
                    </p>
                    <p className="text-[13px] text-muted">
                      {t('Joined', 'যোগদান')} {date(u.created_at)}
                    </p>
                  </div>
                  {u.id === user?.id ? (
                    <span className="text-[13px] text-muted">{t('You', 'আপনি')}</span>
                  ) : (
                    <Button
                      size="sm"
                      variant={u.is_admin ? 'tertiary' : 'secondary'}
                      className={cx(u.is_admin && 'text-high')}
                      onClick={() => toggleAdmin(u)}
                    >
                      {u.is_admin ? t('Remove admin', 'অ্যাডমিন সরান') : t('Make admin', 'অ্যাডমিন করুন')}
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Messages */}
        <Card className="p-2">
          <h2 className="px-4 pt-4 pb-2 text-[17px] font-semibold">
            {t('Contact messages', 'যোগাযোগ বার্তা')}{' '}
            <span className="font-normal text-muted">{msgs && num(msgs.length)}</span>
          </h2>
          {!msgs ? (
            <div className="flex flex-col gap-3 p-4">
              {[0, 1].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : msgs.length === 0 ? (
            <EmptyState
              icon={<Mail className="size-6" strokeWidth={1.5} />}
              title={t('Inbox zero', 'ইনবক্স খালি')}
              body={t(
                'New messages from the contact form will appear here.',
                'যোগাযোগ ফর্মের নতুন বার্তা এখানে দেখা যাবে।',
              )}
            />
          ) : (
            <ul className="max-h-[520px] overflow-y-auto">
              {msgs.map((m) => {
                const open = openMsg === m.id;
                const subject = m.subject || t('(no subject)', '(বিষয় নেই)');
                return (
                  <li key={m.id} className="rounded-xl">
                    <button
                      aria-expanded={open}
                      onClick={() => setOpenMsg(open ? null : m.id)}
                      className="flex min-h-[64px] w-full items-start gap-3 rounded-xl px-4 py-3 text-left hover:bg-fg/[0.03]"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-medium">{subject}</p>
                        <p className="truncate text-[13px] text-muted">
                          {m.name} · {m.email}
                        </p>
                      </div>
                      <time className="shrink-0 text-[12px] text-muted">
                        {date(m.created_at, { day: 'numeric', month: 'short' })}
                      </time>
                    </button>
                    {open && (
                      <div className="anim-fade px-4 pb-4">
                        <p className="rounded-xl bg-surface-2 p-4 text-[14px] leading-relaxed whitespace-pre-wrap">
                          {m.message}
                        </p>
                        <div className="mt-3 flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="tertiary"
                            className="text-high"
                            icon={<Trash2 className="size-4" />}
                            onClick={() => deleteMessage(m)}
                          >
                            {t('Delete', 'মুছুন')}
                          </Button>
                          <a
                            href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || 'Bidhanshala'}`)}`}
                            className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-accent px-3.5 text-[13px] font-medium text-accent-ink hover:bg-accent-hover"
                          >
                            <Reply className="size-4" /> {t('Reply', 'উত্তর দিন')}
                          </a>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </Page>
  );
}
