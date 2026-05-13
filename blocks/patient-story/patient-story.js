/**
 * Patient Story block — EDS block
 * Displays a featured patient testimonial in a two-column layout
 * (text left, photo right on desktop; photo on top, text below on mobile).
 *
 * Block table config rows (key | value):
 *   section-heading  → heading above the block
 *   patient-name     → patient's name
 *   quote            → quote text (no surrounding quotation marks)
 *   photo            → image URL
 *   cta-text         → button label
 *   cta-href         → button URL
 */

const DEFAULTS = {
  'section-heading': 'Learn from patients like you',
  'patient-name': 'Connie D',
  quote: "It's been wonderful. I feel like I got my life back!",
  photo:
    'https://www.thereadypatient.com/content/dam/zb-content-hub/homepage/re-design/Connie-story.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg',
  'cta-text': "Read Connie's Story",
  'cta-href': '/knee/connies-patient-story.html',
};

/**
 * Parse block table rows into a key→value config map.
 * Each row is expected to have two cells: key and value.
 * Cell content may be a plain text node or an element; we normalise to string.
 */
function parseConfig(block) {
  const config = {};
  block.querySelectorAll(':scope > div').forEach((row) => {
    const cells = row.querySelectorAll(':scope > div');
    if (cells.length < 2) return;
    const key = cells[0].textContent.trim().toLowerCase();
    // For the photo cell the value might be an <img> element already
    const valueEl = cells[1];
    const img = valueEl.querySelector('img');
    if (img) {
      config[key] = img.src || img.getAttribute('src');
    } else {
      config[key] = valueEl.textContent.trim();
    }
  });
  return config;
}

export default function decorate(block) {
  const raw = parseConfig(block);

  // Merge with defaults (raw values win)
  const cfg = Object.fromEntries(
    Object.keys(DEFAULTS).map((k) => [k, raw[k] || DEFAULTS[k]]),
  );

  // ── Build DOM ────────────────────────────────────────────────────────────

  // Section heading
  const h2 = document.createElement('h2');
  h2.className = 'ps-section-heading';
  h2.textContent = cfg['section-heading'];

  // Patient name
  const h3 = document.createElement('h3');
  h3.className = 'ps-name';
  h3.textContent = cfg['patient-name'];

  // Decorative quote mark (open)
  const openMark = document.createElement('span');
  openMark.className = 'ps-quote-mark ps-quote-mark--open';
  openMark.setAttribute('aria-hidden', 'true');
  openMark.textContent = '\u201C'; // "

  // Quote text
  const quoteText = document.createElement('p');
  quoteText.className = 'ps-quote-text';
  quoteText.textContent = cfg['quote'];

  // Decorative quote mark (close)
  const closeMark = document.createElement('span');
  closeMark.className = 'ps-quote-mark ps-quote-mark--close';
  closeMark.setAttribute('aria-hidden', 'true');
  closeMark.textContent = '\u201D'; // "

  // Blockquote container
  const blockquote = document.createElement('blockquote');
  blockquote.className = 'ps-quote';
  blockquote.append(openMark, quoteText, closeMark);

  // CTA button
  const cta = document.createElement('a');
  cta.className = 'ps-cta';
  cta.href = cfg['cta-href'];
  cta.textContent = cfg['cta-text'];

  // Text column
  const textCol = document.createElement('div');
  textCol.className = 'ps-text';
  textCol.append(h3, blockquote, cta);

  // Photo
  const img = document.createElement('img');
  img.className = 'ps-photo-img';
  img.src = cfg['photo'];
  img.alt = cfg['patient-name'];
  img.loading = 'lazy';

  const photoCol = document.createElement('div');
  photoCol.className = 'ps-photo';
  photoCol.append(img);

  // Inner flex row
  const inner = document.createElement('div');
  inner.className = 'ps-inner';
  inner.append(textCol, photoCol);

  // ── Replace block content ────────────────────────────────────────────────
  block.innerHTML = '';
  block.classList.add('patient-story-block');
  block.append(h2, inner);
}
