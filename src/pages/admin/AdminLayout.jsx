import { NavLink, Navigate, Outlet, useLocation, Link } from "react-router-dom";
import {
  FolderKanban,
  ShoppingBag,
  Award,
  Link2,
  Type,
  LayoutTemplate,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/admin/projects", label: "Proyek", Icon: FolderKanban },
  { to: "/admin/templates", label: "Marketplace", Icon: ShoppingBag },
  { to: "/admin/certificates", label: "Sertifikat", Icon: Award },
  { to: "/admin/links", label: "Link & akun", Icon: Link2 },
  { to: "/admin/text", label: "Teks halaman", Icon: Type },
  { to: "/admin/sections", label: "Section tambahan", Icon: LayoutTemplate },
  { to: "/admin/settings", label: "Pengaturan", Icon: SettingsIcon },
];

export default function AdminLayout() {
  const { session, loading, signOut, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-mono text-xs text-[var(--text-faint)]">Memeriksa sesi…</p>
      </div>
    );
  }

  // Ini penjagaan tampilan saja. Yang benar-benar mengunci data adalah
  // Row Level Security di sisi database — seseorang yang memaksa masuk ke
  // URL ini tetap tidak bisa membaca draft atau menulis apa pun.
  if (!session) {
    return <Navigate to="/admin" state={{ from: location.pathname }} replace />;
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-32 sm:px-10">
      <header className="flex flex-col gap-4 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight">Panel admin</h1>
          <p className="mt-1 font-mono text-xs text-[var(--text-faint)]">{user?.email}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-4 py-2 text-xs transition-colors hover:border-[var(--border-strong)]"
          >
            Lihat situs <ExternalLink size={13} />
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-4 py-2 text-xs transition-colors hover:border-[#f87171] hover:text-[#f87171]"
          >
            Keluar <LogOut size={13} />
          </button>
        </div>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        <nav className="lg:col-span-3">
          <ul className="flex gap-2 overflow-x-auto pb-2 lg:sticky lg:top-32 lg:flex-col lg:overflow-visible lg:pb-0">
            {navItems.map(({ to, label, Icon }) => (
              <li key={to} className="shrink-0">
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `focus-ring flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm transition-colors ${
                      isActive
                        ? "bg-[var(--surface-2)] text-[var(--text)]"
                        : "text-[var(--text-muted)] hover:text-[var(--text)]"
                    }`
                  }
                >
                  <Icon size={15} />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <main className="min-w-0 lg:col-span-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
