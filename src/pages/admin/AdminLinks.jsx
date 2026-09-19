import CollectionManager from "../../components/admin/CollectionManager";
import { TextInput, SelectInput, Toggle } from "../../components/admin/Fields";
import IconPicker from "../../components/admin/IconPicker";

const empty = {
  group: "social",
  label: "",
  handle: "",
  note: "",
  url: "",
  icon_name: "",
  icon_path: "",
  icon_hex: "",
  icon_dark: "",
  published: true,
};

export default function AdminLinks() {
  return (
    <CollectionManager
      table="links"
      title="Link & akun"
      description="Kartu-kartu di halaman Find Me. Bisa menambah brand apa pun, termasuk yang belum pernah ada di kode — ikonnya disimpan bersama datanya."
      addLabel="Tambah link"
      emptyRecord={empty}
      renderRow={(row) => (
        <div className="flex items-center gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)]"
            style={{ color: row.icon_hex || "var(--text-faint)" }}
          >
            {row.icon_path ? (
              <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d={row.icon_path} />
              </svg>
            ) : (
              <span className="font-mono text-[10px]">{row.label.slice(0, 2).toUpperCase()}</span>
            )}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{row.label}</p>
            <p className="truncate font-mono text-xs text-[var(--text-faint)]">
              {row.group} · {row.url}
            </p>
          </div>
        </div>
      )}
      renderForm={(draft, set) => (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextInput
              label="Nama"
              hint="Yang tampil di kartu. Contoh: Fiverr, Tokopedia, Threads."
              value={draft.label}
              onChange={(v) => set({ label: v })}
            />
            <SelectInput
              label="Kelompok"
              hint="Menentukan kartu ini masuk bagian mana di halaman Find Me."
              value={draft.group}
              onChange={(v) => set({ group: v })}
              options={[
                { value: "hire", label: "Hire me here — platform kerja" },
                { value: "social", label: "Follow along — media sosial" },
              ]}
            />
          </div>

          <TextInput
            label="URL"
            hint="Harus lengkap dengan https:// — atau mailto: untuk alamat email."
            placeholder="https://"
            value={draft.url}
            onChange={(v) => set({ url: v })}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextInput
              label="Handle"
              hint="Contoh: @raihan. Kalau diisi, ini yang tampil di bawah nama."
              value={draft.handle}
              onChange={(v) => set({ handle: v })}
            />
            <TextInput
              label="Keterangan"
              hint="Dipakai kalau handle dikosongkan. Contoh: 'Paket harga tetap'."
              value={draft.note}
              onChange={(v) => set({ note: v })}
            />
          </div>

          <IconPicker
            value={draft}
            onChange={(patch) => set(patch)}
          />

          <TextInput
            label="Warna pengganti untuk mode gelap"
            hint="Isi hanya kalau warna brand-nya nyaris hitam (GitHub, X, TikTok) sehingga hilang di latar gelap. Contoh: #E6E6E6"
            placeholder="#E6E6E6"
            value={draft.icon_dark}
            onChange={(v) => set({ icon_dark: v })}
          />

          <Toggle
            label="Tampilkan di situs"
            value={draft.published}
            onChange={(v) => set({ published: v })}
          />
        </div>
      )}
    />
  );
}
