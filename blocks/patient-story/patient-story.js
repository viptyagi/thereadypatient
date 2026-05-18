export default function decorate(block) {
  const rows = [...block.children];
  const data = {};

  rows.forEach((row) => {
    const key = row.children[0]?.textContent?.trim().toLowerCase().replace(/\s+/g, '-');
    const value = row.children[1]?.textContent?.trim();
    if (key && value) data[key] = value;
  });

  block.textContent = '';

  const sectionHeading = data['section-heading'];
  if (sectionHeading) {
    const h2 = document.createElement('h2');
    h2.className = 'ps-section-heading';
    h2.textContent = sectionHeading;
    block.appendChild(h2);
  }

  const inner = document.createElement('div');
  inner.className = 'ps-inner';

  const textDiv = document.createElement('div');
  textDiv.className = 'ps-text';

  if (data['patient-name']) {
    const h3 = document.createElement('h3');
    h3.className = 'ps-name';
    h3.textContent = data['patient-name'];
    textDiv.appendChild(h3);
  }

  if (data.quote) {
    const bq = document.createElement('blockquote');
    bq.className = 'ps-quote';
    bq.innerHTML = `<span class="ps-quote-mark ps-quote-mark--open" aria-hidden="true">“</span><p class="ps-quote-text">${data.quote}</p><span class="ps-quote-mark ps-quote-mark--close" aria-hidden="true">”</span>`;
    textDiv.appendChild(bq);
  }

  if (data['cta-text'] && data['cta-href']) {
    const a = document.createElement('a');
    a.className = 'ps-cta';
    a.href = data['cta-href'];
    a.textContent = data['cta-text'];
    textDiv.appendChild(a);
  }

  inner.appendChild(textDiv);

  if (data.photo) {
    const photoDiv = document.createElement('div');
    photoDiv.className = 'ps-photo';
    const img = document.createElement('img');
    img.className = 'ps-photo-img';
    img.src = data.photo;
    img.alt = data['patient-name'] || '';
    img.loading = 'lazy';
    photoDiv.appendChild(img);
    inner.appendChild(photoDiv);
  }

  block.appendChild(inner);
}
