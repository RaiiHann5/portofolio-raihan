import { useEffect, useRef, useState } from "react";

/**
 * InteractiveDotGrid
 * A full-bleed grid of dots covering the hero. Dots near the cursor bloom
 * into a soft accent-colored glow (falloff by distance), physically nudge
 * away from the cursor (magnetic displacement), and light up thin
 * constellation lines to their grid neighbors while inside the hover
 * radius. Clicking sends a ring-shaped pulse of light rippling outward
 * across the grid. Idle dots breathe very faintly so the field never feels
 * static.
 *
 * Theme: the base grid and background swap between a dark and a light
 * palette. In light mode dots render solid black for contrast; in dark
 * mode they render white. The glow color is read live from `--accent-1`
 * (via getComputedStyle) so it always matches whatever your theme system
 * sets that variable to, in either mode.
 *
 * Detection: watches <html> for a `dark`/`light` class or `data-theme`
 * attribute (falls back to prefers-color-scheme). Tell me if your
 * ThemeToggle drives theme purely through React context and I'll wire this
 * directly to that instead.
 */
const CONFIG = {
  spacing: 34,
  baseRadius: 1.2,
  maxRadius: 3.6,
  hoverRadius: 170,
  rippleMaxRadius: 340,
  rippleBand: 70,
  rippleDuration: 1100,
  displaceRadius: 130,
  maxDisplace: 10,
  linkRadius: 190,
};

const PALETTES = {
  dark: {
    base: "#05060f",
    dot: "255,255,255",
    dotAlpha: 0.14,
    link: "255,255,255",
    linkAlpha: 0.16,
    fallbackAccent: "168,140,255",
    vignette:
      "radial-gradient(120% 90% at 50% 20%, transparent 45%, rgba(2,2,10,0.55) 100%)",
  },
  light: {
    base: "#eef1fb",
    dot: "0,0,0",
    dotAlpha: 0.28,
    link: "0,0,0",
    linkAlpha: 0.14,
    fallbackAccent: "255,150,90",
    vignette:
      "radial-gradient(120% 90% at 50% 15%, transparent 50%, rgba(255,255,255,0.45) 100%)",
  },
};

function detectDark() {
  if (typeof document === "undefined") return true;
  const root = document.documentElement;
  if (root.classList.contains("dark")) return true;
  if (root.classList.contains("light")) return false;
  const attr = root.getAttribute("data-theme");
  if (attr === "dark") return true;
  if (attr === "light") return false;
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
  );
}

function readAccentColor(fallbackRgb) {
  if (typeof document === "undefined") return `rgb(${fallbackRgb})`;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue("--accent-1")
    .trim();
  return value || `rgb(${fallbackRgb})`;
}

function smoothstep(edge0, edge1, x) {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

export default function InteractiveDotGrid({ className = "" }) {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999, tx: -9999, ty: -9999 });
  const ripples = useRef([]);
  const reduceMotion = useRef(false);
  const [isDark, setIsDark] = useState(detectDark);

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => setIsDark(detectDark()));
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const palette = isDark ? PALETTES.dark : PALETTES.light;
    let accentColor = readAccentColor(palette.fallbackAccent);
    reduceMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width, height, dpr;
    let dots = [];
    let cols = 0;
    let raf;
    let t = 0;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildGrid();
    }

    function buildGrid() {
      dots = [];
      cols = Math.ceil(width / CONFIG.spacing) + 1;
      const rows = Math.ceil(height / CONFIG.spacing) + 1;
      const offsetX = (width - (cols - 1) * CONFIG.spacing) / 2;
      const offsetY = (height - (rows - 1) * CONFIG.spacing) / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({
            ox: offsetX + c * CONFIG.spacing,
            oy: offsetY + r * CONFIG.spacing,
            x: offsetX + c * CONFIG.spacing,
            y: offsetY + r * CONFIG.spacing,
            phase: Math.random() * Math.PI * 2,
            jitter: 0.6 + Math.random() * 0.4,
          });
        }
      }
    }

    function spawnRipple(x, y) {
      ripples.current.push({ x, y, start: performance.now() });
    }

    function frame(now) {
      t += 1;
      ctx.clearRect(0, 0, width, height);

      mouse.current.x += (mouse.current.tx - mouse.current.x) * 0.15;
      mouse.current.y += (mouse.current.ty - mouse.current.y) * 0.15;

      const activeRipples = ripples.current
        .map((rp) => {
          const elapsed = now - rp.start;
          const progress = elapsed / CONFIG.rippleDuration;
          return { ...rp, progress, radius: progress * CONFIG.rippleMaxRadius };
        })
        .filter((rp) => rp.progress < 1);
      ripples.current = activeRipples;

      // constellation lines: connect each dot to its right/below neighbor
      // when both endpoints sit inside the cursor's link radius
      ctx.lineWidth = 1;
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const dxm0 = d.ox - mouse.current.x;
        const dym0 = d.oy - mouse.current.y;
        const near = Math.sqrt(dxm0 * dxm0 + dym0 * dym0) < CONFIG.linkRadius;
        if (!near) continue;

        const right = dots[i + 1];
        if (right && (i + 1) % cols !== 0) {
          const dxr = right.ox - mouse.current.x;
          const dyr = right.oy - mouse.current.y;
          if (Math.sqrt(dxr * dxr + dyr * dyr) < CONFIG.linkRadius) {
            const strength =
              1 -
              Math.max(
                Math.sqrt(dxm0 * dxm0 + dym0 * dym0),
                Math.sqrt(dxr * dxr + dyr * dyr)
              ) /
                CONFIG.linkRadius;
            ctx.strokeStyle = `rgba(${palette.link},${palette.linkAlpha * strength})`;
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(right.x, right.y);
            ctx.stroke();
          }
        }

        const below = dots[i + cols];
        if (below) {
          const dxb = below.ox - mouse.current.x;
          const dyb = below.oy - mouse.current.y;
          if (Math.sqrt(dxb * dxb + dyb * dyb) < CONFIG.linkRadius) {
            const strength =
              1 -
              Math.max(
                Math.sqrt(dxm0 * dxm0 + dym0 * dym0),
                Math.sqrt(dxb * dxb + dyb * dyb)
              ) /
                CONFIG.linkRadius;
            ctx.strokeStyle = `rgba(${palette.link},${palette.linkAlpha * strength})`;
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(below.x, below.y);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];

        let glow = 0;

        const dxm = d.ox - mouse.current.x;
        const dym = d.oy - mouse.current.y;
        const distMouse = Math.sqrt(dxm * dxm + dym * dym);
        if (distMouse < CONFIG.hoverRadius) {
          glow = Math.max(glow, 1 - smoothstep(0, CONFIG.hoverRadius, distMouse));
        }

        // magnetic displacement: push the dot away from the cursor,
        // strongest close-up and fading smoothly to zero at displaceRadius
        let targetX = d.ox;
        let targetY = d.oy;
        if (distMouse < CONFIG.displaceRadius && distMouse > 0.001) {
          const push =
            (1 - smoothstep(0, CONFIG.displaceRadius, distMouse)) *
            CONFIG.maxDisplace;
          targetX = d.ox + (dxm / distMouse) * push;
          targetY = d.oy + (dym / distMouse) * push;
        }
        d.x += (targetX - d.x) * 0.18;
        d.y += (targetY - d.y) * 0.18;

        for (let j = 0; j < activeRipples.length; j++) {
          const rp = activeRipples[j];
          const dxr = d.ox - rp.x;
          const dyr = d.oy - rp.y;
          const distR = Math.sqrt(dxr * dxr + dyr * dyr);
          const band = Math.abs(distR - rp.radius);
          if (band < CONFIG.rippleBand) {
            const strength =
              (1 - band / CONFIG.rippleBand) * (1 - rp.progress);
            glow = Math.max(glow, strength);
          }
        }

        const breathe = reduceMotion.current
          ? 0
          : Math.sin(t * 0.015 * d.jitter + d.phase) * 0.5 + 0.5;
        const baseAlpha = palette.dotAlpha * (0.75 + breathe * 0.25);

        ctx.beginPath();
        ctx.arc(d.x, d.y, CONFIG.baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${palette.dot},${baseAlpha})`;
        ctx.fill();

        if (glow > 0.02) {
          const r = CONFIG.baseRadius + (CONFIG.maxRadius - CONFIG.baseRadius) * glow;
          ctx.save();
          ctx.shadowBlur = 10 * glow;
          ctx.shadowColor = accentColor;
          ctx.globalAlpha = glow;
          ctx.beginPath();
          ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
          ctx.fillStyle = accentColor;
          ctx.fill();
          ctx.restore();
        }
      }

      raf = requestAnimationFrame(frame);
    }

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouse.current.tx = e.clientX - rect.left;
      mouse.current.ty = e.clientY - rect.top;
    }

    function onMouseLeave() {
      mouse.current.tx = -9999;
      mouse.current.ty = -9999;
    }

    function onClick(e) {
      const rect = canvas.getBoundingClientRect();
      spawnRipple(e.clientX - rect.left, e.clientY - rect.top);
    }

    function onTouchMove(e) {
      const touch = e.touches[0];
      if (!touch) return;
      const rect = canvas.getBoundingClientRect();
      mouse.current.tx = touch.clientX - rect.left;
      mouse.current.ty = touch.clientY - rect.top;
    }

    function onTouchStart(e) {
      const touch = e.touches[0];
      if (!touch) return;
      const rect = canvas.getBoundingClientRect();
      spawnRipple(touch.clientX - rect.left, touch.clientY - rect.top);
    }

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchstart", onTouchStart);
    };
  }, [isDark]);

  const palette = isDark ? PALETTES.dark : PALETTES.light;

  return (
    <div
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{ backgroundColor: palette.base }}
      />
      <canvas
        ref={canvasRef}
        className="pointer-events-auto absolute inset-0 h-full w-full cursor-crosshair"
      />
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{ background: palette.vignette }}
      />
    </div>
  );
}