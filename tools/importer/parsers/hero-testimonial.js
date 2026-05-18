/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-testimonial
 * Base block: hero
 * Source: https://www.thereadypatient.com/
 * Selector: .hero-headline.image ~ .hero-headline.image .hero-headlines--blank
 * Generated: 2026-05-12
 *
 * Source HTML structure (live page):
 *   div.hero-headlines.hero-headlines--blank [style="background-image:url(...)"]
 *     div.hero-headlines__text-overlay
 *       div.hero-headlines__supertitle > h1.heading (patient name)
 *       div.hero-headlines__title > div.rich-text > h5 (testimonial quote)
 *       a.button--primary (CTA link)
 *
 * UE Model fields (from _hero.json):
 *   - image (reference) -> Row 1
 *   - imageAlt (collapsed into image, skip)
 *   - text (richtext) -> Row 2
 *
 * Target block structure (from library example):
 *   Row 1: Background image (with field:image hint)
 *   Row 2: Heading + quote text + CTA (with field:text hint)
 */
export default function parse(element, { document }) {
  // --- Extract content from source HTML using validated selectors ---

  // Background image: may be an <img> child OR a CSS background-image on the element itself
  let bgImage = element.querySelector(':scope > img, img.hero-headlines__image');
  if (!bgImage) {
    // Live page uses background-image style on the element
    const bgStyle = element.getAttribute('style') || '';
    const bgMatch = bgStyle.match(/background-image\s*:\s*url\(["']?([^"')]+)["']?\)/);
    if (bgMatch) {
      bgImage = (window.__nativeCreateElement || document.createElement.bind(document))('img');
      bgImage.src = bgMatch[1];
      bgImage.alt = '';
    }
  }

  // Heading (h1): patient name inside .hero-headlines__supertitle
  const heading = element.querySelector('.hero-headlines__supertitle h1, .hero-headlines__supertitle h2, h1.heading');

  // Quote text (h5): testimonial quote inside .hero-headlines__title .rich-text
  const quoteEl = element.querySelector('.hero-headlines__title .rich-text h5, .hero-headlines__title h5');

  // CTA link: primary button link
  const ctaLink = element.querySelector('a.button--primary, a.button--link, .hero-headlines__text-overlay > a');

  // --- Build cells array matching library example structure ---
  // UE model has 2 non-collapsed fields: image, text -> 2 rows

  const cells = [];

  // Row 1: Background image with field:image hint
  const imageCell = document.createDocumentFragment();
  if (bgImage) {
    imageCell.appendChild(document.createComment(' field:image '));
    imageCell.appendChild(bgImage);
  }
  cells.push([imageCell]);

  // Row 2: Text content (heading + quote + CTA) with field:text hint
  const textCell = document.createDocumentFragment();
  const hasTextContent = heading || quoteEl || ctaLink;
  if (hasTextContent) {
    textCell.appendChild(document.createComment(' field:text '));
  }
  if (heading) {
    textCell.appendChild(heading);
  }
  if (quoteEl) {
    textCell.appendChild(quoteEl);
  }
  if (ctaLink) {
    textCell.appendChild(ctaLink);
  }
  cells.push([textCell]);

  // --- Create block and replace element ---
  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-testimonial', cells });
  element.replaceWith(block);
}
