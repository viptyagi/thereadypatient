/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-article
 * Base block: cards
 * Source: https://www.thereadypatient.com/knee.html (category-landing template)
 * Selector: .journey-selector-new .journey-selector-new--default
 * Project type: xwalk (field hints enabled)
 * Generated: 2026-05-15
 *
 * Extracts article cards from the journey-selector grid. Each article card is
 * an <a> element with class "article-card" containing a thumbnail image
 * (div.imageQ > img), a category tag (span.theme-tag), and an article title
 * (h1.article-title). The journey stage filter checkboxes, article count, and
 * pagination controls are interactive JS-driven elements that are not imported.
 *
 * Source DOM structure:
 *   form.journey-selector-new.journey-selector-new--default
 *     div.container-labels (filter checkboxes -- skipped)
 *     div.card-count (article count -- skipped)
 *     div.journey-selector-new__results
 *       a.article-card[href] (x12+)
 *         div.imageQ > img
 *         section.title-desc
 *           span.theme-tag.tagcolor-* (category label)
 *           h1.article-title (article title)
 *     div.journey-selector-new__pagination (pagination -- skipped)
 *
 * UE Model (cards): container block, each card item has fields: image, text
 * Output: one row per article card, columns: [image, text (title + category + link)]
 */
export default function parse(element, { document }) {
  // Select all article card links from the results grid
  const articleCards = element.querySelectorAll(
    '.journey-selector-new__results > a.article-card, .journey-selector-new__results > .article-card'
  );

  const cells = [];

  articleCards.forEach((card) => {
    // Column 1: Image
    // Extract thumbnail image from div.imageQ
    const img = card.querySelector('.imageQ img, img');

    // Build image cell with field hint
    const imageCell = document.createDocumentFragment();
    if (img) {
      imageCell.appendChild(document.createComment(' field:image '));
      imageCell.appendChild(img);
    }

    // Column 2: Text content (category tag + title + link)
    const categoryTag = card.querySelector('.theme-tag, span[class*="tagcolor"]');
    const titleEl = card.querySelector('h1.article-title, h2.article-title, .article-title');
    const href = card.getAttribute('href') || '';

    // Build text cell with field hint
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));

    // Add category tag as a paragraph if present
    if (categoryTag) {
      const tagP = (window.__nativeCreateElement || document.createElement.bind(document))('p');
      const em = (window.__nativeCreateElement || document.createElement.bind(document))('em');
      em.textContent = categoryTag.textContent.trim();
      tagP.appendChild(em);
      textCell.appendChild(tagP);
    }

    // Add title as a linked heading
    if (titleEl || href) {
      const titleText = titleEl ? titleEl.textContent.trim() : '';
      if (titleText && href) {
        // Create a linked heading to preserve both the title and the article link
        const h3 = (window.__nativeCreateElement || document.createElement.bind(document))('h3');
        const link = (window.__nativeCreateElement || document.createElement.bind(document))('a');
        link.setAttribute('href', href);
        link.textContent = titleText;
        h3.appendChild(link);
        textCell.appendChild(h3);
      } else if (titleText) {
        // Title without link
        const h3 = (window.__nativeCreateElement || document.createElement.bind(document))('h3');
        h3.textContent = titleText;
        textCell.appendChild(h3);
      } else if (href) {
        // Link without title text -- fallback
        const p = (window.__nativeCreateElement || document.createElement.bind(document))('p');
        const link = (window.__nativeCreateElement || document.createElement.bind(document))('a');
        link.setAttribute('href', href);
        link.textContent = href;
        p.appendChild(link);
        textCell.appendChild(p);
      }
    }

    // Each card = one row with two columns: [image, text]
    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-article',
    cells,
  });

  element.replaceWith(block);
}
