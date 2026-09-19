/**
 * Penyimpanan kecil untuk teks yang ditimpa lewat panel admin.
 *
 * Kamus di translations.js tetap jadi sumber bawaan dan jaring pengaman:
 * kalau tabel site_text kosong, tidak ada koneksi, atau sebuah key belum
 * pernah disentuh admin, teks aslinya yang dipakai. Overrides ini hanya
 * lapisan di atasnya.
 *
 * Dipakai lewat useSyncExternalStore di LanguageContext supaya seluruh
 * komponen ikut render ulang begitu teksnya berubah.
 */
let overrides = {};
const listeners = new Set();

function emit() {
  for (const listener of listeners) listener();
}

export function subscribeOverrides(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getOverrides() {
  return overrides;
}

/** Ganti seluruh isi override sekaligus (dipakai saat memuat dari database). */
export function setOverrides(next) {
  overrides = next || {};
  emit();
}

/** Ubah satu key saja, dipakai supaya pratinjau di admin langsung terlihat. */
export function setOverride(key, value) {
  overrides = { ...overrides, [key]: value };
  emit();
}
