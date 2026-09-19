import { useEffect, useState } from "react";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { useCollection } from "../../hooks/useCollection";
import { TextInput } from "../../components/admin/Fields";
import { site } from "../../data/site";

// Pengaturan disimpan sebagai pasangan key-value supaya menambah satu
// kolom baru nanti tidak perlu mengubah struktur tabel.
const fields = [
  {
    key: "email",
    label: "Email",
    hint: "Dipakai tombol salin email, formulir kontak, dan kartu akun.",
    fallback: site.email,
  },
  {
    key: "whatsapp",
    label: "Nomor WhatsApp",
    hint: "Format internasional tanpa tanda plus. Contoh: 6281234567890. Kosongkan untuk memakai email sebagai gantinya.",
    fallback: site.whatsapp,
  },
  {
    key: "formEndpoint",
    label: "Endpoint Formspree",
    hint: "Contoh: https://formspree.io/f/xxxxxxxx. Kosongkan untuk memakai mode mailto.",
    fallback: site.formEndpoint,
  },
  { key: "location", label: "Lokasi", hint: "Tampil di footer.", fallback: site.location },
  { key: "url", label: "Alamat situs", hint: "Dipakai di sitemap dan tag berbagi.", fallback: site.url },
  {
    key: "githubUsername",
    label: "Username GitHub",
    hint: "Dipakai section GitHub Activity di halaman About Me. Kosongkan untuk memakai username dari link GitHub di halaman Find Me.",
    fallback: site.githubUsername,
  },
];

export default function AdminSettings() {
  const { rows, loading, upsert } = useCollection("settings", { orderBy: "key" });
  const [values, setValues] = useState({});
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  useEffect(() => {
    const map = {};
    for (const row of rows) map[row.key] = row.value;
    setValues(map);
  }, [rows]);

  async function save() {
    setStatus("saving");
    setError(null);
    try {
      const payload = fields.map((f) => ({
        key: f.key,
        value: values[f.key] ?? "",
        updated_at: new Date().toISOString(),
      }));
      await upsert(payload, "key");
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 1800);
    } catch (err) {
      setError(err.message);
      setStatus("idle");
    }
  }

  return (
    <section className="flex flex-col gap-8">
      <div>
        <h2 className="font-display text-xl font-medium tracking-tight">Pengaturan</h2>
        <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-[var(--text-muted)]">
          Kolom yang dikosongkan memakai nilai bawaan dari{" "}
          <code className="font-mono text-xs">src/data/site.js</code>, yang tampil abu-abu
          sebagai contoh.
        </p>
      </div>

      {loading ? (
        <p className="font-mono text-xs text-[var(--text-faint)]">Memuat…</p>
      ) : (
        <div className="flex flex-col gap-5">
          {fields.map((field) => (
            <TextInput
              key={field.key}
              label={field.label}
              hint={field.hint}
              placeholder={field.fallback}
              value={values[field.key] ?? ""}
              onChange={(v) => setValues((prev) => ({ ...prev, [field.key]: v }))}
            />
          ))}

          {error && (
            <p className="flex items-start gap-2 rounded-lg border border-[#f87171]/40 px-4 py-3 text-sm text-[#f87171]">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              {error}
            </p>
          )}

          <div>
            <button
              type="button"
              onClick={save}
              disabled={status === "saving"}
              className="focus-ring inline-flex items-center gap-2 rounded-full bg-[var(--text)] px-6 py-2.5 text-sm font-medium text-[var(--bg)] transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {status === "saving" && <Loader2 size={14} className="animate-spin" />}
              {status === "saved" && <Check size={14} />}
              {status === "saved" ? "Tersimpan" : "Simpan pengaturan"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
