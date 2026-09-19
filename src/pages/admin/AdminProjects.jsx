import CollectionManager from "../../components/admin/CollectionManager";
import {
  TextInput,
  TextArea,
  ImageInput,
  StringListInput,
  RepeaterInput,
  Toggle,
} from "../../components/admin/Fields";

/** Ubah judul jadi slug URL: huruf kecil, tanpa simbol, spasi jadi tanda hubung. */
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const empty = {
  slug: "",
  title: "",
  description: "",
  overview: "",
  role: "",
  type: "",
  year: new Date().getFullYear().toString(),
  demo: "",
  repo: "",
  image: "",
  gallery: [],
  stack: [],
  features: [],
  gradient: "linear-gradient(135deg, #26203a, #0a0a0b)",
  published: true,
};

export default function AdminProjects() {
  return (
    <CollectionManager
      table="projects"
      title="Proyek"
      description="Semua yang tampil di halaman Project dan tiga baris teratas di Home. Urutan di sini menentukan urutan di situs."
      addLabel="Tambah proyek"
      emptyRecord={empty}
      renderRow={(row) => (
        <div className="flex items-center gap-3">
          {row.image && (
            <img
              src={row.image}
              alt=""
              className="h-10 w-14 shrink-0 rounded object-cover"
            />
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{row.title}</p>
            <p className="truncate font-mono text-xs text-[var(--text-faint)]">
              /project/{row.slug}
            </p>
          </div>
        </div>
      )}
      renderForm={(draft, set) => (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextInput
              label="Judul"
              value={draft.title}
              onChange={(v) =>
                // Slug ikut terisi otomatis selama belum pernah disentuh
                // manual, supaya alamat URL tidak pernah kosong.
                set({ slug: !draft.slug || draft.slug === slugify(draft.title) ? slugify(v) : draft.slug, title: v })
              }
            />
            <TextInput
              label="Slug URL"
              hint={`Alamatnya jadi /project/${draft.slug || "…"}`}
              value={draft.slug}
              onChange={(v) => set({ slug: slugify(v) })}
            />
          </div>

          <TextArea
            label="Deskripsi singkat"
            hint="Satu atau dua kalimat. Muncul di kartu daftar proyek."
            rows={2}
            value={draft.description}
            onChange={(v) => set({ description: v })}
          />

          <TextArea
            label="Ringkasan lengkap"
            hint="Paragraf panjang di halaman detail."
            rows={5}
            value={draft.overview}
            onChange={(v) => set({ overview: v })}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <TextInput label="Peran" placeholder="Design & frontend" value={draft.role} onChange={(v) => set({ role: v })} />
            <TextInput label="Jenis" placeholder="Landing page" value={draft.type} onChange={(v) => set({ type: v })} />
            <TextInput label="Tahun" value={draft.year} onChange={(v) => set({ year: v })} />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextInput
              label="Link demo"
              hint="Kosongkan kalau belum ada. Tombolnya otomatis disembunyikan."
              placeholder="https://"
              value={draft.demo}
              onChange={(v) => set({ demo: v })}
            />
            <TextInput
              label="Link kode sumber"
              placeholder="https://github.com/…"
              value={draft.repo}
              onChange={(v) => set({ repo: v })}
            />
          </div>

          <ImageInput
            label="Gambar sampul"
            hint="Dipakai di kartu daftar dan pratinjau saat di-hover."
            value={draft.image}
            onChange={(v) => set({ image: v })}
          />

          <ImageInput
            label="Galeri"
            hint="Tiga sampai lima tangkapan layar bikin halaman detailnya jauh lebih meyakinkan."
            multiple
            value={draft.gallery}
            onChange={(v) => set({ gallery: v })}
          />

          <StringListInput
            label="Tech stack"
            hint="Tulis persis seperti nama brand-nya (React, Laravel, Tailwind CSS) supaya logonya kebaca."
            placeholder="React"
            value={draft.stack}
            onChange={(v) => set({ stack: v })}
          />

          <RepeaterInput
            label="Fitur / sorotan"
            hint="Muncul sebagai daftar di halaman detail."
            value={draft.features}
            onChange={(v) => set({ features: v })}
          />

          <TextInput
            label="Gradien latar"
            hint="Dipakai sebagai warna dasar kalau gambarnya gagal dimuat."
            value={draft.gradient}
            onChange={(v) => set({ gradient: v })}
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
