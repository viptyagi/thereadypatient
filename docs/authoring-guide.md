# ReadyPatient EDS — Authoring Guide

## 1. Introduction

**Adobe Edge Delivery Services (EDS)** is a modern content delivery platform that renders pages from documents (Google Docs / SharePoint) or direct HTML at the edge — delivering perfect Lighthouse scores and sub-second load times.

**Universal Editor** is Adobe's WYSIWYG authoring interface. It lets content editors click on any block on the live page and edit its properties without writing HTML. Changes are saved back to the content source and published instantly.

This guide covers everything a content author needs to know to create and maintain pages on the ReadyPatient EDS site.

---

## 2. Block Reference

Each page is composed of **blocks** — self-contained components. Every block is authorable in Universal Editor. Below is the full reference for each block used on the ReadyPatient site.

---

### Header

**What it does:** Renders the global navigation bar used on every page. Includes:
- Top utility bar (Find a Doctor, Get Updates, Share Your Story)
- Main nav with dropdown menus (Knee, Hip, Foot/Ankle, Shoulder, Elbow, About Us)
- Search panel (opens on click)
- Mobile hamburger drawer
- Sticky behaviour on scroll

**Is it authorable?** The header is brand-managed. Navigation items and links are configured in the block's JavaScript file. To change nav items, work with a developer.

**Placement in document:**
```
| Header |  |
```
Place an empty `Header` block at the top of every page.

---

### Footer

**What it does:** Renders the global footer used on every page. Includes:
- Three link columns: Company, Get Involved, Articles
- Full legal disclaimer text
- Bottom bar with utility links and copyright

**Is it authorable?** The footer is brand-managed with hardcoded defaults. Link columns can be overridden via block table rows if needed (work with a developer).

**Placement in document:**
```
| Footer |  |
```
Place an empty `Footer` block at the bottom of every page.

---

### Hero

**What it does:** Full-width banner section with a background image, dark gradient overlay, heading, body text, and a CTA button.

**Fields:**

| Field | Description | Example |
|---|---|---|
| `bg-image` | URL of the background image | `https://...jpg` |
| `heading` | Main H1 headline | `ReadyPatient™ exists to cultivate hope.` |
| `body` | Supporting paragraph text | `Knowledge is power...` |
| `sub-body` | Bold sub-text below body | `Get started on your personalized journey!` |
| `cta-text` | Call-to-action button label | `START HERE!` |
| `cta-href` | Call-to-action button URL | `/quiz.html` |

**Document table format:**
```
| Hero      |                                          |
|-----------|------------------------------------------|
| bg-image  | https://example.com/image.jpg            |
| heading   | Your heading text here                   |
| body      | Your body paragraph text here            |
| sub-body  | Bold emphasis text                       |
| cta-text  | BUTTON LABEL                             |
| cta-href  | /destination-page.html                   |
```

**Responsive behaviour:**
- Desktop: content panel occupies left 50% of banner; gradient fades right
- Tablet (≤ 900px): content panel widens to 60%
- Mobile (≤ 600px): full dark overlay, centered text, full-width button

**Recommended image size:** 1600 × 700px minimum, JPEG format.

---

### Cards

**What it does:** A grid of image cards linking to article category pages. Shows a "Find answers to your questions" section heading above the grid.

**Fields:**

| Field | Description |
|---|---|
| `section-heading` | (Optional) Override the heading above the grid |
| Row per card: col 1 | Image URL |
| Row per card: col 2 | Card label text |
| Row per card: col 3 | Link URL |

**Document table format:**
```
| Cards           |                              |                    |
|-----------------|------------------------------|--------------------|
| section-heading | Find answers to your questions|                   |
| https://...knee.jpg | Knee Articles           | /knee.html         |
| https://...hip.jpg  | Hip Articles            | /hip.html          |
| https://...foot.jpg | Foot/Ankle Articles     | /foot-ankle.html   |
```

**Responsive behaviour:**
- Desktop: 3 columns × 2 rows (6 cards)
- Tablet: 2 columns
- Mobile: 1 column, wider aspect ratio per card

**Recommended image size:** 600 × 800px, JPEG format.

---

### Patient Story

**What it does:** A two-column testimonial section featuring a patient's quote, name, and photo alongside a CTA button.

**Fields:**

| Field | Description | Example |
|---|---|---|
| `section-heading` | Heading above the section | `Learn from patients like you` |
| `patient-name` | Patient's name | `Connie D` |
| `quote` | The patient's quote (without quotation marks) | `It's been wonderful. I feel like I got my life back!` |
| `photo` | Patient photo URL | `https://...jpg` |
| `cta-text` | Button label | `Read Connie's Story` |
| `cta-href` | Button URL | `/knee/connies-patient-story.html` |

**Document table format:**
```
| Patient Story   |                                       |
|-----------------|---------------------------------------|
| section-heading | Learn from patients like you          |
| patient-name    | Connie D                              |
| quote           | It's been wonderful...                |
| photo           | https://example.com/patient-photo.jpg |
| cta-text        | Read Connie's Story                   |
| cta-href        | /knee/connies-patient-story.html      |
```

**Responsive behaviour:**
- Desktop/Tablet: text left, photo right, side by side
- Mobile: photo on top, text below

**Recommended photo size:** 800 × 800px, JPEG, portrait or square.

---

### Promo Grid

**What it does:** A 2×2 promotional card grid. Each card can have a background image, heading, body text, and a CTA button. Four style variants are available.

**Fields:**

| Field | Description |
|---|---|
| `section-heading` | Heading above the grid |
| Per card col 1 | Card heading |
| Per card col 2 | Card body text |
| Per card col 3 | CTA button label |
| Per card col 4 | CTA button URL |
| Per card col 5 | Style variant: `dark-image`, `teal`, `light`, or `white` |
| Per card col 6 | (Optional) Background image URL |

**Style variants:**

| Variant | Appearance |
|---|---|
| `dark-image` | Background image with dark gradient overlay; white text |
| `teal` | Solid teal (`#00344B`) background; white text; centered layout |
| `light` | Light cream (`#F8F7F1`) background; dark text |
| `white` | White background; dark text |

**Document table format:**
```
| Promo Grid            |                                     |              |                       |            |                          |
|-----------------------|-------------------------------------|--------------|-----------------------|------------|--------------------------|
| section-heading       | Here's more you can do              |              |                       |            |                          |
| Share Your Story      | People like you need to hear...     | SHARE NOW    | /share-your-story.html| dark-image | https://...bg-share.jpg  |
| Be Informed!          | Sign up for recommendations...      | GET UPDATES  | /get-updates.html     | teal       | https://...bg-news.jpg   |
| About Us              | Learn more about our mission...     | ABOUT US     | /about-us.html        | light      | https://...bg-about.jpg  |
| Find a Doctor         | Search by specialty, location...    | FIND A DOCTOR| /find-a-doc.html      | white      | https://...bg-fad.jpg    |
```

**Responsive behaviour:**
- Desktop/Tablet: 2 columns
- Mobile: 1 column, stacked

---

## 3. Adding a New Page

1. **Create the document** in Google Docs or SharePoint in the appropriate folder of the ReadyPatient content tree.
2. **Add the Header block** as the first element.
3. **Add your content blocks** in order (Hero, Cards, Patient Story, Promo Grid, etc.)
4. **Add the Footer block** as the last element.
5. **Set page metadata** in a `Metadata` table at the bottom:
   - `title` — browser tab title
   - `description` — SEO meta description
   - `image` — Open Graph image URL
6. **Preview** at `https://main--thereadypatient--<org>.hlx.page/<path>`
7. **Publish** using the AEM Sidekick browser extension.

---

## 4. Responsive Design Notes

The site uses three breakpoints:

| Breakpoint | Width | Behaviour |
|---|---|---|
| Mobile | < 768px | Single-column layouts; hamburger menu; utility bar hidden |
| Tablet | 768px – 1023px | 2-column grids; full header with compact nav |
| Desktop | ≥ 1024px | Full multi-column layouts; full header with dropdowns |

All blocks are designed mobile-first. Images use `object-fit: cover` and load lazily (except the hero which loads eagerly for LCP).

---

## 5. Content Guidelines

### Images
| Block | Recommended Size | Format |
|---|---|---|
| Hero background | 1600 × 700px min | JPEG (optimised) |
| Cards (body-part) | 600 × 800px | JPEG |
| Patient Story photo | 800 × 800px | JPEG |
| Promo Grid backgrounds | 900 × 600px | JPEG |

- Always provide descriptive `alt` text for accessibility.
- Keep file sizes under 300KB where possible; use `cq5dam.web.1280.1280.jpeg` renditions from AEM DAM.
- Use HTTPS URLs for all external images.

### Text
- **Hero heading:** 50–80 characters recommended
- **Hero body:** 100–200 characters
- **Card labels:** 1–4 words
- **Patient quote:** 60–150 characters (one memorable sentence)
- **Promo card heading:** 2–5 words
- **Promo card body:** 80–140 characters

### Accessibility
- All CTA buttons must have descriptive text (not just "Click here")
- Images must have meaningful alt text
- Heading hierarchy should be maintained: one H1 per page (in the Hero), H2 for section headings, H3 within cards

---

## 6. Deployment

The ReadyPatient EDS project follows the standard AEM/Franklin (hlx.live) preview/publish flow:

1. **Edit** content in Google Docs or SharePoint.
2. **Preview** changes instantly at the `.hlx.page` preview URL using the **AEM Sidekick** Chrome extension.
3. **Publish** to the live `.hlx.live` (or custom domain) URL via Sidekick.

Code changes (block JS/CSS, styles) are deployed via GitHub. The `main` branch is automatically served as the live version. Feature branches are available at `https://<branch>--thereadypatient--<org>.hlx.page`.

For questions on deployment or block development, contact the development team.

---

*Last updated: May 2026 — ReadyPatient EDS Migration*
