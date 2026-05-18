/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-category
 * Base block: hero
 * Source selector: .hero-headline.image .hero-headlines--blank
 * Source: https://www.thereadypatient.com/knee.html
 * Generated: 2026-05-15
 * Note: Live validation blocked by OneTrust OtAutoBlock.js patching document.createElement
 * on thereadypatient.com (site-wide issue affecting all parsers, not parser-specific).
 *
 * Category page hero with heading, paragraph text, and banner image (from
 * inline background-image style) on a dark teal background. No CTA button.
 *
 * UE Model fields:
 *   - image (reference) -> Row 1: banner image
 *   - imageAlt (text) -> collapsed into image alt attribute
 *   - text (richtext) -> Row 2: heading + paragraph
 */
export default function parse(element, { document }) {
  // --- Extract banner image URL from inline background-image style ---
  let bgUrl = '';
  const bgStyle = element.getAttribute('style') || '';
  const bgMatch = bgStyle.match(/background-image\s*:\s*url\(["']?(.*?)["']?\)/i);
  if (bgMatch && bgMatch[1]) {
    bgUrl = bgMatch[1].trim();
    if (bgUrl.startsWith('/')) {
      bgUrl = 'https://www.thereadypatient.com' + bgUrl;
    }
  }
  // Also check computed style.backgroundImage
  if (!bgUrl && element.style && element.style.backgroundImage) {
    const match = element.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
    if (match && match[1]) {
      bgUrl = match[1];
    }
  }

  // Create image element via createRange to avoid OneTrust createElement interference
  let imageEl = element.querySelector('picture, img');
  if (!imageEl && bgUrl) {
    const range = document.createRange();
    range.selectNode(document.body);
    const frag = range.createContextualFragment('<img src="' + bgUrl.replace(/"/g, '&quot;') + '">');
    imageEl = frag.querySelector('img');
  }

  // --- Extract heading (h1 inside .hero-headlines__supertitle) ---
  const heading = element.querySelector('.hero-headlines__supertitle h1, .hero-headlines__supertitle h2, h1, h2');

  // --- Extract paragraph text (inside .hero-headlines__title .rich-text) ---
  const richText = element.querySelector('.hero-headlines__title .rich-text, .hero-headlines__title');
  const paragraph = richText ? richText.querySelector('p') : element.querySelector('p');

  // --- Build cells matching library example structure ---
  // Row 1: Image (banner) -- field: image
  // Row 2: Heading + paragraph text -- field: text
  const cells = [];

  // Row 1: Image
  const imageCell = document.createDocumentFragment();
  imageCell.appendChild(document.createComment(' field:image '));
  if (imageEl) {
    imageCell.appendChild(imageEl);
  }
  cells.push([imageCell]);

  // Row 2: Text content (heading + paragraph)
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));
  if (heading) {
    textCell.appendChild(heading);
  }
  if (paragraph) {
    textCell.appendChild(paragraph);
  } else if (richText) {
    textCell.appendChild(richText);
  }
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-category', cells });
  element.replaceWith(block);
}
