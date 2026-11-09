import { useContent } from "../../context/ContentContext";

/**
 * Menampilkan anak-anaknya hanya kalau section ini tidak dimatikan di
 * panel admin. Section yang dimatikan tidak dirender sama sekali, jadi
 * tidak ada animasi, fetch, atau ruang kosong yang tertinggal.
 */
export default function SectionGate({ id, children }) {
  const { isSectionVisible } = useContent();
  return isSectionVisible(id) ? children : null;
}
