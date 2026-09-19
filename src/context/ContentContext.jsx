import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { setOverrides } from "../i18n/overrides";
import { projects as staticProjects } from "../data/projects";
import { templates as staticTemplates } from "../data/templates";
import { certificates as staticCertificates } from "../data/certificates";
import { socials as staticSocials, hirePlatforms as staticHire } from "../data/platforms";
import { brands } from "../data/brands";

const ContentContext = createContext(null);

function toSlug(text) {
  return String(text ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Ubah baris `links` dari database jadi bentuk yang dipakai AccountCard.
 * Ikon bisa datang dari dua arah: tersimpan langsung di baris (icon_path),
 * atau merujuk brand yang sudah ada di kode. Yang tersimpan menang, karena
 * itu berarti admin sengaja memilihnya.
 */
function normalizeLink(row) {
  const known = brands[row.label];
  return {
    brand: row.label,
    handle: row.handle || "",
    note: row.note || "",
    url: row.url,
    icon: {
      path: row.icon_path || known?.path || "",
      monogram: !row.icon_path && !known?.path ? row.label.slice(0, 2).toUpperCase() : null,
      hex: row.icon_hex || known?.hex || "#9a9aa2",
      hexDark: row.icon_dark || known?.hexDark || "",
      title: row.label,
    },
  };
}

/** Baris project dari database -> bentuk yang sama persis dengan data statis. */
function normalizeProject(row) {
  return {
    id: row.id,
    slug: toSlug(row.slug) || row.id,
    title: row.title,
    description: row.description || "",
    overview: row.overview || "",
    role: row.role || "",
    type: row.type || "",
    year: row.year || "",
    demo: row.demo || "",
    repo: row.repo || "",
    image: row.image || null,
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    stack: Array.isArray(row.stack) ? row.stack : [],
    features: Array.isArray(row.features) ? row.features : [],
    gradient: row.gradient || "linear-gradient(135deg, #26203a, #0a0a0b)",
  };
}

function normalizeCertificate(row) {
  return {
    id: row.id,
    title: row.title,
    issuer: row.issuer,
    date: row.date || "",
    credentialId: row.credential_id || "",
    credentialUrl: row.credential_url || "",
    image: row.image || "",
    skills: Array.isArray(row.skills) ? row.skills : [],
  };
}

function normalizeTemplate(row) {
  return {
    id: row.id,
    slug: toSlug(row.slug) || row.id,
    title: row.title,
    description: row.description || "",
    overview: row.overview || "",
    category: row.category || "",
    price: row.price || 0,
    image: row.image || null,
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    stack: Array.isArray(row.stack) ? row.stack : [],
    includes: Array.isArray(row.includes) ? row.includes : [],
    features: Array.isArray(row.features) ? row.features : [],
    pages: row.pages || "",
    license: row.license || "",
    demo: row.demo || "",
    buy: row.buy || "",
  };
}

export function ContentProvider({ children }) {
  // Nilai awal = data statis. Halaman bisa langsung render tanpa nunggu
  // jaringan, lalu diganti diam-diam kalau database punya isinya.
  const [projects, setProjects] = useState(staticProjects);
  const [templates, setTemplates] = useState(staticTemplates);
  const [certificates, setCertificates] = useState(staticCertificates);
  const [links, setLinks] = useState({
    social: staticSocials.map((s) => ({ ...s, icon: brands[s.brand] })),
    hire: staticHire.map((s) => ({ ...s, icon: brands[s.brand] })),
  });
  const [sections, setSections] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(isSupabaseConfigured);

  const load = useCallback(async () => {
    if (!supabase) return;

    try {
      const [projectRes, templateRes, certRes, linkRes, textRes, sectionRes, settingRes] =
        await Promise.all([
          supabase.from("projects").select("*").eq("published", true).order("position"),
          supabase.from("templates").select("*").eq("published", true).order("position"),
          supabase.from("certificates").select("*").eq("published", true).order("position"),
          supabase.from("links").select("*").eq("published", true).order("position"),
          supabase.from("site_text").select("*"),
          supabase.from("sections").select("*").eq("published", true).order("position"),
          supabase.from("settings").select("*"),
        ]);

      // Tabel yang masih kosong sengaja TIDAK menimpa data statis. Ini
      // penting: tanpa penjagaan ini, situs jadi kosong melompong di
      // menit-menit pertama setelah database dibuat tapi belum diisi.
      if (projectRes.data?.length) setProjects(projectRes.data.map(normalizeProject));
      if (templateRes.data?.length) setTemplates(templateRes.data.map(normalizeTemplate));
      if (certRes.data?.length) setCertificates(certRes.data.map(normalizeCertificate));

      if (linkRes.data?.length) {
        const grouped = {};
        for (const row of linkRes.data) {
          const key = row.group || "social";
          (grouped[key] ||= []).push(normalizeLink(row));
        }
        setLinks(grouped);
      }

      if (textRes.data?.length) {
        const map = {};
        for (const row of textRes.data) map[row.key] = { en: row.en, id: row.id };
        setOverrides(map);
      }

      if (sectionRes.data) setSections(sectionRes.data);

      if (settingRes.data?.length) {
        const map = {};
        for (const row of settingRes.data) map[row.key] = row.value;
        setSettings(map);
      }
    } catch (error) {
      // Gagal memuat bukan alasan untuk menampilkan halaman rusak —
      // pengunjung tetap dapat versi statisnya.
      console.error("Content load failed, using bundled data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const value = useMemo(
    () => ({
      projects,
      templates,
      certificates,
      links,
      sections,
      settings,
      loading,
      reload: load,
      /** Section tambahan milik satu halaman, sudah urut. */
      sectionsFor: (page) => sections.filter((s) => s.page === page),
      getProject: (slug) => projects.find((p) => p.slug === slug),
      getTemplate: (slug) => templates.find((t) => t.slug === slug),
      getNextProject: (slug) => {
        const i = projects.findIndex((p) => p.slug === slug);
        return i === -1 ? null : projects[(i + 1) % projects.length];
      },
    }),
    [projects, templates, certificates, links, sections, settings, loading, load]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}