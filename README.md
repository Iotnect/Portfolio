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
- `src/components/sections/`: Hero, About, Expertise, NeoVision, Solutions and Contact.
- `src/components/SectionHeading.tsx`: shared section heading.
- `src/components/CapabilityCard.tsx` and `SolutionCard.tsx`: reusable typed cards.
- `src/lib/content.ts`: typed navigation, capabilities and solution data.
- `public/assets/`: original profile imagery.
- `public/NeoVision_Iotnect.pdf`: linked company profile (approximately 36 MB).

Only the interactive header is a client component; portfolio sections render at build time. Contact buttons open email and WhatsApp directly. Google Fonts are optional with system font fallbacks. Product screenshots are examples from the supplied PDF, not live feeds.

## Laragon / Apache

For local development, use `npm.cmd run dev`. To serve the production export with Laragon, point the virtual host document root to `C:/laragon/www/portfolio/out`, build the project, then reload the web server. Asset URLs assume the site is served at the domain root. A subdirectory deployment requires configuring `basePath` in `next.config.ts`, updating public asset URLs to include that prefix, and rebuilding.

## Previous versions

The Laravel source, environment, dependencies and tests are preserved under ignored `tmp/laravel-backup/`. The first HTML version remains under `tmp/static-backup/`. They are not used by Next.js and are excluded from TypeScript checks. The original PDF remains in the project root.

Next.js references: [installation](https://nextjs.org/docs/app/getting-started/installation), [static export](https://nextjs.org/docs/app/guides/static-exports).
