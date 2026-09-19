import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Situs ini harus tetap hidup tanpa Supabase. Kalau kredensialnya belum
 * diisi, `supabase` bernilai null dan seluruh aplikasi jatuh balik ke data
 * statis di src/data/*.js — panel admin pun otomatis menolak diakses,
 * bukan menampilkan form login yang tidak akan pernah berhasil.
 */
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/** URL publik sebuah file di bucket "media". */
export function mediaUrl(path) {
  if (!supabase || !path) return path || "";
  if (path.startsWith("http")) return path;
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}
