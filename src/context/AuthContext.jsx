import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) return undefined;
    let active = true;

    // Jaring pengaman: kalau Supabase tidak merespons, jangan kunci UI selamanya.
    const timeout = setTimeout(() => {
      if (active) setLoading(false);
    }, 6000);

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (active) setSession(data.session);
      })
      .catch(() => {
        if (active) setSession(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    // Sesi bisa berubah di tab lain atau kedaluwarsa sendiri; ikuti
    // perubahannya daripada mengandalkan satu kali pengecekan saja.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!active) return;
      setSession(next);
      setLoading(false);
    });

    return () => {
      active = false;
      clearTimeout(timeout);
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      enabled: isSupabaseConfigured,
      signIn: async (email, password) => {
        if (!supabase) throw new Error("Supabase belum dikonfigurasi.");
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      },
      signOut: async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
      },
    }),
    [session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
