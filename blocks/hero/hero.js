export default function decorate(block) {
  // --- Read config from block table rows (key | value) ---
  const cfg = {};
  [...block.querySelectorAll(':scope > div')].forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (cells.length === 2) {
      const key = cells[0].textContent.trim().toLowerCase();
      const val = cells[1].textContent.trim();
      cfg[key] = val;
    }
  });

  // --- Defaults ---
  const bgImage =
    cfg['bg-image'] ||
    'https://www.thereadypatient.com/content/dam/zb-content-hub/homepage/re-design/Banner_Homepage.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg';
  const heading =
    cfg['heading'] || 'ReadyPatient\u2122 exists to cultivate hope.';
  const body =
    cfg['body'] ||
    'Knowledge is power. Our content is designed to empower you by connecting you with people, resources, and tools to help you along your personal journey to alleviate joint pain.';
  const subBody =
    cfg['sub-body'] || 'Get started on your personalized journey!';
  const ctaText = cfg['cta-text'] || 'START HERE!';
  const ctaHref = cfg['cta-href'] || '/quiz.html';

  // --- Build DOM ---
  block.innerHTML = '';
  block.classList.add('hero-block');

  // Wrapper — carries the background image
  const wrapper = document.createElement('div');
  wrapper.className = 'hero-wrapper';
  // Inject background via <style> tag to avoid inline-style sanitization in sandboxed previews
  const bgStyle = document.createElement('style');
  bgStyle.textContent = `.hero-wrapper { background-image: url('${bgImage}'); }`;
  block.appendChild(bgStyle);

  // Overlay (gradient)
  const overlay = document.createElement('div');
  overlay.className = 'hero-overlay';

  // Content panel
  const content = document.createElement('div');
  content.className = 'hero-content';

  const h1 = document.createElement('h1');
  h1.className = 'hero-heading';
  h1.textContent = heading;

  const bodyP = document.createElement('p');
  bodyP.className = 'hero-body';
  bodyP.textContent = body;

  const subP = document.createElement('p');
  subP.className = 'hero-subtext';
  subP.textContent = subBody;

  const cta = document.createElement('a');
  cta.className = 'hero-cta';
  cta.href = ctaHref;
  cta.textContent = ctaText;

  content.append(h1, bodyP, subP, cta);
  wrapper.append(overlay, content);
  block.append(wrapper);
}
