import CollectionManager from "../../components/admin/CollectionManager";
import {
  TextInput,
  TextArea,
  ImageInput,
  SelectInput,
  Toggle,
} from "../../components/admin/Fields";

const empty = {
  category: "pengguna",
  name: "",
  role: "",
  message: "",
  photo: "",
  published: true,
};

export default function AdminTestimonials() {
  return (
    <CollectionManager
      table="testimonials"
      title="Testimoni"
      description="Muncul di halaman Beranda, di bawah 'Cara kerjanya'. Section ini tidak tampil sama sekali selama belum ada testimoni."
      addLabel="Tambah testimoni"
      emptyRecord={empty}
      renderRow={(row) => (
        <div className="flex items-center gap-3">
          {row.photo ? (
            <img src={row.photo} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
          ) : (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface-2)] font-mono text-[10px] text-[var(--text-faint)]">
              {row.name?.slice(0, 2).toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{row.name}</p>
            <p className="truncate font-mono text-xs text-[var(--text-faint)]">
              {row.role || row.message}
            </p>
          </div>
        </div>
      )}
      renderForm={(draft, set) => (
        <div className="flex flex-col gap-5">
          <SelectInput
            label="Kategori"
            hint="Dipakai untuk filter di halaman Testimoni."
            value={draft.category}
            onChange={(v) => set({ category: v })}
            options={[
              { value: "guru", label: "Guru pembimbing" },
              { value: "teman", label: "Teman" },
              { value: "pengguna", label: "Pengguna" },
              { value: "plk", label: "Tempat PLK" },
            ]}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextInput
              label="Nama"
              placeholder="Nama pemberi testimoni"
              value={draft.name}
              onChange={(v) => set({ name: v })}
            />
            <TextInput
              label="Peran / asal"
              hint="Opsional. Contoh: Pemilik Kafe Kopi Senja."
              value={draft.role}
              onChange={(v) => set({ role: v })}
            />
          </div>

          <TextArea
            label="Isi testimoni"
            rows={5}
            value={draft.message}
            onChange={(v) => set({ message: v })}
          />

          <ImageInput
            label="Foto"
            hint="Opsional. Tanpa foto, kartunya menampilkan inisial nama."
            value={draft.photo}
            onChange={(v) => set({ photo: v })}
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
