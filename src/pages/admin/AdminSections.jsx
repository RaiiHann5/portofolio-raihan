import CollectionManager from "../../components/admin/CollectionManager";
import {
  TextInput,
  TextArea,
  SelectInput,
  RepeaterInput,
  Toggle,
} from "../../components/admin/Fields";

const empty = {
  page: "home",
  layout: "prose",
  eyebrow: "",
  title: "",
  body: "",
  blocks: [],
  published: true,
};

export default function AdminSections() {
  return (
    <CollectionManager
      table="sections"
      title="Section tambahan"
      description="Blok konten buatan sendiri yang ditempel di bagian bawah sebuah halaman, tanpa perlu menyentuh kode. Urutan di sini menentukan urutan tampilnya."
      addLabel="Tambah section"
      emptyRecord={empty}
      renderRow={(row) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{row.title || "(tanpa judul)"}</p>
          <p className="truncate font-mono text-xs text-[var(--text-faint)]">
            /{row.page === "home" ? "" : row.page} · {row.layout}
          </p>
        </div>
      )}
      renderForm={(draft, set) => (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <SelectInput
              label="Halaman"
              value={draft.page}
              onChange={(v) => set({ page: v })}
              options={[
                { value: "home", label: "Home" },
                { value: "about", label: "About Me" },
                { value: "project", label: "Project" },
                { value: "marketplace", label: "Marketplace" },
                { value: "find-me", label: "Find Me" },
              ]}
            />
            <SelectInput
              label="Bentuk tampilan"
              hint="Prose = paragraf. Cards = kotak berjejer. Stats = angka besar."
              value={draft.layout}
              onChange={(v) => set({ layout: v })}
              options={[
                { value: "prose", label: "Prose — judul dan paragraf" },
                { value: "cards", label: "Cards — daftar kotak" },
                { value: "stats", label: "Stats — angka dan label" },
              ]}
            />
          </div>

          <TextInput
            label="Label kecil di atas judul"
            hint="Opsional. Contoh: 'Testimoni', 'Penghargaan'."
            value={draft.eyebrow}
            onChange={(v) => set({ eyebrow: v })}
          />

          <TextInput label="Judul" value={draft.title} onChange={(v) => set({ title: v })} />

          <TextArea
            label="Paragraf pembuka"
            rows={4}
            value={draft.body}
            onChange={(v) => set({ body: v })}
          />

          {draft.layout !== "prose" && (
            <RepeaterInput
              label={draft.layout === "stats" ? "Angka" : "Kartu"}
              hint={
                draft.layout === "stats"
                  ? "Judul diisi angkanya (contoh: 30+), penjelasan diisi labelnya."
                  : "Satu item jadi satu kotak."
              }
              value={draft.blocks}
              onChange={(v) => set({ blocks: v })}
            />
          )}

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
