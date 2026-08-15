# ByteTitan — Personal Research & Engineering Site

A dark, motion-led Astro portfolio for Xin Wang / ByteTitan. The site is structured as a personal research space rather than a conventional academic homepage: selected AI systems, publications, experience, technical writing, and a long-term learning-notes knowledge base.

## Design system

- Full-screen interactive hero with three switchable research-inspired visual modes
- Canvas signal network that reacts subtly to pointer movement
- `BT_` brand mark and favicon
- Editorial black/graphite visual language with mint / violet / pink signal accents
- Oversized typography, numbered navigation, restrained motion, and mono metadata
- Responsive desktop / tablet / mobile layouts
- `prefers-reduced-motion` support
- Publication contribution disclosure and figure fallback visuals
- Project architecture-flow previews with screenshot overlays when real figures are present
- Unified Blog / Notes / Archive / Article reading UI
- Blog and Notes client-side search; Notes category filtering
- Article TOC, code styling, and reading-progress indicator

## Content architecture

```text
src/
├── components/
│   ├── ContentPreview.astro
│   ├── ProjectCard.astro
│   └── PublicationCard.astro
├── content/
│   ├── blog/
│   └── notes/
├── data/
│   ├── projects.ts
│   └── publications.ts
├── layouts/
│   ├── ArticleLayout.astro
│   └── BaseLayout.astro
├── pages/
│   ├── index.astro
│   ├── archive.astro
│   ├── blog/
│   └── notes/
└── styles/global.css
```

## Add your existing figures

The uploaded project did not include the original `figures/` image files. Copy them into:

```text
public/figures/
```

Expected filenames currently referenced by the data files include:

```text
ProfilePicture.png
biomap.png
agpdnet.png
2026IJCNN-pipeline.png
paperDistriller.png
SoulMate.png
```

Publication and project cards contain designed fallbacks, so the layout remains intentional even before those assets are copied. Once a referenced image exists, it automatically overlays the fallback visual.

## Development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Writing

Blog example:

```text
src/content/blog/how-i-built-paperdistiller.md
```

Notes can use nested paths:

```text
src/content/notes/model-security/backdoor-attacks.md
src/content/notes/llm/rag-basics.md
```

Astro uses the entry ID as the route, so nested note structure becomes nested URLs automatically.

## Deployment

`.github/workflows/deploy.yml` contains the GitHub Pages Actions workflow. The Astro `site` value is configured for:

```text
https://bytetitan-star.github.io
```

## UI preview file

`ui-preview.html` is included only as a lightweight design snapshot for reviewing the homepage styling without Astro. The real site source remains `src/pages/index.astro` and the shared stylesheet.

## 2026 Editorial Redesign

The homepage now uses a full-screen video hero inspired by an editorial design-studio aesthetic, followed by a warm light reading experience using Instrument Serif + Inter. Blog, Notes, Archive, and article pages share the same light typography system for improved long-form readability.

### Preview

Open `ui-preview.html` directly in a browser for a dependency-free visual preview of the redesigned homepage. The live Astro page is implemented in `src/pages/index.astro` and shares styles from `src/styles/global.css`.

### Footer metadata

The homepage restores the Visitor Count badge. `Last updated` is generated from the build time in the `Asia/Shanghai` timezone, so it no longer needs to be manually edited after site updates.

### Hero video

The hero streams the configured CloudFront MP4 URL at runtime. The page includes a dark fallback background if the video is unavailable, and respects `prefers-reduced-motion` by pausing the background video.
