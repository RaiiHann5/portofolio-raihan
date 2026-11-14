import CollectionManager from "../../components/admin/CollectionManager";
import {
  TextInput,
  TextArea,
  ImageInput,
  StringListInput,
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
  excerpt: "",
  content: "",
  cover: "",
  tags: [],
  published: true,
};

export default function AdminPosts() {
  return (
    <CollectionManager
      table="posts"
      title="Blog / catatan ngoding"
      description="Artikel yang tampil di halaman Blog. Isi artikel pakai teks biasa: baris kosong = paragraf baru, '## Judul' = subjudul, dan kode dibungkus tiga tanda kutip terbalik (```)."
      addLabel="Tulis artikel"
      emptyRecord={empty}
      renderRow={(row) => (
        <div className="flex items-center gap-3">
          {row.cover && (
            <img src={row.cover} alt="" className="h-10 w-14 shrink-0 rounded object-cover" />
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{row.title}</p>
            <p className="truncate font-mono text-xs text-[var(--text-faint)]">
              /blog/{row.slug}
              {!row.published && " · draft"}
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
                set({
                  slug: !draft.slug || draft.slug === slugify(draft.title) ? slugify(v) : draft.slug,
                  title: v,
                })
              }
            />
            <TextInput
              label="Slug URL"
              hint={`Alamatnya jadi /blog/${draft.slug || "…"}`}
              value={draft.slug}
              onChange={(v) => set({ slug: slugify(v) })}
            />
          </div>

          <TextArea
            label="Ringkasan"
            hint="Satu atau dua kalimat. Muncul di kartu daftar artikel."
            rows={2}
            value={draft.excerpt}
            onChange={(v) => set({ excerpt: v })}
          />

          <TextArea
            label="Isi artikel"
            rows={16}
            value={draft.content}
            onChange={(v) => set({ content: v })}
          />

          <ImageInput
            label="Gambar sampul"
            hint="Opsional."
            value={draft.cover}
            onChange={(v) => set({ cover: v })}
          />

          <StringListInput
            label="Tag"
            hint="Contoh: React, Laravel, Tips. Dipakai sebagai filter."
            placeholder="React"
            value={draft.tags}
            onChange={(v) => set({ tags: v })}
          />

          <Toggle
            label="Terbitkan"
            hint="Matikan untuk menyimpan sebagai draft."
            value={draft.published}
            onChange={(v) => set({ published: v })}
          />
        </div>
      )}
    />
  );
}
