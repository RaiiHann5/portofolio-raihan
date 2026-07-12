# Portfolio — Creative Developer

A premium, minimalist, interactive developer portfolio built with React, Vite, Tailwind CSS v4 and GSAP.

## Stack

- **React 19 + Vite** — app shell and build tooling
- **Tailwind CSS v4** — utility styling, theme tokens via `@theme` in `src/index.css`
- **GSAP + ScrollTrigger** — entrance animations, scroll reveals, the timeline progress line, magnetic buttons
- **Lenis** — inertia-based smooth scrolling
- **lucide-react** — iconography (brand marks for GitHub/LinkedIn are hand-drawn SVGs in `src/components/ui/BrandIcons.jsx` since lucide no longer ships trademarked logos)

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build to /dist
npm run preview   # preview the production build
```

## Structure

```
src/
  components/
    layout/     Navbar, Footer, CustomCursor, ThemeToggle, SmoothScroll (Lenis)
    ui/         MagneticButton, SectionHeading, GradientOrb, BrandIcons
    sections/   Hero, About, Skills, Projects, Experience, Lab, Contact
  context/      ThemeContext (dark/light), CursorContext (custom cursor label state)
  hooks/        useMagnetic (GSAP quickTo pull effect), useScrollReveal (ScrollTrigger reveal)
  data/         Content for skills, projects, timeline and lab experiments — edit these
                to swap in your own info, no JSX changes required.
```

## Customizing content

All copy lives in `src/data/*.js` and directly inside the section components
(`Hero.jsx`, `About.jsx`, `Contact.jsx`). Update those files with your own
name, bio, projects, and social links — the CTA email/GitHub/LinkedIn are in
`src/components/sections/Contact.jsx`.

## Design tokens

Color, font and spacing tokens live at the top of `src/index.css` under
`@theme` and `:root` / `:root.light`. Both a dark and a light palette are
defined; the theme toggle in the navbar swaps a `.light` class on `<html>`.

## Notes

- The custom cursor and magnetic effects are disabled automatically on
  touch devices (`hover: none` media query) and native cursor is restored.
- All animation respects `prefers-reduced-motion`.
