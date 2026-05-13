/**
 * Promo Grid block — EDS block
 * Displays a 2×2 promotional card grid with a section heading.
 *
 * Block table format:
 *   Row 0 (optional): key="section-heading" | value  OR  single cell → heading
 *   Rows 1-N (cards): 5 cells minimum per row
 *     [0] card heading
 *     [1] card body text
 *     [2] CTA label
 *     [3] CTA href (plain text or <a> element)
 *     [4] variant: "dark-image" | "teal" | "light" | "white"
 *     [5] (optional) background image URL or <img> element
 */

const DEFAULT_HEADING = "Here's more you can do";

const DEFAULT_CARDS = [
  {
    heading: 'Share Your Story',
    body: "People like you need to hear that they're not alone. Your story can make a difference in their life.",
    ctaLabel: 'I WANT TO SHARE MY STORY',
    ctaHref: '/share-your-story.html',
    variant: 'dark-image',
    bgImage:
      'https://www.thereadypatient.com/content/dam/zb-content-hub/homepage/re-design/background-sharestory.jpg',
  },
  {
    heading: 'Be Informed. Be Prepared!',
    body: 'Sign up for personalized article recommendations in your email.',
    ctaLabel: 'GET UPDATES',
    ctaHref: '/get-updates.html',
    variant: 'teal',
    bgImage:
      'https://www.thereadypatient.com/content/dam/zb-content-hub/homepage/re-design/background-newsletter.jpg',
  },
  {
    heading: 'About Us',
    body: 'Learn more about who we are and our mission of helping patients find balance in their lives.',
    ctaLabel: 'ABOUT US',
    ctaHref: '/about-us.html',
    variant: 'light',
    bgImage:
      'https://www.thereadypatient.com/content/dam/zb-content-hub/homepage/re-design/background-aboutus.jpg',
  },
  {
    heading: 'Find a Doctor',
    body: 'Search by speciality, location and more. Find the right provider for you.',
    ctaLabel: 'FIND A DOCTOR',
    ctaHref: '/find-a-doc.html',
    variant: 'white',
    bgImage:
      'https://www.thereadypatient.com/content/dam/zb-content-hub/homepage/re-design/background-FaD.jpg',
  },
];

/**
 * Return the raw text content of an EDS cell element, stripping tags.
 */
function cellText(el) {
  return el ? el.textContent.trim() : '';
}

/**
 * Extract a URL string from a cell that may contain plain text, an <a>, or an <img>.
 */
function cellUrl(el) {
  if (!el) return '';
  const a = el.querySelector('a');
  if (a) return a.href || a.getAttribute('href') || '';
  const img = el.querySelector('img');
  if (img) return img.src || img.getAttribute('src') || '';
  return el.textContent.trim();
}

/**
 * Extract a background-image URL from cell[5] if present.
 * Accepts an <img> element or a plain-text URL.
 */
function extractBgImage(cells) {
  if (cells.length < 6) return '';
  const cell = cells[5];
  const img = cell.querySelector('img');
  if (img) return img.src || img.getAttribute('src') || '';
  const text = cell.textContent.trim();
  return text.startsWith('http') || text.startsWith('/') ? text : '';
}

/**
 * Detect whether a row is the heading row.
 * Heading row: single cell, OR two cells where first cell = "section-heading".
 */
function isHeadingRow(cells) {
  if (cells.length === 1) return true;
  if (cells.length >= 2 && cellText(cells[0]).toLowerCase() === 'section-heading') return true;
  return false;
}

/**
 * Parse the block table into { heading, cards }.
 */
function parseBlock(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  let heading = DEFAULT_HEADING;
  const cards = [];

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];

    // Heading row detection
    if (cells.length === 1) {
      heading = cellText(cells[0]) || heading;
      return;
    }
    if (cells.length >= 2 && cellText(cells[0]).toLowerCase() === 'section-heading') {
      heading = cellText(cells[1]) || heading;
      return;
    }

    // Card row: needs at least 4 cells (heading, body, ctaLabel, ctaHref)
    if (cells.length >= 4) {
      cards.push({
        heading: cellText(cells[0]),
        body: cellText(cells[1]),
        ctaLabel: cellText(cells[2]),
        ctaHref: cellUrl(cells[3]),
        variant: cells.length >= 5 ? cellText(cells[4]) || 'light' : 'light',
        bgImage: extractBgImage(cells),
      });
    }
  });

  return {
    heading,
    cards: cards.length > 0 ? cards : DEFAULT_CARDS,
  };
}

/**
 * Build a single promo card element.
 */
function buildCard({ heading, body, ctaLabel, ctaHref, variant, bgImage }) {
  const card = document.createElement('div');
  card.className = `pg-card pg-card--${variant}`;

  // Only apply background image on dark-image variant; teal/light/white use solid colours
  if (bgImage && variant === 'dark-image') {
    const cardId = `pg-card-${Math.random().toString(36).slice(2, 8)}`;
    card.dataset.cardId = cardId;
    const cardStyle = document.createElement('style');
    cardStyle.textContent = `[data-card-id="${cardId}"] { background-image: url('${bgImage}'); }`;
    card.appendChild(cardStyle);
  }

  const content = document.createElement('div');
  content.className = 'pg-card-content';

  const h3 = document.createElement('h3');
  h3.className = 'pg-card-heading';
  h3.textContent = heading;

  const p = document.createElement('p');
  p.className = 'pg-card-body';
  p.textContent = body;

  const a = document.createElement('a');
  a.className = 'pg-card-cta';
  a.href = ctaHref;
  a.textContent = ctaLabel;

  content.append(h3, p, a);
  card.append(content);
  return card;
}

export default function decorate(block) {
  const { heading, cards } = parseBlock(block);

  // ── Section heading ──────────────────────────────────────────────────────
  const h2 = document.createElement('h2');
  h2.className = 'pg-heading';
  h2.textContent = heading;

  // ── Card grid ────────────────────────────────────────────────────────────
  const grid = document.createElement('div');
  grid.className = 'pg-grid';
  cards.forEach((cardData) => grid.append(buildCard(cardData)));

  // ── Replace block content ────────────────────────────────────────────────
  block.innerHTML = '';
  block.classList.add('promo-grid-block');
  block.append(h2, grid);
}
