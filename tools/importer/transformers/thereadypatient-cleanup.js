/* eslint-disable */
/* global WebImporter */

// Restore native document.createElement immediately at module load time.
// OneTrust OtAutoBlock.js (cdn.cookielaw.org) monkey-patches document.createElement
// to intercept resource-loading elements, causing TypeError: Cannot redefine property: src.
// This must run before any other code that calls document.createElement.
try {
  if (typeof Document !== 'undefined' && Document.prototype.createElement) {
    document.createElement = Document.prototype.createElement.bind(document);
  }
} catch (e) { /* non-browser env */ }

/**
 * Transformer: thereadypatient cleanup.
 * Removes non-authorable site chrome and tracking elements.
 * Selectors verified from captured DOM (migration-work/cleaned.html).
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    const doc = element.ownerDocument || document;

    // Remove OneTrust cookie consent DOM elements and scripts (injected dynamically at runtime)
    doc.querySelectorAll('script[src*="cookielaw.org"], script[src*="onetrust"], script[src*="OneTrust"]').forEach((el) => el.remove());
    doc.querySelectorAll('#onetrust-consent-sdk, #onetrust-banner-sdk, [class*="onetrust"], [id*="onetrust"]').forEach((el) => el.remove());

    // Remove inline SVG sprite sheet (icon definitions, not authorable content)
    // Found at line 3: <img src="data:image/svg+xml;base64,...">
    const svgSprites = element.querySelectorAll('img[src^="data:image/svg+xml"]');
    svgSprites.forEach((el) => el.remove());
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove header experience fragment (homepage: .cmp-experiencefragment--zb-header-ef)
    WebImporter.DOMUtils.remove(element, [
      '.cmp-experiencefragment--zb-header-ef',
    ]);

    // Remove footer experience fragment (homepage: .cmp-experiencefragment--zb-footer-ef)
    // and footer component (category-landing: .footer.footer--default, cleaned.html line 178)
    WebImporter.DOMUtils.remove(element, [
      '.cmp-experiencefragment--zb-footer-ef',
      '.footer--default',
    ]);

    // Remove tracking iframes (lines 390-392)
    // <iframe src="https://servedby.flashtalking.com/...">
    // <iframe id="destination_publishing_iframe_zimmer_0" class="aamIframeLoaded">
    WebImporter.DOMUtils.remove(element, [
      'iframe',
    ]);
  }
}
