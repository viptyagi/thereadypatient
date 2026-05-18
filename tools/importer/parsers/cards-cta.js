/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-cta
 * Base block: cards
 * Source: https://www.thereadypatient.com/
 * Selector: .resource-grid-cards .resource-grid-cards--default
 * Project type: xwalk (field hints enabled)
 * Generated: 2026-05-12
 *
 * Extracts a grid of CTA cards. Each card has a background image (via inline
 * style or <img> tag), heading (h4), description text, and a CTA button link.
 * Source DOM uses <section> wrappers with .card children. On the live page,
 * images are CSS background-image on the .card div; in cleaned HTML they may
 * be <img> tags. Output is a Cards block table with one row per card:
 * column 1 = image (field:image), column 2 = text content (field:text).
 *
 * UE Model (cards): container block, each card item has fields: image, text
 */
export default function parse(element, { document }) {
  // Select all card elements from the source DOM
  // Cards are inside <section> elements as .card children
  const cards = element.querySelectorAll('.card, .card--default');

  const cells = [];

  cards.forEach((card) => {
    // Column 1: Image
    // Try <img> tag first (cleaned HTML), then fall back to background-image style (live DOM)
    let img = card.querySelector(':scope > img, :scope img');

    if (!img) {
      // Extract background-image URL from inline style on the card div
      const style = card.getAttribute('style') || '';
      const bgMatch = style.match(/background-image\s*:\s*url\(["']?([^"')]+)["']?\)/i);
      if (bgMatch && bgMatch[1]) {
        img = (window.__nativeCreateElement || document.createElement.bind(document))('img');
        img.src = bgMatch[1];
      }
    }

    // Column 2: Text content (heading + description + CTA link)
    const heading = card.querySelector('h4, h3, h2, .heading');
    const richText = card.querySelector('.rich-text, .rich-text--default');
    const ctaLink = card.querySelector('a.button, a.button--primary, a.button--link');

    // Build image cell with field hint
    const imageCell = document.createDocumentFragment();
    if (img) {
      imageCell.appendChild(document.createComment(' field:image '));
      imageCell.appendChild(img);
    }

    // Build text cell with field hint
    const textCell = document.createDocumentFragment();
    const hasTextContent = heading || richText || ctaLink;
    if (hasTextContent) {
      textCell.appendChild(document.createComment(' field:text '));
      if (heading) textCell.appendChild(heading);
      if (richText) textCell.appendChild(richText);
      if (ctaLink) {
        const p = (window.__nativeCreateElement || document.createElement.bind(document))('p');
        p.appendChild(ctaLink);
        textCell.appendChild(p);
      }
    }

    // Each card = one row with two columns: [image, text]
    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-cta',
    cells,
  });

  element.replaceWith(block);
}
