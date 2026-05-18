export default function decorate(block) {
  const rows = [...block.children];
  const data = {};

  rows.forEach((row) => {
    const key = row.children[0]?.textContent?.trim().toLowerCase().replace(/\s+/g, '-');
    const value = row.children[1];
    if (key && value) data[key] = value;
  });

  block.textContent = '';

  const bgImageUrl = data['bg-image']?.textContent?.trim();
  if (bgImageUrl) {
    const imgContainer = document.createElement('div');
    imgContainer.className = 'hero-bg';
    const img = document.createElement('img');
    img.src = bgImageUrl;
    img.alt = '';
    imgContainer.appendChild(img);
    block.appendChild(imgContainer);
  }

  const content = document.createElement('div');
  content.className = 'hero-content';

  const heading = data.heading?.textContent?.trim();
  if (heading) {
    const h1 = document.createElement('h1');
    h1.textContent = heading;
    content.appendChild(h1);
  }

  const body = data.body?.textContent?.trim();
  if (body) {
    const p = document.createElement('p');
    p.textContent = body;
    content.appendChild(p);
  }

  const subBody = data['sub-body']?.textContent?.trim();
  if (subBody) {
    const p = document.createElement('p');
    p.innerHTML = `<strong>${subBody}</strong>`;
    content.appendChild(p);
  }

  const ctaText = data['cta-text']?.textContent?.trim();
  const ctaHref = data['cta-href']?.textContent?.trim();
  if (ctaText && ctaHref) {
    const a = document.createElement('a');
    a.href = ctaHref;
    a.textContent = ctaText;
    a.className = 'hero-cta';
    content.appendChild(a);
  }

  block.appendChild(content);
}
