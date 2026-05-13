/**
 * Footer block for The Ready Patient (Zimmer Biomet EDS migration)
 * Builds footer nav columns, legal text, and bottom bar.
 */

// ---------------------------------------------------------------------------
// Data defaults
// ---------------------------------------------------------------------------

const DEFAULT_NAV_COLUMNS = [
  {
    heading: 'Company',
    links: [
      { label: 'About Us', href: '/about-us.html' },
      { label: 'Contributors', href: '/about-us/contributors.html' },
      { label: 'Contact Us', href: '/about-us/contact-us.html' },
    ],
  },
  {
    heading: 'Get Involved',
    links: [
      { label: 'Find a Doctor', href: '/find-a-doc.html' },
      { label: 'Get Updates', href: '/get-updates.html' },
      { label: 'Share Your Story', href: '/share-your-story.html' },
    ],
  },
  {
    heading: 'Articles',
    links: [
      { label: 'Hip Articles', href: '/hip.html' },
      { label: 'Knee Articles', href: '/knee.html' },
      { label: 'Foot and Ankle Articles', href: '/foot-ankle.html' },
      { label: 'Shoulder Articles', href: '/shoulder.html' },
      { label: 'Elbow Articles', href: '/elbow.html' },
      { label: 'Brain Articles', href: '/brain.html' },
    ],
  },
];

const DISCLAIMER =
  '* Zimmer Biomet is a medical device manufacturer that does not practice medicine and all health-related questions must be directed to a doctor.';

const LEGAL_PARAGRAPHS = [
  'Zimmer Biomet does not practice medicine. Content is for general public interest only and does not constitute medical advice. Consult your physician. Patient results vary. Not all patients are candidates for the procedures mentioned. Talk to your surgeon about whether joint replacement is right for you.',
  'References and links herein may lead to third-party sites and do not constitute endorsement of any healthcare provider. Zimmer Biomet is not responsible for accuracy of third-party content.',
  'All content is protected by copyright and other intellectual property rights owned by or licensed to Zimmer Biomet and must not be redistributed without written consent.',
];

const BOTTOM_LINKS = [
  { label: 'ZimmerBiomet.com', href: 'https://www.zimmerbiomet.com/', target: '_blank', rel: 'noopener noreferrer' },
  { label: 'Legal Notices', href: '/legal-notices.html' },
  { label: 'Privacy Notice', href: '/privacy-notice.html' },
  { label: 'Cookie Notice', href: '/cookie-notice.html' },
  { label: 'Consumer Health Data Privacy Policy', href: '/consumer-health-data-privacy.html' },
  { label: 'Sitemap', href: '/sitemap.html' },
];

// ---------------------------------------------------------------------------
// DOM helper (mirrors header helper)
// ---------------------------------------------------------------------------

/**
 * @param {string} tag
 * @param {Object} attrs
 * @param {...(Node|string)} children
 * @returns {HTMLElement}
 */
function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') {
      node.className = v;
    } else if (k === 'html') {
      node.innerHTML = v;
    } else if (v === true) {
      node.setAttribute(k, '');
    } else if (v !== false && v != null) {
      node.setAttribute(k, v);
    }
  });
  children.forEach((child) => {
    if (child == null) return;
    node.append(typeof child === 'string' ? document.createTextNode(child) : child);
  });
  return node;
}

// ---------------------------------------------------------------------------
// Parse optional block table overrides
// ---------------------------------------------------------------------------

/**
 * If the block table contains rows, attempt to parse column overrides.
 * Expected format: first cell = heading, second cell = pipe-separated "Label|href" pairs.
 * Falls back to defaults if parsing fails.
 *
 * @param {HTMLElement} block
 * @returns {Array} nav columns array
 */
function parseBlockColumns(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return DEFAULT_NAV_COLUMNS;

  try {
    return rows.map((row) => {
      const cells = [...row.querySelectorAll(':scope > div')];
      const heading = cells[0]?.textContent.trim() || '';
      const linkText = cells[1]?.textContent.trim() || '';
      const links = linkText.split('\n').filter(Boolean).map((line) => {
        const [label, href] = line.split('|').map((s) => s.trim());
        return { label: label || '', href: href || '#' };
      });
      return { heading, links };
    });
  } catch {
    return DEFAULT_NAV_COLUMNS;
  }
}

// ---------------------------------------------------------------------------
// Build sections
// ---------------------------------------------------------------------------

function buildDisclaimer() {
  return el('p', { class: 'footer-disclaimer' }, DISCLAIMER);
}

function buildNavGrid(columns) {
  const grid = el('div', { class: 'footer-nav-grid' });

  columns.forEach(({ heading, links }) => {
    const col = el('div', { class: 'footer-nav-col' });
    const h3 = el('h3', { class: 'footer-col-heading' }, heading);
    const ul = el('ul', { class: 'footer-nav-list' });

    links.forEach(({ label, href }) => {
      const li = el('li');
      li.append(el('a', { href, class: 'footer-nav-link' }, label));
      ul.append(li);
    });

    col.append(h3, ul);
    grid.append(col);
  });

  return grid;
}

function buildLegal() {
  const section = el('div', { class: 'footer-legal' });
  LEGAL_PARAGRAPHS.forEach((text) => {
    section.append(el('p', {}, text));
  });
  return section;
}

function buildBottomBar() {
  const bottom = el('div', { class: 'footer-bottom' });

  // Links nav
  const nav = el('nav', { class: 'footer-bottom-links', 'aria-label': 'Footer legal links' });
  const ul = el('ul', {});

  BOTTOM_LINKS.forEach(({ label, href, target, rel }, i) => {
    const li = el('li');
    const linkAttrs = { href, class: 'footer-bottom-link' };
    if (target) linkAttrs.target = target;
    if (rel) linkAttrs.rel = rel;
    li.append(el('a', linkAttrs, label));

    // Add separator between links (not after last)
    if (i < BOTTOM_LINKS.length - 1) {
      li.append(el('span', { class: 'footer-bottom-sep', 'aria-hidden': 'true' }, '|'));
    }

    ul.append(li);
  });

  nav.append(ul);

  // Copyright
  const copyright = el('p', { class: 'footer-copyright' }, `© ${new Date().getFullYear()} Zimmer Biomet`);

  bottom.append(nav, copyright);
  return bottom;
}

function buildDivider() {
  return el('hr', { class: 'footer-divider' });
}

// ---------------------------------------------------------------------------
// Main decorate
// ---------------------------------------------------------------------------

export default function decorate(block) {
  // Parse overrides or fall back to defaults
  const columns = parseBlockColumns(block);

  // Clear the authored block content
  block.innerHTML = '';
  block.classList.add('footer-block');

  // Build structure
  const disclaimer = buildDisclaimer();

  const main = el('div', { class: 'footer-main' });
  const inner = el('div', { class: 'footer-inner' });

  const navGrid = buildNavGrid(columns);
  const divider1 = buildDivider();
  const legal = buildLegal();
  const divider2 = buildDivider();
  const bottomBar = buildBottomBar();

  inner.append(navGrid, divider1, legal, divider2, bottomBar);
  main.append(inner);

  block.append(disclaimer, main);
}
