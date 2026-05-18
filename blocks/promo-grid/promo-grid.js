export default function decorate(block) {
  const rows = [...block.children];
  block.textContent = '';

  let heading = null;
  const cards = [];

  rows.forEach((row) => {
    const cells = [...row.children];
    const firstText = cells[0]?.textContent?.trim().toLowerCase().replace(/\s+/g, '-');

    if (firstText === 'section-heading') {
      heading = cells[1]?.textContent?.trim();
      return;
    }

    // Each card row has: title, description, cta-text, cta-href, theme, bg-image
    const title = cells[0]?.textContent?.trim();
    const description = cells[1]?.textContent?.trim();
    const ctaText = cells[2]?.textContent?.trim();
    const ctaHref = cells[3]?.textContent?.trim();
    const theme = cells[4]?.textContent?.trim() || 'light';
    const bgImage = cells[5]?.textContent?.trim();

    if (title) cards.push({ title, description, ctaText, ctaHref, theme, bgImage });
  });

  if (heading) {
    const h2 = document.createElement('h2');
    h2.className = 'pg-heading';
    h2.textContent = heading;
    block.appendChild(h2);
  }

  const grid = document.createElement('div');
  grid.className = 'pg-grid';

  cards.forEach((card) => {
    const cardEl = document.createElement('div');
    cardEl.className = `pg-card pg-card--${card.theme}`;

    if (card.bgImage) {
      cardEl.style.backgroundImage = `url('${card.bgImage}')`;
    }

    const content = document.createElement('div');
    content.className = 'pg-card-content';

    const h3 = document.createElement('h3');
    h3.className = 'pg-card-heading';
    h3.textContent = card.title;
    content.appendChild(h3);

    if (card.description) {
      const p = document.createElement('p');
      p.className = 'pg-card-body';
      p.textContent = card.description;
      content.appendChild(p);
    }

    if (card.ctaText && card.ctaHref) {
      const a = document.createElement('a');
      a.className = 'pg-card-cta';
      a.href = card.ctaHref;
      a.textContent = card.ctaText;
      content.appendChild(a);
    }

    cardEl.appendChild(content);
    grid.appendChild(cardEl);
  });

  block.appendChild(grid);
}
