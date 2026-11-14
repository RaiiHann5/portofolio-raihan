import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookMarked,
  Users,
  UserPlus,
  GitFork,
  Star,
  MapPin,
  CalendarDays,
  Flame,
  Trophy,
  Zap,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { useCursor } from "../../context/CursorContext";
import { useTheme } from "../../context/ThemeContext";
import { useContent } from "../../context/ContentContext";
import { useLanguage } from "../../context/LanguageContext";
import { GithubIcon } from "../ui/BrandIcons";
import SectionHeading from "../ui/SectionHeading";
import SpotlightCard from "../ui/SpotlightCard";
import { site } from "../../data/site";

const CACHE_KEY = "gh-data-v2";
const CACHE_TTL = 1000 * 60 * 30; // 30 menit — segar, tapi tidak membebani API tiap kunjungan

/* ------------------------------------------------------------------ */
/* Cache (sessionStorage)                                             */
/* ------------------------------------------------------------------ */

function readCache(username) {
  try {
    const raw = window.sessionStorage.getItem(`${CACHE_KEY}:${username}`);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.savedAt > CACHE_TTL) return {};
    return parsed.data || {};
  } catch {
    return {};
  }
}

function writeCache(username, data) {
  try {
    window.sessionStorage.setItem(
      `${CACHE_KEY}:${username}`,
      JSON.stringify({ savedAt: Date.now(), data })
    );
  } catch {
    // Penyimpanan penuh/diblokir: cache cuma penghematan, bukan kebutuhan.
  }
}

/* ------------------------------------------------------------------ */
/* Data                                                               */
/* ------------------------------------------------------------------ */

/**
 * GitHub tidak punya endpoint publik resmi untuk grafik kontribusi.
 * github-contributions-api (open source, tanpa API key) mengembalikannya
 * sebagai JSON dari data publik, jadi grafiknya bisa kita gambar sendiri
 * dengan warna tema situs. Kalau gagal, jatuh ke gambar SVG ghchart.
 */
async function fetchGraph(username) {
  const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
  if (!res.ok) throw new Error(`contrib ${res.status}`);
  const json = await res.json();
  const days = (json.contributions || []).map((d) => ({
    date: d.date,
    count: d.count,
    level: d.level,
  }));
  if (!days.length) throw new Error("contrib empty");
  days.sort((a, b) => a.date.localeCompare(b.date));
  return { days, total: json.total?.lastYear ?? days.reduce((s, d) => s + d.count, 0) };
}

/** Susun hari-hari jadi kolom minggu (Minggu di baris pertama). */
function buildWeeks(days) {
  const weeks = [];
  let week = [];
  const firstDow = new Date(`${days[0].date}T00:00:00`).getDay();
  for (let i = 0; i < firstDow; i += 1) week.push(null);
  for (const d of days) {
    week.push(d);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

function computeStats(days) {
  let longest = 0;
  let run = 0;
  let busiest = null;
  for (const d of days) {
    if (d.count > 0) {
      run += 1;
      longest = Math.max(longest, run);
    } else {
      run = 0;
    }
    if (!busiest || d.count > busiest.count) busiest = d;
  }
  // Hari ini belum tentu sudah ada commit; jangan putuskan streak karenanya.
  let i = days.length - 1;
  if (days[i]?.count === 0) i -= 1;
  let current = 0;
  while (i >= 0 && days[i].count > 0) {
    current += 1;
    i -= 1;
  }
  return { longest, current, busiest };
}

const LANG_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#7c5cff",
  PHP: "#8892bf",
  Blade: "#f7523f",
  Python: "#3572A5",
  Java: "#b07219",
  Vue: "#41b883",
  Dart: "#00B4AB",
  Kotlin: "#A97BFF",
  "C++": "#f34b7d",
  C: "#8a8a8a",
  "C#": "#178600",
  Shell: "#89e051",
  Lua: "#5b6bf0",
};
const langColor = (name) => LANG_COLORS[name] || "var(--accent-2)";

function formatDay(iso, lang) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/* Potongan UI                                                        */
/* ------------------------------------------------------------------ */

function StatTile({ icon: Icon, value, label }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-[var(--border)] px-4 py-3.5">
      <Icon size={14} className="text-[var(--accent-1)]" />
      <p className="mt-1 font-display text-2xl font-medium leading-none tabular-nums">
        {value ?? "—"}
      </p>
      <p className="text-xs text-[var(--text-faint)]">{label}</p>
    </div>
  );
}

function Skeleton({ className = "" }) {
  return <span className={`block animate-pulse rounded bg-[var(--surface-2)] ${className}`} />;
}

const LEVEL_MIX = [null, 30, 52, 76, 100];
function cellColor(level) {
  const mix = LEVEL_MIX[level];
  return mix
    ? `color-mix(in srgb, var(--accent-1) ${mix}%, transparent)`
    : "color-mix(in srgb, var(--text) 8%, transparent)";
}

function Heatmap({ graph, hover, setHover, lang, t }) {
  const scrollRef = useRef(null);
  const weeks = useMemo(() => buildWeeks(graph.days), [graph]);

  // Posisikan ke minggu terbaru (kanan) — penting di layar sempit.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [weeks]);

  // Label bulan: muncul saat bulan berganti, minimal berjarak 3 kolom.
  const months = useMemo(() => {
    const out = [];
    let lastMonth = -1;
    let lastIdx = -10;
    weeks.forEach((w, i) => {
      const first = w.find(Boolean);
      if (!first) return;
      const m = new Date(`${first.date}T00:00:00`).getMonth();
      if (m !== lastMonth && i - lastIdx >= 3) {
        out.push({ i, label: new Date(`${first.date}T00:00:00`).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", { month: "short" }) });
        lastIdx = i;
      }
      lastMonth = m;
    });
    return out;
  }, [weeks, lang]);

  const CELL = 12;
  const GAP = 3;
  const dayLabels = lang === "id" ? ["", "Sen", "", "Rab", "", "Jum", ""] : ["", "Mon", "", "Wed", "", "Fri", ""];

  return (
    <div className="flex gap-2">
      <div
        aria-hidden
        className="grid shrink-0 pt-[22px] text-[10px] text-[var(--text-faint)]"
        style={{ gridTemplateRows: `repeat(7, ${CELL}px)`, rowGap: GAP }}
      >
        {dayLabels.map((d, i) => (
          <span key={i} className="leading-[12px]">
            {d}
          </span>
        ))}
      </div>

      <div ref={scrollRef} className="gh-scroll min-w-0 flex-1 overflow-x-auto pb-2">
        <div style={{ width: weeks.length * (CELL + GAP) }}>
          <div className="relative h-[22px]" aria-hidden>
            {months.map((m) => (
              <span
                key={m.i}
                className="absolute top-0 text-[10px] text-[var(--text-faint)]"
                style={{ left: m.i * (CELL + GAP) }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div
            role="img"
            aria-label={`${graph.total} ${t("github.contributions")}`}
            className="grid"
            style={{
              gridAutoFlow: "column",
              gridTemplateRows: `repeat(7, ${CELL}px)`,
              gridAutoColumns: `${CELL}px`,
              gap: GAP,
            }}
          >
            {weeks.map((week, ci) =>
              week.map((d, ri) =>
                d ? (
                  <span
                    key={d.date}
                    className="gh-cell rounded-[3px]"
                    title={`${d.count} — ${formatDay(d.date, lang)}`}
                    onMouseEnter={() => setHover(d)}
                    onMouseLeave={() => setHover(null)}
                    style={{ background: cellColor(d.level), "--c": ci }}
                  />
                ) : (
                  <span key={`e-${ci}-${ri}`} />
                )
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RepoCard({ repo, t }) {
  return (
    <SpotlightCard
      as="li"
      className="group/repo flex flex-col rounded-2xl border border-[var(--border)] transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-[var(--border-strong)]"
      style={{ background: "var(--card-bg)" }}
    >
      <a
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="focus-ring flex h-full flex-col gap-3 p-5"
      >
        <div className="flex items-center justify-between gap-3">
          <span className="flex min-w-0 items-center gap-2 text-sm font-medium">
            <BookMarked size={14} className="shrink-0 text-[var(--accent-1)]" />
            <span className="truncate">{repo.name}</span>
          </span>
          <ExternalLink
            size={13}
            className="shrink-0 text-[var(--text-faint)] transition-colors group-hover/repo:text-[var(--accent-1)]"
          />
        </div>
        <p className="line-clamp-2 min-h-[2.5rem] text-xs leading-relaxed text-[var(--text-muted)]">
          {repo.description || t("github.noDesc")}
        </p>
        <div className="mt-auto flex items-center gap-4 pt-1 text-xs text-[var(--text-faint)]">
          {repo.language && (
            <span className="inline-flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: langColor(repo.language) }}
              />
              {repo.language}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Star size={12} /> {repo.stargazers_count}
          </span>
          <span className="inline-flex items-center gap-1">
            <GitFork size={12} /> {repo.forks_count}
          </span>
        </div>
      </a>
    </SpotlightCard>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                            */
/* ------------------------------------------------------------------ */

export default function GithubActivity() {
  const containerRef = useScrollReveal();
  const { setCursor, clearCursor } = useCursor();
  const { theme } = useTheme();
  const { settings } = useContent();
  const { t, lang } = useLanguage();

  const username =
    settings.githubUsername || site.githubUsername || site.socials.github?.split("/").filter(Boolean).pop();

  const [data, setData] = useState(() => (username ? readCache(username) : {}));
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState({}); // { profile, repos, graph }
  const [hover, setHover] = useState(null);
  const [graphImgFailed, setGraphImgFailed] = useState(false);
  const dataRef = useRef(data);
  dataRef.current = data;

  // Hanya mengambil bagian yang belum ada. Tiap bagian gagal sendiri-sendiri,
  // jadi rate limit API GitHub tidak mematikan grafik kontribusi.
  async function load() {
    if (!username) return;
    const have = dataRef.current;
    const jobs = {};
    if (!have.profile)
      jobs.profile = fetch(`https://api.github.com/users/${username}`).then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      });
    if (!have.repos)
      jobs.repos = fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`).then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      });
    if (!have.graph) jobs.graph = fetchGraph(username);
    const keys = Object.keys(jobs);
    if (!keys.length) return;

    setLoading(true);
    const results = await Promise.allSettled(keys.map((k) => jobs[k]));
    const next = { ...have };
    const nextFailed = {};
    results.forEach((r, i) => {
      if (r.status === "fulfilled") next[keys[i]] = r.value;
      else nextFailed[keys[i]] = true;
    });
    setData(next);
    setFailed(nextFailed);
    writeCache(username, next);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const { profile, repos, graph } = data;

  const topRepos = useMemo(() => {
    if (!Array.isArray(repos)) return [];
    return repos
      .filter((r) => !r.fork)
      .sort(
        (a, b) =>
          b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at)
      )
      .slice(0, 4);
  }, [repos]);

  const languages = useMemo(() => {
    if (!Array.isArray(repos)) return [];
    const count = {};
    repos.filter((r) => !r.fork && r.language).forEach((r) => {
      count[r.language] = (count[r.language] || 0) + 1;
    });
    const total = Object.values(count).reduce((a, b) => a + b, 0);
    return Object.entries(count)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, n]) => ({ name, pct: Math.round((n / total) * 100) }));
  }, [repos]);

  const stats = useMemo(() => (graph ? computeStats(graph.days) : null), [graph]);

  if (!username) return null;

  const accentHex = theme === "light" ? "#0891b2" : "#22d3ee";
  const anyFailed = Object.keys(failed).length > 0;
  const joined = profile?.created_at ? new Date(profile.created_at).getFullYear() : null;
  const profileUrl = profile?.html_url || `https://github.com/${username}`;

  return (
    <section id="github-activity" ref={containerRef} className="relative px-6 py-28 sm:px-10 sm:py-36">
      <div className="mx-auto max-w-[1400px]">
        <div data-reveal className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            index="07"
            label={t("github.label")}
            title={t("github.title")}
            description={t("github.description")}
          />
        </div>

        <div data-reveal className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* ---------------- Kartu profil ---------------- */}
          <SpotlightCard
            className="flex flex-col rounded-2xl border border-[var(--border)] p-6 sm:p-8 lg:col-span-4"
            style={{ background: "var(--card-bg)" }}
          >
            <div className="flex items-center gap-4">
              <span
                className="shrink-0 rounded-full p-[3px]"
                style={{ background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))" }}
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.login}
                    className="h-[68px] w-[68px] rounded-full border-2 border-[var(--card-bg)] object-cover"
                  />
                ) : (
                  <span className="flex h-[68px] w-[68px] items-center justify-center rounded-full border-2 border-[var(--card-bg)] bg-[var(--surface-2)] text-[var(--text-faint)]">
                    <GithubIcon size={26} />
                  </span>
                )}
              </span>
              <div className="min-w-0">
                {profile ? (
                  <>
                    <p className="truncate font-display text-xl font-medium leading-tight">
                      {profile.name || profile.login}
                    </p>
                    <p className="truncate font-mono text-xs text-[var(--text-faint)]">@{profile.login}</p>
                  </>
                ) : loading ? (
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                ) : (
                  <p className="truncate font-display text-xl font-medium leading-tight">@{username}</p>
                )}
              </div>
            </div>

            {profile?.bio && (
              <p className="mt-5 text-sm leading-relaxed text-[var(--text-muted)]">{profile.bio}</p>
            )}

            {(profile?.location || joined) && (
              <ul className="mt-5 flex list-none flex-col gap-2 p-0 text-xs text-[var(--text-faint)]">
                {profile?.location && (
                  <li className="flex items-center gap-2">
                    <MapPin size={13} /> {profile.location}
                  </li>
                )}
                {joined && (
                  <li className="flex items-center gap-2">
                    <CalendarDays size={13} /> {t("github.joined")} {joined}
                  </li>
                )}
              </ul>
            )}

            <div className="mt-6 grid grid-cols-2 gap-3">
              <StatTile icon={BookMarked} value={profile?.public_repos} label={t("github.repos")} />
              <StatTile icon={Users} value={profile?.followers} label={t("github.followers")} />
              <StatTile icon={UserPlus} value={profile?.following} label={t("github.following")} />
              <StatTile icon={GitFork} value={profile?.public_gists} label={t("github.gists")} />
            </div>

            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setCursor(t("cursor.open"), "label")}
              onMouseLeave={clearCursor}
              className="focus-ring mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--text)] px-5 py-3 text-sm font-medium text-[var(--bg)] transition-opacity hover:opacity-90"
            >
              <GithubIcon size={15} />
              {t("github.follow")}
              <ExternalLink size={13} />
            </a>
          </SpotlightCard>

          {/* ---------------- Grafik kontribusi ---------------- */}
          <SpotlightCard
            className="flex min-w-0 flex-col rounded-2xl border border-[var(--border)] p-6 sm:p-8 lg:col-span-8"
            style={{ background: "var(--card-bg)" }}
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                {graph ? (
                  <p className="font-display text-4xl font-medium leading-none tabular-nums sm:text-5xl">
                    {graph.total.toLocaleString(lang === "id" ? "id-ID" : "en-US")}
                  </p>
                ) : (
                  <Skeleton className="h-10 w-28" />
                )}
                <p className="mt-2 text-sm text-[var(--text-muted)]">{t("github.contributions")}</p>
              </div>
              <p
                aria-live="polite"
                className="min-h-[1.25rem] font-mono text-xs text-[var(--accent-1)]"
              >
                {hover ? `${hover.count} · ${formatDay(hover.date, lang)}` : ""}
              </p>
            </div>

            <div className="mt-6">
              {graph ? (
                <Heatmap graph={graph} hover={hover} setHover={setHover} lang={lang} t={t} />
              ) : failed.graph ? (
                !graphImgFailed ? (
                  <div className="overflow-x-auto">
                    <img
                      src={`https://ghchart.rshah.org/${accentHex.replace("#", "")}/${username}`}
                      alt={`${t("github.graphAlt")} ${username}`}
                      loading="lazy"
                      onError={() => setGraphImgFailed(true)}
                      className="h-auto min-w-[640px]"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-[var(--text-faint)]">{t("github.graphUnavailable")}</p>
                )
              ) : (
                <Skeleton className="h-[130px] w-full" />
              )}
            </div>

            {graph && (
              <div className="mt-3 flex items-center justify-end gap-2 text-[10px] text-[var(--text-faint)]">
                {t("github.less")}
                {[0, 1, 2, 3, 4].map((l) => (
                  <span
                    key={l}
                    className="h-3 w-3 rounded-[3px]"
                    style={{ background: cellColor(l) }}
                  />
                ))}
                {t("github.more")}
              </div>
            )}

            {stats && (
              <div className="mt-6 grid grid-cols-1 gap-3 border-t border-[var(--border)] pt-6 sm:grid-cols-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--accent-1)]">
                    <Flame size={17} />
                  </span>
                  <div>
                    <p className="text-lg font-medium leading-tight tabular-nums">
                      {stats.current} <span className="text-xs font-normal text-[var(--text-faint)]">{t("github.days")}</span>
                    </p>
                    <p className="text-xs text-[var(--text-faint)]">{t("github.currentStreak")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--accent-1)]">
                    <Trophy size={17} />
                  </span>
                  <div>
                    <p className="text-lg font-medium leading-tight tabular-nums">
                      {stats.longest} <span className="text-xs font-normal text-[var(--text-faint)]">{t("github.days")}</span>
                    </p>
                    <p className="text-xs text-[var(--text-faint)]">{t("github.longestStreak")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--accent-1)]">
                    <Zap size={17} />
                  </span>
                  <div>
                    <p className="text-lg font-medium leading-tight tabular-nums">
                      {stats.busiest?.count ?? 0}{" "}
                      <span className="text-xs font-normal text-[var(--text-faint)]">
                        {stats.busiest?.count ? `· ${formatDay(stats.busiest.date, lang)}` : ""}
                      </span>
                    </p>
                    <p className="text-xs text-[var(--text-faint)]">{t("github.busiestDay")}</p>
                  </div>
                </div>
              </div>
            )}
          </SpotlightCard>
        </div>

        {/* ---------------- Bahasa & repositori ---------------- */}
        {(topRepos.length > 0 || languages.length > 0) && (
          <div data-reveal className="mt-5">
            {languages.length > 0 && (
              <div
                className="rounded-2xl border border-[var(--border)] p-6 sm:p-8"
                style={{ background: "var(--card-bg)" }}
              >
                <p className="eyebrow mb-4">{t("github.languages")}</p>
                <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[var(--surface-2)]">
                  {languages.map((l) => (
                    <span
                      key={l.name}
                      title={`${l.name} ${l.pct}%`}
                      style={{ width: `${l.pct}%`, background: langColor(l.name) }}
                    />
                  ))}
                </div>
                <ul className="mt-4 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 text-xs text-[var(--text-muted)]">
                  {languages.map((l) => (
                    <li key={l.name} className="inline-flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: langColor(l.name) }} />
                      {l.name}
                      <span className="font-mono text-[var(--text-faint)]">{l.pct}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {topRepos.length > 0 && (
              <>
                <p className="eyebrow mb-4 mt-10">{t("github.topRepos")}</p>
                <ul className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
                  {topRepos.map((r) => (
                    <RepoCard key={r.id} repo={r} t={t} />
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        {anyFailed && !loading && (
          <p className="mt-6 text-sm text-[var(--text-faint)]">
            {t("github.unreachable")}{" "}
            <button
              type="button"
              onClick={load}
              className="focus-ring inline-flex items-center gap-1 text-[var(--text)] underline-offset-4 hover:underline"
            >
              <RefreshCw size={12} /> {t("github.retry")}
            </button>
          </p>
        )}
      </div>

      <style>{`
        .gh-scroll { scrollbar-width: thin; }
        .gh-cell {
          animation: gh-pop 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
          animation-delay: calc(var(--c) * 9ms);
          transition: transform 0.15s ease, outline-color 0.15s ease;
          outline: 1.5px solid transparent;
        }
        .gh-cell:hover { transform: scale(1.35); outline-color: var(--accent-1); position: relative; z-index: 1; }
        @keyframes gh-pop {
          from { opacity: 0; transform: scale(0.4); }
          to { opacity: 1; transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .gh-cell { animation: none; }
        }
      `}</style>
    </section>
  );
}
