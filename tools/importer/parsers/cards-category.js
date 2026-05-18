/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-category variant.
 * Base block: cards
 * Source: https://www.thereadypatient.com/
 * Selector: .article-categories .article-categories--default
 * Generated: 2026-05-12
 *
 * Source DOM structure:
 *   div.article-categories.article-categories--default
 *     a.link.card[href] (x6)
 *       div.card__body.card__body--default  -> category label text
 *
 * UE Model (container block):
 *   Card child fields: image (reference), text (richtext)
 *   Each card = one row with columns: [image, text]
 *
 * Cards: Knee, Hip, Foot/Ankle, Shoulder, Elbow, Brain
 * Source has text-only cards with links (no images).
 */
export default function parse(element, { document }) {
  // Extract all card link elements from the source
  const cardLinks = element.querySelectorAll(':scope > a.card, :scope > a.link');

  const cells = [];

  cardLinks.forEach((cardLink) => {
    // Extract the card label text from .card__body
    const cardBody = cardLink.querySelector('.card__body, .card__body--default');
    const labelText = cardBody ? cardBody.textContent.trim() : cardLink.textContent.trim();
    const href = cardLink.getAttribute('href') || '';

    // Build the image cell (empty -- source cards have no images)
    const imageCell = '';

    // Build the text cell with link and field hint
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    // Create an anchor element preserving the link and label
    const link = (window.__nativeCreateElement || document.createElement.bind(document))('a');
    link.setAttribute('href', href);
    link.textContent = labelText;

    // Wrap in a paragraph for proper richtext structure
    const p = (window.__nativeCreateElement || document.createElement.bind(document))('p');
    p.appendChild(link);
    textFrag.appendChild(p);

    // Container block: each card = one row, child properties = columns
    // Columns: [image, text]
    cells.push([imageCell, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-category', cells });
  element.replaceWith(block);
}
