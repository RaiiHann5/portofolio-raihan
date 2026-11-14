import CollectionManager from "../../components/admin/CollectionManager";
import {
  TextInput,
  TextArea,
  SelectInput,
  ImageInput,
  Toggle,
} from "../../components/admin/Fields";

const LABEL = { plk: "PLK", organisasi: "Organisasi", lomba: "Lomba" };

const empty = {
  category: "organisasi",
  title: "",
  role: "",
  period: "",
  description: "",
  image: "",
  published: true,
};

export default function AdminExperiences() {
  return (
    <CollectionManager
      table="experiences"
      title="Pengalaman"
      description="Organisasi, kepanitiaan, lomba, atau PLK tambahan. Tampil di halaman Pengalaman dan CV Digital. PLK utama (PT Inovasi Informatik Sinergi dan Kantor Kecamatan Anjir Muara) diubah lewat Teks halaman. Sertifikat berkategori lomba/prestasi otomatis ikut muncul di tab Lomba."
      addLabel="Tambah pengalaman"
      emptyRecord={empty}
      renderRow={(row) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{row.title}</p>
          <p className="truncate font-mono text-xs text-[var(--text-faint)]">
            {LABEL[row.category] || row.category}
            {row.period && ` · ${row.period}`}
            {!row.published && " · draft"}
          </p>
        </div>
      )}
      renderForm={(draft, set) => (
        <div className="flex flex-col gap-5">
          <SelectInput
            label="Kategori"
            value={draft.category}
            onChange={(v) => set({ category: v })}
            options={[
              { value: "organisasi", label: "Organisasi / kepanitiaan" },
              { value: "lomba", label: "Lomba" },
              { value: "plk", label: "PLK / magang (tambahan)" },
            ]}
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextInput
              label="Nama"
              placeholder="OSIS SMKN 2 Banjarmasin"
              value={draft.title}
              onChange={(v) => set({ title: v })}
            />
            <TextInput
              label="Jabatan / peran / hasil"
              placeholder="Anggota seksi IT · Juara 2"
              value={draft.role}
              onChange={(v) => set({ role: v })}
            />
          </div>
          <TextInput
            label="Periode"
            placeholder="2024 – 2025"
            value={draft.period}
            onChange={(v) => set({ period: v })}
          />
          <TextArea
            label="Deskripsi"
            rows={4}
            value={draft.description}
            onChange={(v) => set({ description: v })}
          />
          <ImageInput
            label="Foto dokumentasi"
            hint="Opsional."
            value={draft.image}
            onChange={(v) => set({ image: v })}
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
