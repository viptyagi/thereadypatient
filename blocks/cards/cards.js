export default function decorate(block) {
  // --- Default card data ---
  const DEFAULT_HEADING = 'Find answers to your questions';
  const DEFAULT_CARDS = [
    {
      img: 'https://www.thereadypatient.com/content/dam/zb-content-hub/homepage/re-design/bodypart-knee.jpg',
      label: 'Knee Articles',
      href: '/knee.html',
    },
    {
      img: 'https://www.thereadypatient.com/content/dam/zb-content-hub/homepage/re-design/bodypart-hip.jpg',
      label: 'Hip Articles',
      href: '/hip.html',
    },
    {
      img: 'https://www.thereadypatient.com/content/dam/zb-content-hub/homepage/re-design/bodypart-foot-ankle.jpg',
      label: 'Foot/Ankle Articles',
      href: '/foot-ankle.html',
    },
    {
      img: 'https://www.thereadypatient.com/content/dam/zb-content-hub/homepage/re-design/bodypart-shoulder.jpg',
      label: 'Shoulder Articles',
      href: '/shoulder.html',
    },
    {
      img: 'https://www.thereadypatient.com/content/dam/zb-content-hub/homepage/re-design/bodypart-elbow.jpg',
      label: 'Elbow Articles',
      href: '/elbow.html',
    },
    {
      img: 'https://www.thereadypatient.com/content/dam/zb-content-hub/homepage/re-design/bodypart-brain.jpg',
      label: 'Brain Articles',
      href: '/brain.html',
    },
  ];

  // --- Parse block rows ---
  let sectionHeading = DEFAULT_HEADING;
  const cardData = [];

  const rows = [...block.querySelectorAll(':scope > div')];
  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];

    // Key-value row: section-heading override
    if (cells.length === 2) {
      const key = cells[0].textContent.trim().toLowerCase();
      if (key === 'section-heading') {
        sectionHeading = cells[1].textContent.trim() || DEFAULT_HEADING;
        return; // skip — not a card row
      }
    }

    // Card row: 3 cells → img | label | href
    if (cells.length >= 3) {
      // Cell 0: img element or text URL
      const imgEl = cells[0].querySelector('img');
      const imgSrc = imgEl ? imgEl.src : cells[0].textContent.trim();

      // Cell 1: label text
      const label = cells[1].textContent.trim();

      // Cell 2: anchor href or plain text URL
      const anchorEl = cells[2].querySelector('a');
      const href = anchorEl ? anchorEl.href : cells[2].textContent.trim();

      // Only push if we have at least an image or a label
      if (imgSrc || label) {
        cardData.push({ img: imgSrc, label, href: href || '#' });
      }
    }
  });

  // Fall back to defaults when the table had no card rows
  const cards = cardData.length > 0 ? cardData : DEFAULT_CARDS;

  // --- Build DOM ---
  block.innerHTML = '';
  block.classList.add('cards-block');

  // Section heading
  const h2 = document.createElement('h2');
  h2.className = 'cards-heading';
  h2.textContent = sectionHeading;

  // Card grid
  const grid = document.createElement('div');
  grid.className = 'cards-grid';

  cards.forEach(({ img, label, href }) => {
    const anchor = document.createElement('a');
    anchor.className = 'cards-card';
    anchor.href = href;
    anchor.setAttribute('aria-label', label);
    if (img) {
      // Use unique ID to scope the background style per card
      const cardId = `cards-card-${Math.random().toString(36).slice(2, 8)}`;
      anchor.dataset.cardId = cardId;
      const cardStyle = document.createElement('style');
      cardStyle.textContent = `[data-card-id="${cardId}"] { background-image: url('${img}'); }`;
      anchor.appendChild(cardStyle);
    }

    const overlay = document.createElement('div');
    overlay.className = 'cards-overlay';

    const span = document.createElement('span');
    span.className = 'cards-label';
    span.textContent = label;

    overlay.append(span);
    anchor.append(overlay);
    grid.append(anchor);
  });

  block.append(h2, grid);
}
