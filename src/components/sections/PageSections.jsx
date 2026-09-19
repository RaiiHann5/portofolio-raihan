import { useContent } from "../../context/ContentContext";
import CustomSection from "./CustomSection";

/** Semua section buatan admin milik satu halaman, sudah urut. */
export default function PageSections({ page }) {
  const { sectionsFor } = useContent();
  return sectionsFor(page).map((section) => (
    <CustomSection key={section.id} section={section} />
  ));
}
