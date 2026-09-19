import CollectionManager from "../../components/admin/CollectionManager";
import {
  TextInput,
  TextArea,
  ImageInput,
  StringListInput,
  RepeaterInput,
  Toggle,
} from "../../components/admin/Fields";

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
  category: "Landing Page",
  price: 0,
  image: "",
  gallery: [],
  stack: [],
  includes: [],
  features: [],
  pages: "",
  license: "Boleh dipakai untuk satu proyek komersial.",
  demo: "",
  buy: "",
  published: true,
};

const idr = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function AdminTemplates() {
  return (
    <CollectionManager
      table="templates"
      title="Marketplace"
      description="Template yang dijual. Kategori yang Anda tulis di sini otomatis jadi filter di halaman Marketplace."
      addLabel="Tambah template"
      emptyRecord={empty}
      renderRow={(row) => (
        <div className="flex items-center gap-3">
          {row.image && (
            <img src={row.image} alt="" className="h-10 w-14 shrink-0 rounded object-cover" />
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{row.title}</p>
            <p className="truncate font-mono text-xs text-[var(--text-faint)]">
              {row.category} · {idr.format(row.price || 0)}
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
                set({ slug: !draft.slug || draft.slug === slugify(draft.title) ? slugify(v) : draft.slug, title: v })
              }
            />
            <TextInput
              label="Slug URL"
              hint={`Alamatnya jadi /marketplace/${draft.slug || "…"}`}
              value={draft.slug}
              onChange={(v) => set({ slug: slugify(v) })}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextInput
              label="Kategori"
              hint="Jadi tombol filter di halaman Marketplace."
              value={draft.category}
              onChange={(v) => set({ category: v })}
            />
            <TextInput
              label="Harga (rupiah)"
              hint="Angka saja, tanpa titik. Contoh: 149000"
              type="number"
              value={draft.price}
              onChange={(v) => set({ price: Number(v) || 0 })}
            />
          </div>

          <TextArea
            label="Deskripsi singkat"
            rows={2}
            value={draft.description}
            onChange={(v) => set({ description: v })}
          />

          <TextArea
            label="Ringkasan lengkap"
            rows={5}
            value={draft.overview}
            onChange={(v) => set({ overview: v })}
          />

          <ImageInput label="Gambar sampul" value={draft.image} onChange={(v) => set({ image: v })} />

          <ImageInput
            label="Galeri"
            hint="Tunjukkan halaman-halaman utamanya. Orang tidak beli template yang tidak bisa dilihat."
            multiple
            value={draft.gallery}
            onChange={(v) => set({ gallery: v })}
          />

          <StringListInput
            label="Tech stack"
            placeholder="React"
            value={draft.stack}
            onChange={(v) => set({ stack: v })}
          />

          <StringListInput
            label="Isi paket"
            hint="Apa saja yang pembeli dapat. Satu baris satu poin."
            placeholder="File desain Figma"
            value={draft.includes}
            onChange={(v) => set({ includes: v })}
          />

          <RepeaterInput
            label="Fitur"
            value={draft.features}
            onChange={(v) => set({ features: v })}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextInput label="Jumlah halaman" placeholder="5 halaman" value={draft.pages} onChange={(v) => set({ pages: v })} />
            <TextInput label="Lisensi" value={draft.license} onChange={(v) => set({ license: v })} />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextInput
              label="Link pratinjau"
              placeholder="https://"
              value={draft.demo}
              onChange={(v) => set({ demo: v })}
            />
            <TextInput
              label="Link beli"
              hint="Kosongkan kalau belum dijual — tombolnya otomatis diganti keterangan 'belum dijual'."
              placeholder="https://"
              value={draft.buy}
              onChange={(v) => set({ buy: v })}
            />
          </div>

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
