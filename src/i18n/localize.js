/**
 * Helper untuk teks dua bahasa yang tinggal di luar kamus translations.js
 * (data proyek, timeline, template, isi section Beyond Code, dst).
 *
 * Bentuk datanya sederhana: `{ en: "...", id: "..." }`. Kalau nilainya
 * string biasa (misalnya data yang diketik lewat panel admin dan disimpan
 * satu bahasa saja di database), nilainya dikembalikan apa adanya, jadi
 * kedua jenis data bisa dipakai lewat fungsi yang sama.
 */

/** Bikin pasangan teks EN/ID. Singkatan supaya file data tetap ringkas. */
export const bi = (en, id) => ({ en, id });

/** Ambil teks sesuai bahasa. Cadangan: Inggris, lalu string kosong. */
export function localize(value, lang) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value[lang] || value.en || "";
  }
  return value;
}
