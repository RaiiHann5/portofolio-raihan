import { ExternalLink, Award, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { useMagnetic } from "../../hooks/useMagnetic";
import { useCursor } from "../../context/CursorContext";
import { useContent } from "../../context/ContentContext";
import SectionHeading from "../ui/SectionHeading";
import BrandGlyph from "../ui/BrandGlyph";
import { brands } from "../../data/brands";

/**
 * Kartu diberi label brand penerbit lewat registry yang sama dengan tech
 * stack (data/brands.js). Kalau penerbitnya bukan brand yang dikenal —
 * misalnya nama sekolah atau lembaga sertifikasi lokal — otomatis jatuh
 * balik ke inisial, bukan ikon yang salah.
 */
function issuerColor(issuer) {
  const brand = brands[issuer];
  return brand?.hex || "var(--text-faint)";
}

function CertificateCard({ cert }) {
  const magneticRef = useMagnetic(0.04);
  const { setCursor, clearCursor } = useCursor();
  const [copied, setCopied] = useState(false);
  const hasImage = Boolean(cert.image);
  const hasLink = Boolean(cert.credentialUrl);

  async function copyId(e) {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(cert.credentialId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Diam-diam gagal saja — menyalin ID kredensial bukan aksi kritis.
    }
  }

  return (
    <div
      ref={magneticRef}
      data-reveal
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] transition-colors duration-300 hover:border-[var(--border-strong)]"
      style={{ background: "var(--card-bg)" }}
    >
      {/* Lencana/gambar sertifikat kalau ada; kalau tidak, badge ikon
          penerbit ditaruh sebagai representasi visual supaya kartu tidak
          kosong melompong. */}
      <div className="relative aspect-[16/10] overflow-hidden border-b border-[var(--border)]">
        {hasImage ? (
          <img
            src={cert.image}
            alt={cert.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ background: "var(--surface-1)" }}
          >
            <span
              className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border)]"
              style={{ color: issuerColor(cert.issuer) }}
            >
              <BrandGlyph name={cert.issuer} size={28} />
            </span>
          </div>
        )}

        {cert.date && (
          <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/50 px-2.5 py-1 font-mono text-[10px] text-white backdrop-blur-sm">
            {cert.date}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start gap-3">
          <span
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border)]"
            style={{ color: issuerColor(cert.issuer) }}
          >
            <BrandGlyph name={cert.issuer} size={15} />
          </span>
          <div className="min-w-0">
            <h3 className="text-base font-medium leading-snug tracking-tight">{cert.title}</h3>
            <p className="mt-0.5 truncate text-xs text-[var(--text-faint)]">{cert.issuer}</p>
          </div>
        </div>

        {cert.skills?.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {cert.skills.map((skill) => (
              <li
                key={skill}
                className="rounded-full border border-[var(--border)] px-2.5 py-0.5 font-mono text-[10px] text-[var(--text-faint)]"
              >
                {skill}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          {hasLink ? (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setCursor("Verify", "label")}
              onMouseLeave={clearCursor}
              className="focus-ring group/link inline-flex items-center gap-1.5 text-xs font-medium"
            >
              <span className="relative">
                Verify
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[var(--accent-1)] transition-all duration-300 group-hover/link:w-full" />
              </span>
              <ExternalLink size={12} strokeWidth={2.2} />
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-faint)]">
              <Award size={12} /> No link yet
            </span>
          )}

          {cert.credentialId && (
            <button
              type="button"
              onClick={copyId}
              onMouseEnter={() => setCursor(copied ? "Copied" : "Copy ID", "label")}
              onMouseLeave={clearCursor}
              className="focus-ring inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-2.5 py-1 font-mono text-[10px] text-[var(--text-faint)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text)]"
            >
              {copied ? <Check size={11} className="text-[var(--accent-1)]" /> : <Copy size={11} />}
              {copied ? "Copied" : "ID"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Certificates() {
  const containerRef = useScrollReveal();
  const { certificates } = useContent();

  // Section kosong tidak perlu menampilkan judul dan ruang kosong — ini
  // bisa terjadi kalau admin menghapus semua sertifikat dari database.
  if (!certificates?.length) return null;

  return (
    <section id="certificates" ref={containerRef} className="relative px-6 py-28 sm:px-10 sm:py-36">
      <div className="mx-auto max-w-[1400px]">
        <div data-reveal>
          <SectionHeading
            index="05"
            label="Certificates"
            title="Skills, verified."
            description="A short list of the courses and certifications behind the tools I use — click a card to check the credential."
          />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <CertificateCard key={cert.id} cert={cert} />
          ))}
        </div>
      </div>
    </section>
  );
}
