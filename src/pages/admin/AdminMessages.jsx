import { useMemo, useState } from "react";
import {
  Loader2,
  AlertCircle,
  Trash2,
  Mail,
  MailOpen,
  Star,
} from "lucide-react";
import { useCollection } from "../../hooks/useCollection";

const TABS = [
  { value: "all", label: "Semua" },
  { value: "kontak", label: "Kontak" },
  { value: "kesan", label: "Kesan & pesan" },
];

function fmt(iso) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

/**
 * Kotak pesan masuk. Pesan 'kontak' hanya dibaca admin. Pesan 'kesan'
 * baru tampil di situs setelah disetujui di sini.
 */
export default function AdminMessages() {
  const { rows, loading, error, update, remove } = useCollection("messages", {
    orderBy: "created_at",
  });
  const [tab, setTab] = useState("all");
  const [busy, setBusy] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [actionError, setActionError] = useState(null);

  // Terbaru di atas.
  const list = useMemo(
    () => [...rows].reverse().filter((r) => tab === "all" || r.kind === tab),
    [rows, tab]
  );
  const unread = rows.filter((r) => !r.is_read).length;

  async function run(id, fn) {
    setBusy(id);
    setActionError(null);
    try {
      await fn();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="flex flex-col gap-8">
      <div>
        <h2 className="font-display text-xl font-medium tracking-tight">
          Pesan masuk{" "}
          {unread > 0 && (
            <span className="ml-2 rounded-full bg-[var(--accent-1)] px-2.5 py-0.5 align-middle font-mono text-xs text-[var(--bg)]">
              {unread} baru
            </span>
          )}
        </h2>
        <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-[var(--text-muted)]">
          Pesan dari form di Temui Saya (hanya kamu yang bisa baca) dan halaman Kesan & Pesan.
          Kesan langsung tampil di situs untuk semua pengunjung, jadi hapus yang tidak pantas
          lewat tombol "Hapus".
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((x) => (
          <button
            key={x.value}
            type="button"
            onClick={() => setTab(x.value)}
            aria-pressed={tab === x.value}
            className={`focus-ring rounded-full border px-4 py-1.5 text-xs transition-colors ${
              tab === x.value
                ? "border-[var(--accent-1)] text-[var(--text)]"
                : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-strong)]"
            }`}
          >
            {x.label}
          </button>
        ))}
      </div>

      {(error || actionError) && (
        <p className="flex items-start gap-2 rounded-lg border border-[#f87171]/40 px-4 py-3 text-sm text-[#f87171]">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          {error || actionError}
        </p>
      )}

      {loading ? (
        <p className="flex items-center gap-2 text-sm text-[var(--text-faint)]">
          <Loader2 size={14} className="animate-spin" /> Memuat…
        </p>
      ) : list.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">Belum ada pesan.</p>
      ) : (
        <ul className="flex list-none flex-col gap-3 p-0">
          {list.map((m) => (
            <li
              key={m.id}
              className={`rounded-xl border p-5 ${
                m.is_read ? "border-[var(--border)]" : "border-[var(--accent-1)]"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    {m.name}
                    <span className="ml-2 rounded-full border border-[var(--border)] px-2 py-0.5 font-mono text-[10px] uppercase text-[var(--text-faint)]">
                      {m.kind}
                    </span>
                    {m.kind === "kesan" && (
                      <span className="ml-2 font-mono text-[10px] uppercase text-[var(--accent-1)]">
                        tampil di situs
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-[var(--text-faint)]">
                    {[m.relation, m.email, fmt(m.created_at)].filter(Boolean).join(" · ")}
                  </p>
                </div>
                {m.rating && (
                  <span className="inline-flex items-center gap-1 text-xs text-[var(--accent-1)]">
                    <Star size={13} fill="currentColor" /> {m.rating}/5
                  </span>
                )}
              </div>

              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[var(--text-muted)]">
                {m.message}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-4">
                <button
                  type="button"
                  disabled={busy === m.id}
                  onClick={() => run(m.id, () => update(m.id, { is_read: !m.is_read }))}
                  className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3.5 py-1.5 text-xs transition-colors hover:border-[var(--border-strong)] disabled:opacity-50"
                >
                  {m.is_read ? <Mail size={13} /> : <MailOpen size={13} />}
                  {m.is_read ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
                </button>

                {m.email && (
                  <a
                    href={`mailto:${m.email}`}
                    className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3.5 py-1.5 text-xs transition-colors hover:border-[var(--border-strong)]"
                  >
                    <Mail size={13} /> Balas
                  </a>
                )}

                <span className="flex-1" />

                {confirmId === m.id ? (
                  <span className="inline-flex items-center gap-2 text-xs">
                    Hapus permanen?
                    <button
                      type="button"
                      disabled={busy === m.id}
                      onClick={() =>
                        run(m.id, async () => {
                          await remove(m.id);
                          setConfirmId(null);
                        })
                      }
                      className="focus-ring rounded-full bg-[#f87171] px-3 py-1 text-[var(--bg)]"
                    >
                      Ya
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmId(null)}
                      className="focus-ring rounded-full border border-[var(--border)] px-3 py-1"
                    >
                      Batal
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmId(m.id)}
                    className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3.5 py-1.5 text-xs text-[var(--text-faint)] transition-colors hover:border-[#f87171] hover:text-[#f87171]"
                  >
                    <Trash2 size={13} /> Hapus
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
