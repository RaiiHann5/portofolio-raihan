import { useState, useEffect, useMemo } from "react";
import { useMagnetic } from "../../hooks/useMagnetic";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { useCursor } from "../../context/CursorContext";
import SectionHeading from "../ui/SectionHeading";
import { beyondCode } from "../../data/beyondCode";

const ACCENTS = ["#e8836a", "#f0c14b", "#6ea8c9", "#a58bd6", "#7fb88a"];
const seededRotation = (id, spread = 3) => (((id * 37) % (spread * 2 + 1)) - spread);
const clamp = (n, min = 0, max = 1) => Math.max(min, Math.min(max, n));

/* ---------------------------------- icons --------------------------------- */

function Icon({ name, className = "h-4 w-4" }) {
  const p = { className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "play": return <svg {...p} fill="currentColor" stroke="none"><path d="M7 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 7 5.5Z" /></svg>;
    case "pause": return <svg {...p} fill="currentColor" stroke="none"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>;
    case "heart": return <svg {...p}><path d="M12 20s-7.2-4.5-9.7-8.9C.6 8 1.6 4.7 4.6 3.7c2-.7 4 0 5.4 1.8 1.4-1.8 3.4-2.5 5.4-1.8 3 1 4 4.3 2.3 7.4C19.2 15.5 12 20 12 20Z" /></svg>;
    case "heartFilled": return <svg {...p} fill="currentColor" stroke="none"><path d="M12 20s-7.2-4.5-9.7-8.9C.6 8 1.6 4.7 4.6 3.7c2-.7 4 0 5.4 1.8 1.4-1.8 3.4-2.5 5.4-1.8 3 1 4 4.3 2.3 7.4C19.2 15.5 12 20 12 20Z" /></svg>;
    case "pin": return <svg {...p} fill="currentColor" stroke="none"><path d="M13 2 22 11l-3.5 1-3 3 1 6-3-3-5 5-1-3-5 1 5-5-3-3 6-1Z" transform="scale(0.55) translate(9,9)" /></svg>;
    case "chevron": return <svg {...p}><path d="m8 10 4 4 4-4" /></svg>;
    case "star": return <svg {...p} fill="currentColor" stroke="none"><path d="M12 2.75l2.6 5.6 6.15.63-4.6 4.2 1.3 6.07L12 16.1l-5.45 3.15 1.3-6.07-4.6-4.2 6.15-.63L12 2.75Z" /></svg>;
    default: return null;
  }
}

/* ------------------------------- theme toggle ------------------------------- */

function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";
  return (
    <button
      onClick={onToggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="group relative flex h-9 w-16 items-center rounded-full border border-[var(--border)] bg-[var(--surface-1)] px-1 transition-colors duration-300 hover:border-[var(--border-strong)]"
    >
      <span
        className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-2)] text-[10px] font-medium text-[var(--text-primary)] shadow-sm transition-transform duration-300 ease-out"
        style={{ transform: isDark ? "translateX(26px)" : "translateX(0px)" }}
      >
        {isDark ? "🌙" : "☀"}
      </span>
    </button>
  );
}

/* --------------------------------- pin note --------------------------------- */

function PickForMeNote({ onRoll, rolling, pickLabel }) {
  return (
    <button
      onClick={onRoll}
      disabled={rolling}
      className="bx-font-mono relative rotate-[-2deg] rounded-sm border border-[var(--border)] bg-[var(--surface-1)] px-4 py-2.5 text-left text-[11px] uppercase tracking-wide text-[var(--text-secondary)] shadow-sm transition-all duration-300 hover:rotate-0 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-md disabled:opacity-70"
    >
      <span
        className="absolute -top-2 left-1/2 h-4 w-8 -translate-x-1/2 rotate-[-3deg] rounded-[1px] opacity-80"
        style={{ background: "#f0c14b" }}
        aria-hidden="true"
      />
      <span className={`block ${rolling ? "animate-[wiggle_0.5s_ease-in-out]" : ""}`}>
        {pickLabel ? (
          <>
            tonight: <span className="text-[var(--text-primary)]">{pickLabel}</span>
          </>
        ) : (
          "pick something for me →"
        )}
      </span>
    </button>
  );
}

/* ------------------------------ top music list ------------------------------ */

function TrackRow({ track, index, picked, isOpen, onToggle }) {
  const ref = useMagnetic(0.03);

  return (
    <div
      id={`beyond-music-${track.id}`}
      ref={ref}
      data-reveal
      className={`relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-1)] transition-colors duration-300 hover:border-[var(--border-strong)] ${picked ? "animate-[pick-glow_1.4s_ease-in-out]" : ""}`}
    >
      {picked && (
        <Icon name="pin" className="absolute -top-3 left-6 z-20 h-6 w-6 text-[#e8836a] drop-shadow animate-[pop-in_0.35s_ease-out]" />
      )}
      <button onClick={onToggle} className="flex w-full items-center gap-4 px-4 py-3 text-left">
        <span className="bx-font-mono w-5 shrink-0 text-[11px] text-[var(--text-secondary)]">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div
          className="h-10 w-10 shrink-0 overflow-hidden rounded-md"
          style={{ background: track.art ? undefined : ACCENTS[index % ACCENTS.length] }}
        >
          {track.art && <img src={track.art} alt={track.track} className="h-full w-full object-cover" />}
        </div>

        <div className="min-w-0 flex-1">
          <p className="bx-font-display truncate text-sm font-semibold text-[var(--text-primary)]">{track.track}</p>
          <p className="truncate text-xs text-[var(--text-secondary)]">{track.artist}</p>
        </div>

        <span className="bx-font-mono hidden shrink-0 text-[11px] text-[var(--text-secondary)] sm:block">{track.duration}</span>

        <Icon name="chevron" className={`h-4 w-4 shrink-0 text-[var(--text-secondary)] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Spotify embed player — tinggi iframe compact ~80px */}
      <div className="overflow-hidden transition-[max-height] duration-300 ease-out" style={{ maxHeight: isOpen ? "96px" : "0px" }}>
        <div className="border-t border-[var(--border)] px-3 py-2.5">
          {track.spotifyId ? (
            <iframe
              key={track.spotifyId}
              src={`https://open.spotify.com/embed/track/${track.spotifyId}?utm_source=generator&theme=0`}
              width="100%"
              height="80"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title={`${track.track} - ${track.artist}`}
            />
          ) : (
            <p className="bx-font-mono px-1 py-3 text-[11px] text-[var(--text-secondary)]">
              No Spotify link yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function TopMusicList({ tracks, picked }) {
  const [openId, setOpenId] = useState(null);
  const mid = Math.ceil(tracks.length / 2);
  const columns = [tracks.slice(0, mid), tracks.slice(mid)];

  return (
    <div data-reveal className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-x-5">
      {columns.map((col, colIndex) => (
        <div key={colIndex} className="flex flex-col gap-2.5">
          {col.map((track, i) => {
            const index = colIndex * mid + i;
            return (
              <TrackRow
                key={track.id}
                track={track}
                index={index}
                picked={picked?.type === "music" && picked.id === track.id}
                isOpen={openId === track.id}
                onToggle={() => setOpenId((cur) => (cur === track.id ? null : track.id))}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------- game cartridge ------------------------------ */

function useCountUp(target, active, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = clamp((now - start) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return value;
}

function GameCartridge({ game, picked }) {
  const ref = useMagnetic(0.06);
  const { setCursor, clearCursor } = useCursor();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const isPlaying = game.status === "Playing";
  const completion = game.completion ?? (game.status === "Completed" ? 100 : isPlaying ? Math.min(100, Math.round((game.hours / 60) * 100)) : 0);
  const hours = useCountUp(game.hours ?? 0, hovered && isPlaying);
  const hasImage = Boolean(game.image);

  return (
    <div
      id={`beyond-game-${game.id}`}
      ref={ref}
      data-reveal
      className="relative w-[168px] shrink-0 snap-center"
      style={{ transform: `rotate(${hovered ? 0 : seededRotation(game.id, 2)}deg)`, transition: "transform 0.3s ease" }}
    >
      {picked && (
        <Icon name="pin" className="absolute -top-4 left-1/2 z-20 h-8 w-8 -translate-x-1/2 text-[#e8836a] drop-shadow animate-[pop-in_0.35s_ease-out]" />
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => { setHovered(true); setCursor("Peek", "view"); }}
        onMouseLeave={() => { setHovered(false); clearCursor(); }}
        className={`group relative flex aspect-[3/4] w-full flex-col justify-between overflow-hidden rounded-xl border-2 p-4 text-left shadow-sm transition-shadow duration-300 hover:shadow-lg ${picked ? "animate-[pick-glow_1.4s_ease-in-out]" : ""}`}
        style={{
          background: hasImage ? `url(${game.image}) center/cover no-repeat` : game.cover,
          borderColor: "rgba(0,0,0,0.25)",
        }}
      >
        {hasImage && <div className="absolute inset-0 bg-black/35" aria-hidden="true" />}
        {game.status === "Backlog" && (
          <div className="absolute inset-2 rounded-lg border border-dashed border-white/25" aria-hidden="true" />
        )}
        {isPlaying && (
          <span className="bx-font-mono absolute right-0 top-3 z-10 rounded-l-full bg-white/90 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-black">
            playing
          </span>
        )}
        {game.status === "Completed" && (
          <span className="absolute right-3 top-3 z-10 text-white/80">✓</span>
        )}

        <span className="bx-font-mono relative z-10 text-[9px] uppercase tracking-widest text-white/50">{game.status}</span>

        <div className="relative z-10">
          <h3 className="bx-font-display text-base font-semibold leading-tight text-white">{game.title}</h3>
          {isPlaying && <p className="mt-1 text-[11px] text-white/60">{hours}h played</p>}
          <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-white/80 transition-[width] duration-700" style={{ width: `${completion}%` }} />
          </div>
        </div>
      </button>

      <div
        className="overflow-hidden rounded-b-xl border border-t-0 border-[var(--border)] bg-[var(--surface-1)] transition-[max-height] duration-300 ease-out"
        style={{ maxHeight: open ? "9rem" : "0px" }}
      >
        <div className="bx-font-mono p-4 text-[11px] leading-relaxed text-[var(--text-secondary)]">
          <p className="text-[var(--text-primary)]">{game.genre ?? "Genre unknown"}</p>
          <p className="mt-1">{game.note ?? "No notes on this one yet."}</p>
          <p className="mt-2 text-[10px] opacity-70">last played · {game.lastPlayed ?? "—"}</p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- movie ticket -------------------------------- */

function MovieTicket({ movie, picked }) {
  const ref = useMagnetic(0.06);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const hasImage = Boolean(movie.image);

  return (
    <div
      id={`beyond-movie-${movie.id}`}
      ref={ref}
      data-reveal
      className="relative w-[236px] shrink-0 snap-center"
      style={{ transform: `rotate(${hovered ? 0 : seededRotation(movie.id + 11, 2)}deg)`, transition: "transform 0.3s ease" }}
    >
      {picked && (
        <Icon name="pin" className="absolute -top-4 left-1/2 z-20 h-8 w-8 -translate-x-1/2 text-[#e8836a] drop-shadow animate-[pop-in_0.35s_ease-out]" />
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`group relative flex h-[92px] w-full overflow-hidden rounded-lg border-2 text-left shadow-sm transition-shadow duration-300 hover:shadow-lg ${picked ? "animate-[pick-glow_1.4s_ease-in-out]" : ""}`}
        style={{ borderColor: "rgba(0,0,0,0.25)" }}
      >
        <div
          className="relative flex flex-1 flex-col justify-between p-3"
          style={{ background: hasImage ? `url(${movie.image}) center/cover no-repeat` : movie.poster }}
        >
          {hasImage && <div className="absolute inset-0 bg-black/30" aria-hidden="true" />}
          <span className="bx-font-mono relative z-10 text-[9px] uppercase tracking-widest text-white/50">{movie.status}</span>
          <div className="relative z-10">
            <h3 className="bx-font-display truncate text-sm font-semibold leading-tight text-white">{movie.title}</h3>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-[10px] text-white/60">{movie.year}</span>
              {movie.rating > 0 && (
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} name="star" className={`h-2.5 w-2.5 ${i < movie.rating ? "text-[#f0c14b]" : "text-white/20"}`} />
                  ))}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex w-9 shrink-0 items-center justify-center border-l border-dashed border-black/20 bg-black/10">
          <span className="bx-font-mono [writing-mode:vertical-rl] text-[8px] uppercase tracking-[0.2em] text-white/70">admit one</span>
        </div>
      </button>

      <div
        className="overflow-hidden rounded-b-lg border border-t-0 border-[var(--border)] bg-[var(--surface-1)] transition-[max-height] duration-300 ease-out"
        style={{ maxHeight: open ? "6rem" : "0px" }}
      >
        <div className="bx-font-mono p-3 text-[11px] leading-relaxed text-[var(--text-secondary)]">
          <p>{movie.note ?? "No notes on this one yet."}</p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- hobby polaroid ------------------------------ */

function HobbyPolaroid({ hobby, index, picked }) {
  const ref = useMagnetic(0.05);
  const [open, setOpen] = useState(false);
  const facts = hobby.facts && hobby.facts.length ? hobby.facts : [hobby.blurb];
  const [factIndex, setFactIndex] = useState(0);
  const color = hobby.color ?? ACCENTS[index % ACCENTS.length];
  const rotation = seededRotation(hobby.id ?? index, 4);
  const hasImage = Boolean(hobby.image);

  return (
    <div
      id={`beyond-hobby-${hobby.id}`}
      ref={ref}
      data-reveal
      className="relative"
      style={{ transform: `rotate(${rotation}deg)`, transition: "transform 0.3s ease" }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "rotate(0deg) translateY(-3px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = `rotate(${rotation}deg)`)}
    >
      <span
        className="absolute -top-3 left-1/2 z-10 h-5 w-10 -translate-x-1/2 rotate-[-4deg] rounded-[1px] opacity-70"
        style={{ background: ACCENTS[(index + 2) % ACCENTS.length] }}
        aria-hidden="true"
      />
      {picked && (
        <Icon name="pin" className="absolute -top-5 left-1/2 z-20 h-7 w-7 -translate-x-1/2 text-[#e8836a] drop-shadow animate-[pop-in_0.35s_ease-out]" />
      )}
      <button
        onClick={() => (open ? setFactIndex((i) => (i + 1) % facts.length) : setOpen(true))}
        className={`block w-full rounded-sm border border-[var(--border)] bg-[var(--surface-1)] p-2.5 pb-4 text-left shadow-sm transition-shadow duration-300 hover:shadow-md ${picked ? "animate-[pick-glow_1.4s_ease-in-out]" : ""}`}
      >
        <div
          className="flex aspect-square items-center justify-center overflow-hidden rounded-[2px] text-3xl"
          style={{ background: hasImage ? undefined : color }}
        >
          {hasImage ? (
            <img src={hobby.image} alt={hobby.label} className="h-full w-full object-cover" />
          ) : (
            hobby.icon
          )}
        </div>
        <div className="mt-2.5">
          <h4 className="bx-font-display text-sm font-semibold text-[var(--text-primary)]">{hobby.label}</h4>
          <p
            key={factIndex}
            className="mt-1 animate-[fade-slide_0.25s_ease-out] overflow-hidden text-xs leading-relaxed text-[var(--text-secondary)] transition-all duration-300"
            style={{ maxHeight: open ? "4rem" : "0px", opacity: open ? 1 : 0 }}
          >
            {facts[factIndex]}
          </p>
          {open && facts.length > 1 && (
            <div className="mt-1.5 flex gap-1">
              {facts.map((_, i) => (
                <span key={i} className="h-1 w-1 rounded-full transition-colors" style={{ background: i === factIndex ? "var(--text-primary)" : "var(--border)" }} />
              ))}
            </div>
          )}
        </div>
      </button>
    </div>
  );
}

/* ------------------------------------ stat strip ------------------------------ */

function StatStrip({ games, movies, topTrack }) {
  const [inView, setInView] = useState(false);
  const totalHours = useMemo(() => games.reduce((sum, g) => sum + (g.hours || 0), 0), [games]);
  const backlogCount = useMemo(() => games.filter((g) => g.status === "Backlog").length, [games]);
  const watchlistCount = useMemo(() => movies.filter((m) => m.status === "Watchlist").length, [movies]);
  const hours = useCountUp(totalHours, inView, 1100);

  return (
    <div
      data-reveal
      onMouseEnter={() => setInView(true)}
      className="bx-font-mono relative mt-8 inline-flex flex-wrap items-center gap-x-5 gap-y-1.5 rounded-sm border border-[var(--border)] bg-[var(--surface-1)] px-5 py-3 text-[11px] uppercase tracking-wide text-[var(--text-secondary)]"
      style={{ clipPath: "polygon(0% 2%,2% 0%,98% 1%,100% 3%,99% 97%,97% 100%,1% 99%,0% 96%)" }}
    >
      <span><span className="text-[var(--text-primary)]">{hours}h</span> logged</span>
      <span className="opacity-30">·</span>
      <span><span className="text-[var(--text-primary)]">{backlogCount}</span> in backlog</span>
      <span className="opacity-30">·</span>
      <span><span className="text-[var(--text-primary)]">{watchlistCount}</span> queued to watch</span>
      <span className="opacity-30">·</span>
      <span className="normal-case tracking-normal">on repeat: <span className="text-[var(--text-primary)]">{topTrack}</span></span>
    </div>
  );
}

/* ------------------------------------- main ----------------------------------- */

export default function BeyondCode({ theme, onThemeToggle }) {
  const containerRef = useScrollReveal();
  const { topMusic, games, movies, hobbies } = beyondCode;

  const [rolling, setRolling] = useState(false);
  const [picked, setPicked] = useState(null); // { type: 'game'|'movie'|'hobby'|'music', id }

  const pickedLabel = useMemo(() => {
    if (!picked) return null;
    if (picked.type === "game") return games.find((g) => g.id === picked.id)?.title;
    if (picked.type === "movie") return movies.find((m) => m.id === picked.id)?.title;
    if (picked.type === "music") return topMusic.find((t) => t.id === picked.id)?.track;
    return hobbies.find((h) => h.id === picked.id)?.label;
  }, [picked, games, movies, hobbies, topMusic]);

  useEffect(() => {
    if (!picked) return;
    const el = document.getElementById(`beyond-${picked.type}-${picked.id}`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [picked]);

  const handleRoll = () => {
    setRolling(true);
    window.setTimeout(() => {
      const pool = [
        ...games.map((g) => ({ type: "game", id: g.id })),
        ...movies.map((m) => ({ type: "movie", id: m.id })),
        ...hobbies.map((h) => ({ type: "hobby", id: h.id })),
        ...topMusic.map((t) => ({ type: "music", id: t.id })),
      ];
      setPicked(pool[Math.floor(Math.random() * pool.length)]);
      setRolling(false);
    }, 450);
  };

  return (
    <section id="beyond-code" ref={containerRef} className="relative px-6 py-28 sm:px-10 sm:py-36">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .bx-font-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif; letter-spacing: -0.01em; }
        .bx-font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
        @keyframes pop-in { 0% { transform: scale(0.5) rotate(-8deg); opacity: 0; } 60% { transform: scale(1.1) rotate(4deg); opacity: 1; } 100% { transform: scale(1) rotate(0deg); } }
        @keyframes wiggle { 0%, 100% { transform: rotate(-2deg); } 25% { transform: rotate(6deg); } 75% { transform: rotate(-8deg); } }
        @keyframes pick-glow { 0%, 100% { box-shadow: 0 0 0 0 rgba(232,131,106,0); } 30% { box-shadow: 0 0 0 6px rgba(232,131,106,0.3); } }
        @keyframes fade-slide { from { opacity: 0; transform: translateY(2px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bar-bounce { 0%, 100% { transform: scaleY(0.4); } 50% { transform: scaleY(1); } }
        .bx-shelf { scroll-snap-type: x proximity; cursor: grab; }
        .bx-shelf:active { cursor: grabbing; }
        .bx-shelf::-webkit-scrollbar { height: 6px; }
        .bx-shelf::-webkit-scrollbar-thumb { background: var(--border); border-radius: 999px; }
        @media (prefers-reduced-motion: reduce) {
          .bx-shelf * , [data-reveal] * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
        }
      `}</style>

      <div className="mx-auto max-w-[1400px]">
        <div data-reveal className="flex flex-wrap items-start justify-between gap-6">
          <SectionHeading
            index="05"
            label="Beyond code"
            title="Life outside the editor."
            description="Playlists on loop, games half-finished, movies queued up, and whatever else keeps the other half of my brain occupied."
          />
          <div className="flex items-center gap-3">
            <PickForMeNote onRoll={handleRoll} rolling={rolling} pickLabel={pickedLabel} />
            {onThemeToggle && <ThemeToggle theme={theme} onToggle={onThemeToggle} />}
          </div>
        </div>

        <StatStrip games={games} movies={movies} topTrack={topMusic[0]?.track ?? "—"} />

        <div className="mt-10">
          <p className="bx-font-mono mb-4 text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">top 10 music</p>
          <TopMusicList tracks={topMusic} picked={picked} />
        </div>

        <div className="mt-12">
          <p className="bx-font-mono mb-4 text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">the shelf</p>
          <div className="bx-shelf -mx-6 flex gap-5 overflow-x-auto px-6 pb-4 sm:mx-0 sm:px-0">
            {games.map((game) => (
              <GameCartridge key={game.id} game={game} picked={picked?.type === "game" && picked.id === game.id} />
            ))}
          </div>
        </div>

        <div className="mt-12">
          <p className="bx-font-mono mb-4 text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">the ticket stand</p>
          <div className="bx-shelf -mx-6 flex gap-5 overflow-x-auto px-6 pb-4 sm:mx-0 sm:px-0">
            {movies.map((movie) => (
              <MovieTicket key={movie.id} movie={movie} picked={picked?.type === "movie" && picked.id === movie.id} />
            ))}
          </div>
        </div>

        <div className="mt-14">
          <p className="bx-font-mono mb-6 text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">the corkboard</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            {hobbies.map((hobby, i) => (
              <HobbyPolaroid key={hobby.id} hobby={hobby} index={i} picked={picked?.type === "hobby" && picked.id === hobby.id} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}