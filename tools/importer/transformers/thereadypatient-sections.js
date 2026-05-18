/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: thereadypatient sections.
 * Inserts section breaks (<hr>) between content sections based on template definitions.
 * Selectors verified from captured DOM (migration-work/cleaned.html):
 *   - Section 1: .hero-headline.image:first-of-type (line 169)
 *   - Section 2: #title-83bd028105 (line 193)
 *   - Section 3: #title-b71b7dca44 (line 222)
 *   - Section 4: #title-27543d93ee (line 246)
 *   - Section 5: #text-e30175cbcb (line 294)
 * No section-metadata needed (all sections have style: null).
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const sections = payload?.template?.sections;
    if (!sections || !Array.isArray(sections) || sections.length < 2) return;

    const doc = element.ownerDocument || document;

    // Process sections in reverse order to preserve DOM positions
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (!section.selector) continue;

      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue;

      // Insert section-metadata block if section has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.parentNode.insertBefore(metaBlock, sectionEl.nextSibling);
      }

      // Insert <hr> before every section except the first one
      if (i > 0) {
        const hr = doc.createElement('hr');
        sectionEl.parentNode.insertBefore(hr, sectionEl);
      }
    }
  }
}
