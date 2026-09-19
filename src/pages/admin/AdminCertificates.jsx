import CollectionManager from "../../components/admin/CollectionManager";
import {
  TextInput,
  ImageInput,
  StringListInput,
  Toggle,
} from "../../components/admin/Fields";

const empty = {
  title: "",
  issuer: "",
  date: new Date().getFullYear().toString(),
  credential_id: "",
  credential_url: "",
  image: "",
  skills: [],
  published: true,
};

export default function AdminCertificates() {
  return (
    <CollectionManager
      table="certificates"
      title="Sertifikat"
      description="Muncul di halaman About Me, di atas section 'Life outside the editor'. Kalau punya gambar lencana atau sertifikat, unggah — kalau tidak, ikon penerbitnya yang dipakai sebagai gantinya."
      addLabel="Tambah sertifikat"
      emptyRecord={empty}
      renderRow={(row) => (
        <div className="flex items-center gap-3">
          {row.image ? (
            <img src={row.image} alt="" className="h-10 w-14 shrink-0 rounded object-cover" />
          ) : (
            <span className="flex h-10 w-14 shrink-0 items-center justify-center rounded bg-[var(--surface-2)] font-mono text-[10px] text-[var(--text-faint)]">
              {row.issuer?.slice(0, 2).toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{row.title}</p>
            <p className="truncate font-mono text-xs text-[var(--text-faint)]">
              {row.issuer} · {row.date}
            </p>
          </div>
        </div>
      )}
      renderForm={(draft, set) => (
        <div className="flex flex-col gap-5">
          <TextInput
            label="Judul sertifikat"
            placeholder="React — Advanced Concepts"
            value={draft.title}
            onChange={(v) => set({ title: v })}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextInput
              label="Penerbit"
              hint="Kalau namanya cocok dengan brand terkenal (Meta, Google, AWS), ikonnya otomatis kepakai."
              placeholder="Meta (Coursera)"
              value={draft.issuer}
              onChange={(v) => set({ issuer: v })}
            />
            <TextInput
              label="Tahun / tanggal"
              placeholder="2024"
              value={draft.date}
              onChange={(v) => set({ date: v })}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextInput
              label="ID kredensial"
              hint="Opsional. Muncul dengan tombol salin di kartunya."
              value={draft.credential_id}
              onChange={(v) => set({ credential_id: v })}
            />
            <TextInput
              label="Link verifikasi"
              hint="Kosongkan kalau belum ada — tombol 'Verify' otomatis diganti keterangan."
              placeholder="https://"
              value={draft.credential_url}
              onChange={(v) => set({ credential_url: v })}
            />
          </div>

          <ImageInput
            label="Gambar lencana / sertifikat"
            hint="Opsional. Tanpa ini, kartunya menampilkan ikon penerbit sebagai gantinya."
            value={draft.image}
            onChange={(v) => set({ image: v })}
          />

          <StringListInput
            label="Teknologi terkait"
            hint="Tag kecil yang muncul di kartu. Tulis persis nama brand-nya supaya konsisten dengan bagian lain situs."
            placeholder="React"
            value={draft.skills}
            onChange={(v) => set({ skills: v })}
          />

          <Toggle
            label="Tampilkan di situs"
            hint="Matikan untuk menyimpan sebagai draft tanpa menghapusnya."
            value={draft.published}
            onChange={(v) => set({ published: v })}
          />
        </div>
      )}
    />
  );
}
