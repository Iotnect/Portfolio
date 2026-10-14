# IOTNECT portfolio — Next.js + TypeScript

Company portfolio built with Next.js App Router, React and strict TypeScript. The existing IOTNECT / Neo Vision design and content are preserved. The production build exports static HTML, CSS and JavaScript with no PHP, database or Node server required for hosting.

## Local development

Requires Node.js 20.9+ and npm.

```powershell
npm.cmd install
npm.cmd run dev
```

Open http://localhost:3000. On shells without PowerShell execution policy restrictions, `npm` also works.

## Check and build

```powershell
npm.cmd run typecheck
npm.cmd run build
```

The complete deployable site is generated in `out/`. Upload the contents of `out/` to a static host. For an optional local production preview with Python installed:

```powershell
python -m http.server 3000 --bind 127.0.0.1 --directory out
```

This project uses `output: 'export'`, so `next start` is not used. Files are generated during the build, including the copyright year. Rebuild when content changes.

## Components and content

- `src/app/layout.tsx`: page metadata, fonts/styles, header and footer.
- `src/app/page.tsx`: composition of the portfolio sections.
- `src/app/globals.css`: existing purple branding and responsive layout.
- `src/components/SiteHeader.tsx`: React state for mobile navigation, Escape, outside click and viewport changes.
- `src/components/SiteFooter.tsx`: footer.
- `src/components/sections/`: Hero, Introduction, About, Expertise, NeoVision, Solutions and Contact.
- `src/components/SectionHeading.tsx`: shared section heading.
- `src/components/CapabilityCard.tsx` and `SolutionCard.tsx`: reusable typed cards.
- `src/lib/content.ts`: typed navigation, capabilities and solution data.
- `public/assets/`: original profile imagery.
The original company profile is retained locally in the project root as source material; it is not served or linked from the portfolio.

The interactive header and hero effects are client components; portfolio sections render at build time. Contact buttons open email and WhatsApp directly. Google Fonts are optional with system font fallbacks. Product screenshots are examples from the supplied PDF, not live feeds.

## Plasma logo hero

`src/components/effects/CrystalizedLogo.tsx` adapts the supplied CrystalizedBall concept to the actual IOTNECT logo using OGL. `logoPlasmaShaders.ts` derives a mask directly from the coloured JPEG strokes, removing its white background and internal gaps in the shader. Plasma filaments run across the strokes and glow follows their contours, replacing the circular ball.

Adjust `color`, `size`, `crackle`, `fill`, `interactive` and `hoverStrength` in `src/components/sections/Hero.tsx`. The mask is designed for this coloured logo on white, rather than arbitrary monochrome images. The original JPEG stays unchanged. The effect caps rendering at 30fps, limits resolution, pauses out of view or in a hidden tab, and becomes still for reduced-motion preferences. A still image remains visible while loading or if WebGL is unavailable.

## Laragon / Apache

For local development, use `npm.cmd run dev`. To serve the production export with Laragon, point the virtual host document root to `C:/laragon/www/portfolio/out`, build the project, then reload the web server. Asset URLs assume the site is served at the domain root. A subdirectory deployment requires configuring `basePath` in `next.config.ts`, updating public asset URLs to include that prefix, and rebuilding.

## Previous versions

The Laravel source, environment, dependencies and tests are preserved under ignored `tmp/laravel-backup/`. The first HTML version remains under `tmp/static-backup/`. They are not used by Next.js and are excluded from TypeScript checks. The original PDF remains in the project root.

Next.js references: [installation](https://nextjs.org/docs/app/getting-started/installation), [static export](https://nextjs.org/docs/app/guides/static-exports).

The opening hero centres the plasma logo above a particle-animated Iotnect wordmark. The supplied ParticleText implementation is in `src/components/effects/ParticleText.tsx` with its companion CSS. Its colour, density and gathering settings are configured in `Hero.tsx`; the former hero copy and buttons are now in `Introduction.tsx`, below the opening screen. Particle animation pauses out of view and respects reduced motion; touch scrolling remains enabled.
