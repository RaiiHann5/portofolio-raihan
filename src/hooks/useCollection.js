import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

/**
 * CRUD generik untuk satu tabel Supabase.
 *
 * Sengaja memuat ulang dari server setiap selesai menyimpan, bukan
 * menambal state di sisi klien. Sedikit lebih lambat, tapi yang tampil di
 * layar dijamin sama dengan isi database — termasuk nilai default dan
 * urutan yang ditentukan server.
 */
export function useCollection(table, { orderBy = "position" } = {}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error: err } = await supabase.from(table).select("*").order(orderBy);
    if (err) setError(err.message);
    else {
      setRows(data || []);
      setError(null);
    }
    setLoading(false);
  }, [table, orderBy]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    async (values) => {
      const { error: err } = await supabase.from(table).insert(values);
      if (err) throw new Error(err.message);
      await refresh();
    },
    [table, refresh]
  );

  const update = useCallback(
    async (id, values) => {
      const { error: err } = await supabase.from(table).update(values).eq("id", id);
      if (err) throw new Error(err.message);
      await refresh();
    },
    [table, refresh]
  );

  /** site_text pakai `key` sebagai primary key, bukan `id`. */
  const upsert = useCallback(
    async (values, conflictColumn = "id") => {
      const { error: err } = await supabase
        .from(table)
        .upsert(values, { onConflict: conflictColumn });
      if (err) throw new Error(err.message);
      await refresh();
    },
    [table, refresh]
  );

  const remove = useCallback(
    async (id, column = "id") => {
      const { error: err } = await supabase.from(table).delete().eq(column, id);
      if (err) throw new Error(err.message);
      await refresh();
    },
    [table, refresh]
  );

  /**
   * Geser satu baris ke atas/bawah dengan menukar nilai `position`-nya.
   * Kedua baris ditulis ulang supaya urutannya tidak pernah bentrok.
   */
  const reorder = useCallback(
    async (index, delta) => {
      const target = index + delta;
      if (target < 0 || target >= rows.length) return;

      const a = rows[index];
      const b = rows[target];
      await Promise.all([
        supabase.from(table).update({ position: target }).eq("id", a.id),
        supabase.from(table).update({ position: index }).eq("id", b.id),
      ]);
      await refresh();
    },
    [rows, table, refresh]
  );

  return { rows, loading, error, refresh, create, update, upsert, remove, reorder };
}
