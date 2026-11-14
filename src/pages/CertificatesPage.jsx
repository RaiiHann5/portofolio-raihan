import { useMemo } from "react";
import Certificates from "../components/sections/Certificates";
import Gallery from "../components/ui/Gallery";
import { useContent } from "../context/ContentContext";
import { useLanguage } from "../context/LanguageContext";

/**
 * Sertifikat & prestasi. Daftar sertifikatnya memakai komponen yang sama
 * dengan di About; ditambah galeri dokumentasi kegiatan yang dikumpulkan
 * dari kolom `documentation` tiap sertifikat.
 */
export default function CertificatesPage() {
  const { certificates } = useContent();
  const { t } = useLanguage();

  const docs = useMemo(
    () => (certificates || []).flatMap((c) => c.documentation || []),
    [certificates]
  );

  return (
    <div className="pt-8 sm:pt-12">
      <Certificates />

      {docs.length > 0 && (
        <section className="px-6 pb-28 sm:px-10 sm:pb-36">
          <div className="mx-auto max-w-[1400px]">
            <h2 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
              {t("certpage.docsTitle")}
            </h2>
            <p className="mt-3 max-w-[60ch] text-[var(--text-muted)]">
              {t("certpage.docsDescription")}
            </p>
            <div className="mt-10">
              <Gallery images={docs} title={t("certpage.docsTitle")} />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
