# TheReadyPatient — EDS Migration

Adobe Edge Delivery Services (EDS) migration of [thereadypatient.com](https://www.thereadypatient.com/), a Zimmer Biomet patient education site.

## Project Structure

```
thereadypatient-eds/
├── index.html                  # Homepage
├── knee.html                   # Knee Articles
├── hip.html                    # Hip Articles
├── foot-ankle.html             # Foot & Ankle Articles
├── shoulder.html               # Shoulder Articles
├── elbow.html                  # Elbow Articles
├── brain.html                  # Brain Articles
├── about-us.html               # About Us
├── find-a-doc.html             # Find a Doctor
├── get-updates.html            # Get Updates / Newsletter
├── share-your-story.html       # Share Your Story
│
├── blocks/
│   ├── header/                 # Sticky nav, dropdowns, mobile drawer, search
│   ├── footer/                 # 3-col links, legal disclaimer, bottom bar
│   ├── hero/                   # Full-width background image + CTA
│   ├── cards/                  # 6-card body-part image grid
│   ├── patient-story/          # Patient testimonial 2-col layout
│   └── promo-grid/             # 2×2 promotional cards (4 style variants)
│
├── scripts/
│   ├── aem.js                  # EDS core loader (loadBlock, decorateBlocks…)
│   └── scripts.js              # Entry point
│
├── styles/
│   ├── styles.css              # Global tokens, resets, utilities
│   └── fonts.css               # Butler (headings) + Roboto (body)
│
└── docs/
    ├── authoring-guide.md      # Content editor guide
    └── component-model.json    # Universal Editor model definitions
```

## Design Tokens

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#00344B` | Dark teal — headings, nav, footer bg |
| `--color-accent` | `#307DA1` | Medium teal — dropdown hover, accents |
| `--color-bg` | `#E8E7E2` | Warm off-white — body background |
| `--color-bg-light` | `#F8F7F1` | Cream — card labels, light sections |
| `--font-heading` | Butler, Georgia, serif | All headings |
| `--font-body` | Roboto, Arial, sans-serif | Body text, nav |

## Blocks

### Header
- Utility bar (Find a Doctor / Get Updates / Share Your Story)
- Logo + main nav with hover dropdowns (white floating panel)
- Search panel (slides open on click)
- Mobile hamburger drawer (slides from left, ≤1023px)
- Sticky on scroll

### Footer
- 3-column nav: Company / Get Involved / Articles
- Full Zimmer Biomet legal disclaimer
- Bottom utility bar + copyright

### Hero
- Full-width background image
- Left-side gradient overlay
- Butler heading, body text, bold sub-text
- Pill-shaped CTA button
- Authorable: `bg-image`, `heading`, `body`, `sub-body`, `cta-text`, `cta-href`

### Cards
- 6-card body-part image grid
- Cream `#F8F7F1` label box at bottom of each card (Butler 800, dark teal text)
- 3 cols desktop → 2 cols tablet → 2 cols mobile
- Authorable: `section-heading`, per-card image/label/href

### Patient Story
- Two-column: quote + CTA left, portrait photo right
- Stacks vertically on mobile (photo on top)
- Authorable: `section-heading`, `patient-name`, `quote`, `photo`, `cta-text`, `cta-href`

### Promo Grid
- 2×2 promotional cards
- 4 variants: `dark-image`, `teal`, `light`, `white`
- Authorable: `section-heading`, per-card heading/body/cta/variant/bg-image

## Responsive Breakpoints

| Breakpoint | Width | Changes |
|---|---|---|
| Mobile | `< 768px` | Hamburger menu, single/2-col cards, stacked patient story |
| Tablet | `768–1023px` | Hamburger menu, 2-col cards, 3-col footer |
| Desktop | `≥ 1024px` | Full dropdown nav, 3-col cards |
| Large | `≥ 1280px` | Wider gutters |

## Local Development

This project uses the SLICC preview service worker. Open with project mode to resolve root-relative paths:

```
serve --project /workspace/thereadypatient-eds
```

## EDS Deployment

1. Push this repo to GitHub under your AEM/Franklin org
2. Install the [AEM Sidekick](https://chrome.google.com/webstore/detail/helilix/ccfggkjabjahcjoljmgmklhpaccedipo) Chrome extension
3. Preview: `https://main--thereadypatient-eds--<org>.hlx.page/`
4. Publish: `https://main--thereadypatient-eds--<org>.hlx.live/`

## Content Authoring

See [`docs/authoring-guide.md`](./docs/authoring-guide.md) for full block reference, field descriptions, and Universal Editor instructions.

## Tech Stack

- Adobe Edge Delivery Services (Franklin/hlx)
- Vanilla JS ES modules — no framework dependencies
- CSS custom properties for all design tokens
- Butler font (headings) via CDN Fonts
- Roboto font via Google Fonts
