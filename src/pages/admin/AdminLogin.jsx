import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2, AlertCircle, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { inputBase } from "../../components/admin/Fields";

export default function AdminLogin() {
  const { session, signIn, enabled, loading } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  if (loading) return null;
  if (session) return <Navigate to={location.state?.from || "/admin/projects"} replace />;

  // Tanpa kredensial Supabase, form login tidak akan pernah bisa berhasil.
  // Lebih jujur menjelaskan kenapa daripada membiarkannya gagal diam-diam.
  if (!enabled) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-6">
        <div className="flex flex-col gap-4 rounded-xl border border-[var(--border)] p-8">
          <Lock size={22} className="text-[var(--text-faint)]" />
          <h1 className="font-display text-2xl font-medium tracking-tight">
            Panel admin belum aktif
          </h1>
          <p className="text-sm leading-relaxed text-[var(--text-muted)]">
            Isi <code className="font-mono text-xs">VITE_SUPABASE_URL</code> dan{" "}
            <code className="font-mono text-xs">VITE_SUPABASE_ANON_KEY</code> di file{" "}
            <code className="font-mono text-xs">.env</code>, lalu jalankan{" "}
            <code className="font-mono text-xs">supabase/schema.sql</code> di SQL Editor
            Supabase. Langkah lengkapnya ada di komentar paling atas file itu.
          </p>
          <p className="text-sm leading-relaxed text-[var(--text-muted)]">
            Selama belum diisi, situs publik tetap berjalan normal memakai data dari{" "}
            <code className="font-mono text-xs">src/data/</code>.
          </p>
        </div>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      // Pesan asli Supabase berbahasa Inggris dan agak teknis.
      setError(
        err.message?.includes("Invalid login")
          ? "Email atau kata sandi salah."
          : err.message || "Gagal masuk. Coba lagi."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6">
      <div className="flex flex-col gap-6 rounded-xl border border-[var(--border)] p-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-2xl font-medium tracking-tight">Masuk sebagai admin</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Akun dibuat dari dasbor Supabase, bukan dari halaman ini.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="admin-email" className="text-xs text-[var(--text-muted)]">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputBase}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="admin-password" className="text-xs text-[var(--text-muted)]">
              Kata sandi
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputBase}
            />
          </div>

          {error && (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-[#f87171]/40 px-3.5 py-2.5 text-sm text-[#f87171]"
            >
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-[var(--text)] px-6 py-3 text-sm font-medium text-[var(--bg)] transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {busy && <Loader2 size={15} className="animate-spin" />}
            {busy ? "Memeriksa…" : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
