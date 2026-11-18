import { Download } from "lucide-react";
import PageIntro from "../components/ui/PageIntro";
import { useContent } from "../context/ContentContext";
import { useLanguage } from "../context/LanguageContext";
import { site } from "../data/site";

/**
 * Halaman CV: menampilkan file PDF CV yang sama persis dengan yang
 * diunduh lewat tombol "Unduh CV" di Hero. Sumbernya satu: site.cvUrl
 * (public/cv/Raihan-Rezki-Ramadhan-CV.pdf) atau settings.cvUrl dari admin.
 */
export default function CV() {
  const { t } = useLanguage();
  const { settings } = useContent();

  const cvHref = settings.cvUrl || site.cvUrl;
  // Gambar cadangan untuk browser yang tidak bisa menampilkan PDF inline
  // (kebanyakan Chrome Android). Hanya dipakai kalau CV memakai file bawaan.
  const previewSrc = `${import.meta.env.BASE_URL}cv/Raihan-Rezki-Ramadhan-CV-preview.webp`;
  const usingBundledCv = cvHref === site.cvUrl;
  const viewerSrc = `${cvHref}#toolbar=0&navpanes=0&view=FitH`;

  return (
    <>
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
        </div>
      </PageIntro>

      <section className="px-6 pb-28 pt-12 sm:px-10 sm:pb-36">
        <div className="mx-auto w-full max-w-[900px] overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
          <object
            data={viewerSrc}
            type="application/pdf"
            aria-label={`CV ${site.name}`}
            className="block h-[78vh] min-h-[520px] w-full sm:aspect-[1/1.414] sm:h-auto"
          >
            {usingBundledCv ? (
              <a href={cvHref} target="_blank" rel="noopener noreferrer">
                <img src={previewSrc} alt={`CV ${site.name}`} className="block w-full" />
              </a>
            ) : (
              <p className="p-8 text-sm text-[var(--text-muted)]">
                <a className="underline" href={cvHref} target="_blank" rel="noopener noreferrer">
                  {t("cvpage.download")}
                </a>
              </p>
            )}
          </object>
        </div>
      </section>
    </>
  );
}
