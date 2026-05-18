/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-landing
 * Base block: hero
 * Source: https://www.thereadypatient.com/
 * Selector: .hero-headline.image:first-of-type .hero-headlines--blank
 * Generated: 2026-05-12
 *
 * UE Model fields (xwalk):
 *   - image (reference) + imageAlt (collapsed)
 *   - text (richtext)
 *
 * Source structure:
 *   - img (background image, direct child of .hero-headlines--blank)
 *   - h1.heading inside .hero-headlines__supertitle
 *   - p (description) inside .rich-text
 *   - p > b (bold CTA text) inside .rich-text
 *   - a.button (CTA link)
 */
export default function parse(element, { document }) {
  // --- Extract background image ---
  // The element is .hero-headlines--blank. The image may be:
  //   1. A direct <img> or <picture> child of this element
  //   2. An <img> or <picture> inside the parent .hero-headline container
  //   3. A CSS background-image on the element, its parent, or a sibling/child
  const pictureEl = element.querySelector('picture');
  const imgEl = element.querySelector('img');
  let bgImage = pictureEl || imgEl;

  // Check parent element (.hero-headline.image) for img/picture if not found
  if (!bgImage && element.parentElement) {
    const parentPicture = element.parentElement.querySelector(':scope > picture, :scope > img');
    if (parentPicture) {
      bgImage = parentPicture;
    } else {
      // Also look for img/picture anywhere in the parent but outside this element
      const parentImg = element.parentElement.querySelector('picture, img');
      if (parentImg && !element.contains(parentImg)) {
        bgImage = parentImg;
      }
    }
  }

  // If no <img>/<picture> found, check for background-image in inline styles
  // on the element, its parent, or any child
  let bgImageFromStyle = null;
  if (!bgImage) {
    const candidates = [element, element.parentElement, ...Array.from(element.querySelectorAll('*'))];
    for (const candidate of candidates) {
      if (candidate && candidate.style && candidate.style.backgroundImage) {
        const match = candidate.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
        if (match && match[1]) {
          bgImageFromStyle = (window.__nativeCreateElement || document.createElement.bind(document))('img');
          bgImageFromStyle.src = match[1];
          break;
        }
      }
    }
  }

  const imageNode = bgImage || bgImageFromStyle;

  // --- Extract text content (heading + description + bold text + CTA) ---
  const heading = element.querySelector('h1, h2, [class*="supertitle"] h1, [class*="supertitle"] h2');
  const richTextContainer = element.querySelector('.rich-text, [class*="rich-text"]');
  const paragraphs = richTextContainer
    ? Array.from(richTextContainer.querySelectorAll(':scope > p'))
    : Array.from(element.querySelectorAll('.hero-headlines__title p, .hero-headlines__text-overlay p'));
  const ctaLink = element.querySelector('a.button, a[class*="button"], .hero-headlines__text-overlay a');

  // --- Build image cell (Row 1) with field hint ---
  // xwalk: Row must always exist per model (image field)
  const imageFrag = document.createDocumentFragment();
  if (imageNode) {
    imageFrag.appendChild(document.createComment(' field:image '));
    imageFrag.appendChild(imageNode);
  }
  const imageCell = [imageFrag];

  // --- Build text cell (Row 2) with field hint ---
  // Combines heading, paragraph text, bold CTA text, and CTA button
  const textFrag = document.createDocumentFragment();
  textFrag.appendChild(document.createComment(' field:text '));

  if (heading) {
    textFrag.appendChild(heading);
  }

  // Add paragraphs (description + bold CTA text)
  paragraphs.forEach((p) => {
    textFrag.appendChild(p);
  });

  // Add CTA button link — wrap in <p> if not already in one
  if (ctaLink) {
    // Check if the CTA was already included as part of a paragraph
    const alreadyIncluded = paragraphs.some((p) => p.contains(ctaLink));
    if (!alreadyIncluded) {
      const ctaParagraph = (window.__nativeCreateElement || document.createElement.bind(document))('p');
      ctaParagraph.appendChild(ctaLink);
      textFrag.appendChild(ctaParagraph);
    }
  }

  const textCell = [textFrag];

  // --- Assemble cells to match block library structure ---
  // Row 1: background image (field:image)
  // Row 2: heading + text + CTA (field:text)
  const cells = [imageCell, textCell];

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-landing', cells });
  element.replaceWith(block);
}
