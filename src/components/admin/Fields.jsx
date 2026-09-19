import { useRef, useState } from "react";
import { Plus, Trash2, Upload, X, GripVertical } from "lucide-react";
import { supabase } from "../../lib/supabase";

/* ------------------------------------------------------------------ */
/* Input dasar                                                         */
/* ------------------------------------------------------------------ */

const inputBase =
  "focus-ring w-full rounded-lg border border-[var(--border)] bg-transparent px-3.5 py-2.5 text-sm text-[var(--text)] transition-colors placeholder:text-[var(--text-faint)] hover:border-[var(--border-strong)] focus:border-[var(--accent-1)]";

export function Field({ label, hint, children, htmlFor }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-xs font-medium text-[var(--text-muted)]">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-[var(--text-faint)]">{hint}</p>}
    </div>
  );
}

export function TextInput({ label, hint, value, onChange, ...props }) {
  const id = `f-${label?.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <input
        id={id}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className={inputBase}
        {...props}
      />
    </Field>
  );
}

export function TextArea({ label, hint, value, onChange, rows = 4, ...props }) {
  const id = `f-${label?.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <textarea
        id={id}
        rows={rows}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputBase} resize-y leading-relaxed`}
        {...props}
      />
    </Field>
  );
}

export function SelectInput({ label, hint, value, onChange, options }) {
  const id = `f-${label?.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <select
        id={id}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className={inputBase}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[var(--bg-elevated)]">
            {opt.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function Toggle({ label, hint, value, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-[var(--border)] p-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {hint && <p className="mt-1 text-xs text-[var(--text-faint)]">{hint}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={Boolean(value)}
        aria-label={label}
        onClick={() => onChange(!value)}
        className="focus-ring relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300"
        style={{ background: value ? "var(--accent-1)" : "var(--surface-2)" }}
      >
        <span
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-300"
          style={{ transform: value ? "translateX(22px)" : "translateX(2px)" }}
        />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Daftar teks sederhana (stack, includes, dsb.)                       */
/* ------------------------------------------------------------------ */

export function StringListInput({ label, hint, value = [], onChange, placeholder }) {
  const [draft, setDraft] = useState("");

  function add() {
    const trimmed = draft.trim();
    if (!trimmed || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
    setDraft("");
  }

  return (
    <Field label={label} hint={hint}>
      <div className="flex gap-2">
        <input
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          // Enter di sini menambah item, bukan mengirim seluruh formulir.
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          className={inputBase}
        />
        <button
          type="button"
          onClick={add}
          className="focus-ring flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg border border-[var(--border)] transition-colors hover:border-[var(--accent-1)] hover:text-[var(--accent-1)]"
          aria-label={`Tambah ${label}`}
        >
          <Plus size={16} />
        </button>
      </div>

      {value.length > 0 && (
        <ul className="mt-1 flex flex-wrap gap-2">
          {value.map((item, i) => (
            <li
              key={`${item}-${i}`}
              className="flex items-center gap-2 rounded-full border border-[var(--border)] py-1 pl-3 pr-1.5 font-mono text-xs"
            >
              {item}
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                aria-label={`Hapus ${item}`}
                className="focus-ring rounded-full p-1 text-[var(--text-faint)] transition-colors hover:text-[#f87171]"
              >
                <X size={12} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Field>
  );
}

/* ------------------------------------------------------------------ */
/* Daftar objek {title, body} — dipakai buat fitur                     */
/* ------------------------------------------------------------------ */

export function RepeaterInput({ label, hint, value = [], onChange }) {
  function update(i, patch) {
    onChange(value.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  }

  function move(i, delta) {
    const target = i + delta;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[i], next[target]] = [next[target], next[i]];
    onChange(next);
  }

  return (
    <Field label={label} hint={hint}>
      <div className="flex flex-col gap-3">
        {value.map((item, i) => (
          <div key={i} className="flex flex-col gap-3 rounded-lg border border-[var(--border)] p-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-mono text-xs text-[var(--text-faint)]">
                <GripVertical size={13} />
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="focus-ring rounded px-2 py-1 text-xs text-[var(--text-faint)] transition-colors hover:text-[var(--text)] disabled:opacity-30"
                >
                  Naik
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === value.length - 1}
                  className="focus-ring rounded px-2 py-1 text-xs text-[var(--text-faint)] transition-colors hover:text-[var(--text)] disabled:opacity-30"
                >
                  Turun
                </button>
                <button
                  type="button"
                  onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                  aria-label="Hapus item"
                  className="focus-ring rounded p-1.5 text-[var(--text-faint)] transition-colors hover:text-[#f87171]"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <input
              value={item.title ?? ""}
              placeholder="Judul"
              onChange={(e) => update(i, { title: e.target.value })}
              className={inputBase}
            />
            <textarea
              rows={3}
              value={item.body ?? ""}
              placeholder="Penjelasan"
              onChange={(e) => update(i, { body: e.target.value })}
              className={`${inputBase} resize-y leading-relaxed`}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={() => onChange([...value, { title: "", body: "" }])}
          className="focus-ring flex items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--border-strong)] py-3 text-sm text-[var(--text-muted)] transition-colors hover:border-[var(--accent-1)] hover:text-[var(--accent-1)]"
        >
          <Plus size={15} /> Tambah item
        </button>
      </div>
    </Field>
  );
}

/* ------------------------------------------------------------------ */
/* Unggah gambar ke Supabase Storage                                   */
/* ------------------------------------------------------------------ */

async function uploadOne(file) {
  // Nama file dibuat unik supaya dua unggahan bernama "screenshot.png"
  // tidak saling menimpa.
  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from("media").upload(name, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;

  return supabase.storage.from("media").getPublicUrl(name).data.publicUrl;
}

export function ImageInput({ label, hint, value, onChange, multiple = false }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const images = multiple ? value || [] : value ? [value] : [];

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setBusy(true);
    setError(null);
    try {
      const urls = [];
      for (const file of files) urls.push(await uploadOne(file));
      onChange(multiple ? [...(value || []), ...urls] : urls[0]);
    } catch (err) {
      setError(err.message || "Gagal mengunggah. Coba lagi.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(i) {
    if (multiple) onChange((value || []).filter((_, idx) => idx !== i));
    else onChange("");
  }

  return (
    <Field label={label} hint={hint}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFiles}
        className="hidden"
      />

      <div className="flex flex-wrap gap-3">
        {images.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="group relative h-20 w-28 overflow-hidden rounded-lg border border-[var(--border)]"
          >
            <img src={src} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Hapus gambar"
              className="focus-ring absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="focus-ring flex h-20 w-28 flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-[var(--border-strong)] text-xs text-[var(--text-muted)] transition-colors hover:border-[var(--accent-1)] hover:text-[var(--accent-1)] disabled:opacity-50"
        >
          <Upload size={16} />
          {busy ? "Mengunggah…" : "Unggah"}
        </button>
      </div>

      {error && <p className="text-xs text-[#f87171]">{error}</p>}
    </Field>
  );
}

export { inputBase };
