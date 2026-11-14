import { Download, Printer, Mail, MapPin } from "lucide-react";
import PageIntro from "../components/ui/PageIntro";
import { useContent } from "../context/ContentContext";
import { useLanguage } from "../context/LanguageContext";
import { site } from "../data/site";
import { technicalLevels, softLevels } from "../data/skills";

function Block({ title, children }) {
  return (
    <section className="cv-block border-t border-[var(--border)] py-7">
      <h2 className="eyebrow mb-5 text-[var(--accent-1)]">{title}</h2>
      {children}
    </section>
  );
}

function Entry({ title, meta, body }) {
  return (
    <div className="cv-entry mb-5 last:mb-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 className="text-base font-medium">{title}</h3>
        {meta?.period && (
          <span className="font-mono text-xs text-[var(--text-faint)]">{meta.period}</span>
        )}
      </div>
      {meta?.sub && <p className="text-sm text-[var(--text-muted)]">{meta.sub}</p>}
      {body && (
        <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-[var(--text-muted)]">
          {body}
        </p>
      )}
    </div>
  );
}

function Bar({ label, level }) {
  return (
    <div className="cv-bar">
      <div className="mb-1 flex justify-between text-xs">
        <span>{label}</span>
        <span className="font-mono text-[var(--text-faint)]">{level}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-2)]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${level}%`,
            background: "linear-gradient(90deg, var(--accent-1), var(--accent-2))",
          }}
        />
      </div>
    </div>
  );
}

/** "2024 – sekarang · Jurusan" -> periode + keterangan. */
function splitMeta(meta) {
  const parts = String(meta || "").split(" · ");
  if (/^\d/.test(parts[0])) return { period: parts[0], sub: parts.slice(1).join(" · ") };
  return { period: "", sub: meta || "" };
}

/**
 * CV digital: semua isinya dirangkai dari data yang sudah ada di situs
 * (profil, skill, pengalaman, sertifikat, proyek), jadi tidak ada data
 * ganda yang harus dirawat. Tombol cetak memakai gaya khusus @media print.
 */
export default function CV() {
  const { t, tx } = useLanguage();
  const { settings, projects, certificates, experiences, links } = useContent();

  const cvHref = settings.cvUrl || site.cvUrl;
  const email = settings.email || site.email;
  const location = settings.location || site.location;

  const edu = [1, 2].map((n) => ({
    title: t(`profile.edu${n}Title`),
    meta: splitMeta(t(`profile.edu${n}Meta`)),
    body: t(`profile.edu${n}Body`),
  }));
  const plk = [1, 2].map((n) => ({
    title: t(`profile.plk${n}Title`),
    meta: splitMeta(t(`profile.plk${n}Meta`)),
    body: t(`profile.plk${n}Body`),
  }));
  const bySource = (cat) => (experiences || []).filter((e) => e.category === cat);
  const org = bySource("organisasi");
  const lomba = [
    ...bySource("lomba"),
    ...(certificates || [])
      .filter((c) => c.category === "lomba" || c.category === "prestasi")
      .map((c) => ({ id: c.id, title: c.title, role: c.issuer, period: c.date })),
  ];
  const social = links?.social || [];

  return (
    <>
      <div className="no-print">
        <PageIntro
          label={t("cvpage.label")}
          title={t("cvpage.title")}
          description={t("cvpage.description")}
        >
          <div className="flex flex-wrap gap-3">
            <a
              href={cvHref}
              download
              className="focus-ring inline-flex items-center gap-2 rounded-full bg-[var(--text)] px-6 py-3 text-sm font-medium text-[var(--bg)] transition-opacity hover:opacity-90"
            >
              <Download size={16} /> {t("cvpage.download")}
            </a>
            <button
              type="button"
              onClick={() => window.print()}
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] px-6 py-3 text-sm transition-colors hover:border-[var(--accent-1)]"
            >
              <Printer size={16} /> {t("cvpage.print")}
            </button>
          </div>
        </PageIntro>
      </div>

      <section className="px-6 pb-28 pt-12 sm:px-10 sm:pb-36">
        <article
          id="cv-paper"
          className="cv-paper mx-auto max-w-[900px] rounded-2xl border border-[var(--border)] p-7 sm:p-12"
          style={{ background: "var(--card-bg)" }}
        >
          <header className="pb-8">
            <h1 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">
              {site.name}
            </h1>
            <p className="mt-2 text-lg text-[var(--accent-1)]">{site.role}</p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-2">
                <Mail size={14} /> {email}
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin size={14} /> {location}
              </span>
              {social.map((s) => (
                <a
                  key={s.brand}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--accent-1)]"
                >
                  {s.brand}
                  {s.handle ? `: ${s.handle}` : ""}
                </a>
              ))}
            </div>
          </header>

          <Block title={t("cvpage.profile")}>
            <p className="max-w-[70ch] text-sm leading-relaxed text-[var(--text-muted)]">
              {t("cvpage.summary")}
            </p>
          </Block>

          <Block title={t("cvpage.education")}>
            {edu.map((e) => (
              <Entry key={e.title} {...e} />
            ))}
          </Block>

          <Block title={t("cvpage.experience")}>
            {plk.map((e) => (
              <Entry key={e.title} {...e} />
            ))}
          </Block>

          {org.length > 0 && (
            <Block title={t("cvpage.organisation")}>
              {org.map((e) => (
                <Entry
                  key={e.id}
                  title={e.title}
                  meta={{ period: e.period, sub: e.role }}
                  body={e.description}
                />
              ))}
            </Block>
          )}

          {lomba.length > 0 && (
            <Block title={t("cvpage.competitions")}>
              {lomba.map((e) => (
                <Entry
                  key={e.id}
                  title={e.title}
                  meta={{ period: e.period, sub: e.role }}
                  body={e.description}
                />
              ))}
            </Block>
          )}

          <Block title={t("cvpage.skills")}>
            <div className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
              <div>
                <p className="mb-3 text-xs text-[var(--text-faint)]">{t("cvpage.technical")}</p>
                <div className="flex flex-col gap-3">
                  {technicalLevels.map((s) => (
                    <Bar key={tx(s.name)} label={tx(s.name)} level={s.level} />
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs text-[var(--text-faint)]">{t("cvpage.soft")}</p>
                <div className="flex flex-col gap-3">
                  {softLevels.map((s) => (
                    <Bar key={s.key} label={t(s.key)} level={s.level} />
                  ))}
                </div>
              </div>
            </div>
          </Block>

          {projects.length > 0 && (
            <Block title={t("cvpage.projects")}>
              {projects.slice(0, 5).map((p) => (
                <Entry
                  key={p.id}
                  title={p.title}
                  meta={{ period: p.year, sub: [tx(p.role), p.stack.slice(0, 4).join(", ")].filter(Boolean).join(" · ") }}
                  body={tx(p.description)}
                />
              ))}
            </Block>
          )}

          {certificates.length > 0 && (
            <Block title={t("cvpage.certificates")}>
              <ul className="m-0 list-none space-y-1.5 p-0 text-sm text-[var(--text-muted)]">
                {certificates.map((c) => (
                  <li key={c.id}>
                    <span className="text-[var(--text)]">{c.title}</span> — {c.issuer}
                    {c.date ? `, ${c.date}` : ""}
                  </li>
                ))}
              </ul>
            </Block>
          )}
        </article>
      </section>

      <style>{`
        @media print {
          header.nav-glass, footer, .no-print, .noise-layer { display: none !important; }
          html, body { background: #fff !important; }
          body * { box-shadow: none !important; }
          .cv-paper {
            --text: #111; --text-muted: #333; --text-faint: #666;
            --border: #d4d4d8; --surface-2: #e5e7eb; --card-bg: #fff; --accent-1: #1d4ed8; --accent-2: #1d4ed8;
            border: 0 !important; padding: 0 !important; max-width: none !important;
            color: #111 !important; background: #fff !important;
          }
          .cv-block, .cv-entry, .cv-bar { break-inside: avoid; }
          main > div { opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </>
  );
}
