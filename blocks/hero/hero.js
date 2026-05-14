import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  const imageRow = rows.find((row) => row.querySelector('picture'));
  const contentRows = rows.filter((row) => row !== imageRow);

  if (imageRow) {
    const picture = imageRow.querySelector('picture');
    const img = picture?.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(
        img.src,
        img.alt,
        false,
        [{ width: '750' }, { width: '1280' }, { width: '2000' }],
      );
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      picture.replaceWith(optimizedPic);
    }
    imageRow.className = 'hero-image';
  }

  const card = document.createElement('div');
  card.className = 'hero-card';
  contentRows.forEach((row) => {
    moveInstrumentation(row, card);
    while (row.firstElementChild) card.append(row.firstElementChild);
    row.remove();
  });

  if (card.children.length) block.append(card);
}

