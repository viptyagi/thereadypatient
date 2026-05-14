import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // Always build ReadyPatient footer (replace boilerplate or build from our footer.html)
  const isBoilerplate = fragment?.textContent?.includes('2021 Adobe');
  const isOurFooter = fragment?.textContent?.includes('ReadyPatient');

  if (isBoilerplate || isOurFooter || !fragment?.textContent?.trim()) {
    if (fragment) fragment.replaceChildren();
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="footer-nav">
        <div class="footer-col">
          <ul>
            <li><a href="/about-us.html">About Us</a></li>
            <li><a href="/about-us/contributors.html">Contributors</a></li>
            <li><a href="/about-us/contact-us.html">Contact Us</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <ul>
            <li><a href="/find-a-doc.html">Find a Doctor</a></li>
            <li><a href="/get-updates.html">Get Updates</a></li>
            <li><a href="/share-your-story.html">Share Your Story</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <ul>
            <li><a href="/hip.html">Hip Articles</a></li>
            <li><a href="/knee.html">Knee Articles</a></li>
            <li><a href="/foot-ankle.html">Foot and Ankle Articles</a></li>
            <li><a href="/shoulder.html">Shoulder Articles</a></li>
            <li><a href="/elbow.html">Elbow Articles</a></li>
            <li><a href="/brain.html">Brain Articles</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-disclaimer">
        <p>Zimmer Biomet does not practice medicine and the content of this site is intended for general public interest. The content is not intended to constitute medical, legal, or any other sort of professional advice. Please consult with your physician or other healthcare professional for medical advice and see the Legal Notice link.</p>
      </div>
      <div class="footer-bottom">
        <div class="footer-links">
          <a href="https://www.zimmerbiomet.com/">ZimmerBiomet.com</a>
          <a href="https://www.zimmerbiomet.com/en/corporate/legal-notice.html">Legal Notices</a>
          <a href="https://www.zimmerbiomet.com/en/corporate/privacy-notice.html">Privacy Notice</a>
          <a href="https://www.zimmerbiomet.com/en/corporate/cookies-notice.html">Cookie Notice</a>
          <a href="https://www.zimmerbiomet.com/en/corporate/consumer-health-data-privacy-policy.html">Consumer Health Data Privacy Policy</a>
          <a href="/sitemap.xml">Sitemap</a>
        </div>
        <div class="footer-copyright">
          <span>&copy; 2025 Zimmer Biomet</span>
        </div>
      </div>
    `;
    if (fragment) {
      fragment.append(wrapper);
    } else {
      block.textContent = '';
      block.append(wrapper);
      return;
    }
  }

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  if (fragment) {
    while (fragment.firstElementChild) footer.append(fragment.firstElementChild);
  }
  block.append(footer);
}
