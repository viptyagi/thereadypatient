import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  const ul = document.createElement('ul');
  let sectionHeading = null;

  rows.forEach((row) => {
    const cells = [...row.children];
    const firstCellText = cells[0]?.textContent?.trim();

    // Handle section-heading row
    if (firstCellText === 'section-heading') {
      const headingText = cells[1]?.textContent?.trim();
      if (headingText) {
        sectionHeading = document.createElement('h3');
        sectionHeading.className = 'cards-section-heading';
        sectionHeading.textContent = headingText;
      }
      return;
    }

    const li = document.createElement('li');
    moveInstrumentation(row, li);

    // Check if first cell is an image URL (text) or a picture element
    const hasPicture = cells[0]?.querySelector('picture');
    const isImageUrl = firstCellText && (firstCellText.startsWith('http') || firstCellText.startsWith('/content/dam'));

    if (hasPicture) {
      // Standard EDS cards format with picture elements
      while (row.firstElementChild) li.append(row.firstElementChild);
      [...li.children].forEach((div) => {
        if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
        else div.className = 'cards-card-body';
      });
    } else if (isImageUrl && cells.length >= 2) {
      // AEM xwalk format: [imageUrl, title, linkPath]
      const imageUrl = firstCellText;
      const title = cells[1]?.textContent?.trim();
      const linkPath = cells[2]?.textContent?.trim();

      const imageDiv = document.createElement('div');
      imageDiv.className = 'cards-card-image';
      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = title || '';
      img.loading = 'lazy';
      imageDiv.appendChild(img);
      li.appendChild(imageDiv);

      const bodyDiv = document.createElement('div');
      bodyDiv.className = 'cards-card-body';
      if (linkPath) {
        const a = document.createElement('a');
        a.href = linkPath;
        a.textContent = title || '';
        bodyDiv.appendChild(a);
      } else if (title) {
        const p = document.createElement('p');
        p.textContent = title;
        bodyDiv.appendChild(p);
      }
      li.appendChild(bodyDiv);
    } else {
      while (row.firstElementChild) li.append(row.firstElementChild);
      [...li.children].forEach((div) => {
        if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
        else div.className = 'cards-card-body';
      });
    }

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  if (sectionHeading) block.appendChild(sectionHeading);
  block.appendChild(ul);
}
