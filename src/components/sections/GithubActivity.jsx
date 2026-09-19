import { useEffect, useState } from "react";
import { BookMarked, Users, GitFork, ExternalLink, RefreshCw } from "lucide-react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { useCursor } from "../../context/CursorContext";
import { useTheme } from "../../context/ThemeContext";
import { useContent } from "../../context/ContentContext";
import { GithubIcon } from "../ui/BrandIcons";
import SectionHeading from "../ui/SectionHeading";
import { site } from "../../data/site";

const CACHE_KEY = "gh-profile-cache";
const CACHE_TTL = 1000 * 60 * 30; // 30 menit — cukup segar, tapi gak spam API tiap kunjungan

/**
 * GitHub tidak punya endpoint publik resmi buat grafik kontribusi (yang
 * hijau-hijau itu perlu login). ghchart.rshah.org adalah proyek open-source
 * pihak ketiga yang merender ulang grafik itu sebagai SVG dari data publik
 * GitHub — tidak perlu API key, dan tidak pernah menyentuh data privat.
 */
function heatmapUrl(username, accentHex) {
  const color = accentHex.replace("#", "");
  return `https://ghchart.rshah.org/${color}/${username}`;
}

/** Baca cache dari sessionStorage kalau masih dalam masa berlaku. */
function readCache(username) {
  try {
    const raw = window.sessionStorage.getItem(`${CACHE_KEY}:${username}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.savedAt > CACHE_TTL) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeCache(username, data) {
  try {
    window.sessionStorage.setItem(
      `${CACHE_KEY}:${username}`,
      JSON.stringify({ savedAt: Date.now(), data })
    );
  } catch {
    // Penyimpanan penuh atau diblokir — bukan masalah besar, cache
    // cuma penghematan, bukan kebutuhan.
  }
}

function StatItem({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-faint)]">
        <Icon size={15} />
      </span>
      <div>
        <p className="text-base font-medium tabular-nums leading-tight">{value ?? "—"}</p>
        <p className="text-xs text-[var(--text-faint)]">{label}</p>
      </div>
    </div>
  );
}

export default function GithubActivity() {
  const containerRef = useScrollReveal();
  const { setCursor, clearCursor } = useCursor();
  const { theme } = useTheme();
  const { settings } = useContent();

  const username =
    settings.githubUsername || site.githubUsername || site.socials.github?.split("/").filter(Boolean).pop();

  const [profile, setProfile] = useState(() => (username ? readCache(username) : null));
  const [status, setStatus] = useState(profile ? "ready" : "loading");
  const [heatmapFailed, setHeatmapFailed] = useState(false);

  async function load() {
    if (!username) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch(`https://api.github.com/users/${username}`);
      if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
      const data = await res.json();
      setProfile(data);
      writeCache(username, data);
      setStatus("ready");
    } catch {
      // Rate limit publik GitHub cuma 60 request/jam per IP. Kalau gagal,
      // section tetap tampil dengan grafik kontribusi saja (yang tidak
      // kena limit itu), bukan menghilang total.
      setStatus(profile ? "ready" : "partial");
    }
  }

  useEffect(() => {
    if (!profile) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  if (!username) return null;

  const accentHex = theme === "light" ? "#0891b2" : "#22d3ee";

  return (
    <section id="github-activity" ref={containerRef} className="relative px-6 py-28 sm:px-10 sm:py-36">
      <div className="mx-auto max-w-[1400px]">
        <div data-reveal className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            index="03"
            label="GitHub"
            title="Code, committed daily."
            description="A live look at what I've been building — pulled straight from GitHub, not a screenshot."
          />

          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setCursor("Open", "label")}
            onMouseLeave={clearCursor}
            className="focus-ring group mb-1 inline-flex items-center gap-2 text-sm text-[var(--text-faint)] transition-colors duration-300 hover:text-[var(--text)]"
          >
            <GithubIcon size={15} />
            @{username}
            <ExternalLink
              size={13}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>

        <div data-reveal className="mt-14 rounded-2xl border border-[var(--border)] p-6 sm:p-8">
          {/* Profil ringkas: foto, bio, dan tiga angka publik. Dilewati
              kalau API sedang kena rate limit, supaya heatmap-nya (yang
              tidak kena limit) tetap bisa tampil sendirian. */}
          {status !== "partial" && (
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {status === "ready" && profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.login}
                    className="h-14 w-14 shrink-0 rounded-full border border-[var(--border)]"
                  />
                ) : (
                  <span className="flex h-14 w-14 shrink-0 animate-pulse items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-1)]" />
                )}

                <div className="min-w-0">
                  {status === "ready" ? (
                    <>
                      <p className="truncate text-base font-medium">
                        {profile?.name || profile?.login}
                      </p>
                      {profile?.bio && (
                        <p className="mt-0.5 max-w-[42ch] truncate text-sm text-[var(--text-faint)]">
                          {profile.bio}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <span className="h-4 w-32 animate-pulse rounded bg-[var(--surface-1)]" />
                      <span className="h-3 w-48 animate-pulse rounded bg-[var(--surface-1)]" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <StatItem icon={BookMarked} value={profile?.public_repos} label="Repos" />
                <StatItem icon={Users} value={profile?.followers} label="Followers" />
                <StatItem icon={GitFork} value={profile?.public_gists} label="Gists" />
              </div>
            </div>
          )}

          {status === "error" && (
            <p className="text-sm text-[var(--text-faint)]">
              Couldn't reach GitHub right now.{" "}
              <button
                type="button"
                onClick={load}
                className="focus-ring inline-flex items-center gap-1 text-[var(--text)] underline-offset-4 hover:underline"
              >
                <RefreshCw size={12} /> Try again
              </button>
            </p>
          )}

          {status !== "error" && (
            <div className={status !== "partial" ? "mt-8 border-t border-[var(--border)] pt-8" : ""}>
              {!heatmapFailed ? (
                <div className="overflow-x-auto">
                  <img
                    src={heatmapUrl(username, accentHex)}
                    alt={`${username}'s GitHub contribution graph`}
                    loading="lazy"
                    onError={() => setHeatmapFailed(true)}
                    className="h-auto min-w-[640px]"
                  />
                </div>
              ) : (
                <p className="text-sm text-[var(--text-faint)]">
                  Contribution graph is unavailable right now — check the profile link above instead.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
