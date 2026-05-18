# The Ready Patient — Full Site Discovery & Migration Plan

## Current Migration Status

### Completed
- **Homepage** (`/`) — Fully migrated with content, blocks, design, header, and footer
- **Site design system** — Brand tokens, Butler/Roboto fonts, brand.css, styles.css, head.html
- **Navigation** — Header (responsive, hamburger on left, search, dropdowns) + Footer (3-column links, legal, copyright)

### Content imported
| File | Status |
|------|--------|
| `content/index.plain.html` | Imported |
| `content/nav.plain.html` | Created |
| `content/footer.plain.html` | Created |

### Blocks created (with CSS + JS)
| Block | Base | Purpose |
|-------|------|---------|
| `hero-landing` | hero | Landing page hero with background image, heading, text, CTA |
| `hero-testimonial` | hero | Patient testimonial with photo, quote, CTA |
| `cards-category` | cards | 6-column body-part navigation grid |
| `cards-cta` | cards | CTA cards with image overlay + gradient |
| `header` | — | Responsive nav with hamburger-left, search, dropdowns |
| `footer` | — | Dark teal footer with 3-column links, legal, copyright |

---

## Phase 0: Fix Header/Navigation Issues — READY TO EXECUTE

### Issue 1: Dropdowns not working
**Root cause:** `content/nav.plain.html` uses `<p><strong>Label</strong></p>` for dropdown labels. The EDS framework converts `<strong>` inside `<p>` into `.button` class. The boilerplate `header.js` expects plain `<p>` text as dropdown triggers.
**File to edit:** `content/nav.plain.html` — lines 7, 16, 25, 34, 43
**Exact change:** Replace `<p><strong>Knee Articles</strong></p>` → `<p>Knee Articles</p>` for all 5 dropdown labels

### Issue 2: Search button missing/broken
**Root cause:** The dynamically-created `.nav-search-btn` button element inherits global `button` styles from `styles.css` (lines 169-190) which apply `background-color: var(--link-color)`, `border-radius: 2.4em`, `padding: 0.5em 1.2em`, `color: var(--background-color)` — turning the search icon into a styled pill button that hides the SVG.
**File to edit:** `blocks/header/header.css` — lines 349-362
**Exact change:** Replace current `.nav-search-btn` rule with `all: unset` reset followed by only the needed properties (cursor, padding, color, display, align-items)

### Issue 3: Nav items misaligned
**Root cause:** Desktop `.nav-sections ul` has `gap: 20px` and `font-size: 13px` which overflows when 5 dropdown items (each with `padding-right: 16px` for the chevron) compete for horizontal space. The `.nav-tools` section doesn't have `flex-shrink: 0` so it may collapse.
**File to edit:** `blocks/header/header.css` — lines 268-283
**Exact changes:**
- `.nav-sections ul` gap: 20px → 16px
- `.default-content-wrapper > ul > li` font-size: 13px → 12px
- Add `flex-shrink: 0` to `.nav-tools`

---

## Remaining Phases (after Phase 0)

### Phase A: Category Landing Template (10 pages)
### Phase B: Article Template (273 pages)
### Phase C: About Template (6 pages)
### Phase D: Utility Template (6 pages)
### Phase E: Cross-Page Verification

---

## Checklist

### Phase 0: Fix Header/Navigation Issues (CURRENT PRIORITY)
- [ ] **Fix dropdowns:** Edit `content/nav.plain.html` — remove `<strong>` tags from all 5 dropdown labels (lines 7, 16, 25, 34, 43), changing `<p><strong>X Articles</strong></p>` → `<p>X Articles</p>`
- [ ] **Fix search button:** Edit `blocks/header/header.css` — replace `.nav-search-btn` block with `all: unset` reset, then re-apply: `cursor: pointer; padding: 4px; color: var(--brand-primary, #00344b); display: flex; align-items: center;`
- [ ] **Fix search SVG:** Ensure `.nav-search-btn svg` has `width: 20px; height: 20px; stroke: currentcolor;`
- [ ] **Fix nav alignment:** Edit `blocks/header/header.css` — change `.nav-sections ul` gap from 20px → 16px (line 270)
- [ ] **Fix nav font-size:** Change `.default-content-wrapper > ul > li` font-size from 13px → 12px (line 280)
- [ ] **Fix tools shrink:** Add `flex-shrink: 0` to `.nav-tools` desktop rule (around line 365)
- [ ] **Test mobile:** Verify hamburger on left, opens/closes menu, nav items vertical, dropdowns expand inline
- [ ] **Test desktop:** Verify nav items horizontal, dropdowns open below on click, search icon visible, utility links shown
- [ ] **Test tablet (600-899px):** Verify hamburger shows, layout doesn't break

### Phase A–E (unchanged, execute after Phase 0)
- [ ] Phase A: Category landings (10 pages)
- [ ] Phase B: Articles (273 pages)
- [ ] Phase C: About pages (6 pages)
- [ ] Phase D: Utility pages (6 pages)
- [ ] Phase E: Cross-page QA

---

> **⚡ TO IMPLEMENT:** Switch to **Execute mode** to apply the Phase 0 fixes. Each fix has the exact file path, line numbers, and the specific change to make. Total: 3 files to edit (`content/nav.plain.html`, `blocks/header/header.css`, and verification via Playwright).
