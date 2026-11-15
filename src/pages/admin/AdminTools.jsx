import { useMemo } from "react";
import CollectionManager from "../../components/admin/CollectionManager";
import SkillPill from "../../components/sections/SkillPill";
import { TextInput, ImageInput, Toggle, Field } from "../../components/admin/Fields";
import { useCollection } from "../../hooks/useCollection";
import { skillGroups } from "../../data/skills";

const DEFAULT_GROUPS = skillGroups.map((g) => (typeof g.label === "string" ? g.label : g.label.en));

const empty = {
  group_name: "Frontend",
  name: "",
  icon: "",
  icon_slug: "",
  color: "",
  published: true,
};

function ColorInput({ value, onChange }) {
  const valid = /^#[0-9a-f]{6}$/i.test(value || "");
  return (
    <Field
      label="Warna pill"
      hint="Opsional. Kosongkan untuk memakai warna bawaan tool (atau abu-abu kalau belum terdaftar)."
      htmlFor="f-warna-pill"
    >
      <div className="flex items-center gap-3">
        <input
          type="color"
          aria-label="Pilih warna"
          value={valid ? value : "#888888"}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-14 cursor-pointer rounded-lg border border-[var(--border)] bg-transparent p-1"
        />
        <input
          id="f-warna-pill"
          value={value || ""}
          placeholder="#3178C6"
          maxLength={7}
          onChange={(e) => onChange(e.target.value.trim())}
          className="focus-ring w-32 rounded-lg border border-[var(--border)] bg-transparent px-3.5 py-2.5 font-mono text-sm"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="focus-ring text-xs text-[var(--text-faint)] hover:text-[var(--text)]"
          >
            Reset
          </button>
        )}
      </div>
    </Field>
  );
}

export default function AdminTools() {
  // Dipakai untuk saran nama grup (datalist), supaya tidak salah ketik.
  const { rows } = useCollection("tools");
  const groups = useMemo(
    () => [...new Set([...DEFAULT_GROUPS, ...rows.map((r) => r.group_name).filter(Boolean)])],
    [rows]
  );

  return (
    <CollectionManager
      table="tools"
      title="Tools & bahasa pemrograman"
      description="Daftar tools di section Keahlian (halaman Tentang Saya). Tools dikelompokkan otomatis berdasarkan nama grup; urutan grup mengikuti tool pertamanya, jadi atur urutan lewat tombol panah. Kamu bisa menambah ikon lewat upload gambar atau slug Simple Icons."
      addLabel="Tambah tool"
      emptyRecord={empty}
      renderRow={(row) => (
        <div className="flex items-center gap-3">
          {row.icon ? (
            <img src={row.icon} alt="" className="h-7 w-7 shrink-0 rounded bg-white/90 object-contain p-0.5" />
          ) : row.icon_slug ? (
            <img
              src={`https://cdn.simpleicons.org/${row.icon_slug}/888888`}
              alt=""
              className="h-6 w-6 shrink-0"
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
            />
          ) : (
            <span className="h-6 w-6 shrink-0 rounded border border-dashed border-[var(--border)]" />
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{row.name}</p>
            <p className="truncate font-mono text-xs text-[var(--text-faint)]">
              {row.group_name}
              {!row.published && " · disembunyikan"}
            </p>
          </div>
        </div>
      )}
      renderForm={(draft, set) => (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextInput
              label="Nama tool / bahasa"
              placeholder="React"
              value={draft.name}
              onChange={(v) => set({ name: v })}
            />
            <div>
              <TextInput
                label="Grup"
                hint="Pilih dari saran atau ketik nama grup baru (mis. DevOps)."
                list="tool-groups"
                value={draft.group_name}
                onChange={(v) => set({ group_name: v })}
              />
              <datalist id="tool-groups">
                {groups.map((g) => (
                  <option key={g} value={g} />
                ))}
              </datalist>
            </div>
          </div>

          <ImageInput
            label="Ikon (upload gambar)"
            hint="Opsional. PNG, SVG, atau JPG berlatar transparan paling bagus, bentuk persegi. Kalau diisi, ini dipakai menggantikan slug di bawah."
            value={draft.icon}
            onChange={(v) => set({ icon: v })}
          />

          <TextInput
            label="Atau slug Simple Icons"
            hint="Opsional. Cari nama ikon di simpleicons.org, lalu tulis slug-nya, contoh: react, laravel, nodedotjs, tailwindcss. Ikon otomatis berwarna sesuai teks pill."
            placeholder="react"
            value={draft.icon_slug}
            onChange={(v) => set({ icon_slug: v.toLowerCase().replace(/[^a-z0-9]/g, "") })}
          />

          <ColorInput value={draft.color} onChange={(v) => set({ color: v })} />

          <div className="rounded-xl border border-[var(--border)] p-5">
            <p className="mb-3 text-xs font-medium text-[var(--text-muted)]">Pratinjau</p>
            <SkillPill
              name={draft.name || "Nama tool"}
              icon={draft.icon}
              iconSlug={draft.icon_slug}
              color={/^#[0-9a-f]{6}$/i.test(draft.color || "") ? draft.color : ""}
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
