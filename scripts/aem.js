/**
 * aem.js — EDS (Adobe Edge Delivery Services) helper module
 * TheReadyPatient EDS Migration
 */

/**
 * Converts a name string to a valid CSS class name segment.
 * Lowercases, replaces non-alphanumeric characters with hyphens,
 * collapses multiple hyphens, and trims leading/trailing hyphens.
 * @param {string} name
 * @returns {string}
 */
export function toClassName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Reads a 2-column EDS table block into a key/value config object.
 * Key = first column text, converted via toClassName.
 * Value = second column textContent (trimmed).
 * @param {Element} block
 * @returns {Object}
 */
export function readBlockConfig(block) {
  const config = {};
  block.querySelectorAll(':scope > div').forEach((row) => {
    const cols = row.querySelectorAll(':scope > div');
    if (cols.length === 2) {
      const key = toClassName(cols[0].textContent.trim());
      const value = cols[1].textContent.trim();
      config[key] = value;
    }
  });
  return config;
}

/**
 * Decorates a single block element:
 * - Adds the class 'block'
 * - Sets data-block-name from the first class on the element
 * - Sets data-block-status to 'initialized'
 * - Wraps the block's parent div with a <name>-wrapper class
 * @param {Element} block
 */
export function decorateBlock(block) {
  const shortName = block.classList[0];
  if (!shortName) return;

  block.classList.add('block');
  block.dataset.blockName = shortName;
  block.dataset.blockStatus = 'initialized';

  const wrapper = block.parentElement;
  if (wrapper) {
    wrapper.classList.add(`${shortName}-wrapper`);
  }
}

/**
 * Decorates all block elements found at main > .section > div > div.
 * @param {Element} main
 */
export function decorateBlocks(main) {
  main.querySelectorAll(':scope > .section > div > div').forEach(decorateBlock);
}

/**
 * Loads a CSS file by appending a <link rel="stylesheet"> to the document head.
 * No-ops if a link with the same href already exists.
 * @param {string} href
 * @returns {Promise<void>}
 */
export function loadCSS(href) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`link[rel="stylesheet"][href="${href}"]`)) {
      resolve();
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

/**
 * Loads a block's CSS and JS, then calls the module's default export.
 * Skips if the block is already loading or loaded.
 * @param {Element} block
 * @returns {Promise<void>}
 */
export async function loadBlock(block) {
  const status = block.dataset.blockStatus;
  if (status === 'loading' || status === 'loaded') return;

  block.dataset.blockStatus = 'loading';
  const blockName = block.dataset.blockName;
  const cssPath = `/blocks/${blockName}/${blockName}.css`;
  const jsPath = `/blocks/${blockName}/${blockName}.js`;

  try {
    await Promise.all([
      loadCSS(cssPath),
      import(jsPath).then((mod) => {
        if (mod.default) {
          return mod.default(block);
        }
      }),
    ]);
    block.dataset.blockStatus = 'loaded';
  } catch (err) {
    console.error(`Failed to load block: ${blockName}`, err);
    block.dataset.blockStatus = 'error';
  }
}

/**
 * Loads all initialized blocks in the given main element, in document order.
 * @param {Element} main
 * @returns {Promise<void>}
 */
export async function loadBlocks(main) {
  const blocks = [...main.querySelectorAll('[data-block-status="initialized"]')];
  for (const block of blocks) {
    // eslint-disable-next-line no-await-in-loop
    await loadBlock(block);
  }
}

/**
 * Decorates standalone <a> tags as buttons.
 * Adds classes 'btn' and 'primary' to links whose:
 * - Parent <p> is the only child of its parent element
 * - Link does not contain an <img> child
 * @param {Element} main
 */
export function decorateButtons(main) {
  main.querySelectorAll('a').forEach((a) => {
    const parent = a.parentElement;
    if (parent && parent.tagName === 'P') {
      const grandparent = parent.parentElement;
      if (
        grandparent &&
        grandparent.children.length === 1 &&
        !a.querySelector('img')
      ) {
        a.classList.add('btn', 'primary');
      }
    }
  });
}

/**
 * Decorates sections in main:
 * - Wraps each direct child div with class 'section' if not already present
 * - Wraps non-block content inside a 'default-content-wrapper' div
 * @param {Element} main
 */
export function decorateSections(main) {
  main.querySelectorAll(':scope > div').forEach((section) => {
    if (!section.classList.contains('section')) {
      section.classList.add('section');
    }

    // Wrap non-block child divs in a default-content-wrapper
    const defaultWrapper = document.createElement('div');
    defaultWrapper.classList.add('default-content-wrapper');

    let hasDefaultContent = false;

    [...section.children].forEach((child) => {
      // A block is identified by having multiple classes (block name + 'block') or data-block-name
      const isBlock =
        child.tagName === 'DIV' &&
        (child.dataset.blockName || child.classList.length > 1);

      if (!isBlock && child.tagName !== 'DIV') {
        hasDefaultContent = true;
        defaultWrapper.appendChild(child);
      } else if (!isBlock && child.tagName === 'DIV' && !child.querySelector('[data-block-name]')) {
        // Plain div without block markers → treat as default content
        hasDefaultContent = true;
        defaultWrapper.appendChild(child);
      }
    });

    if (hasDefaultContent) {
      section.insertBefore(defaultWrapper, section.firstChild);
    }
  });
}

/**
 * Runs all main-element decorations in order:
 * decorateSections → decorateBlocks → decorateButtons
 * @param {Element} main
 */
export function decorateMain(main) {
  decorateSections(main);
  decorateBlocks(main);
  decorateButtons(main);
}

/**
 * Full page load sequence:
 * 1. Decorates the main element
 * 2. Loads all blocks
 * 3. Adds 'appear' class to body to trigger CSS transitions
 * @returns {Promise<void>}
 */
export async function loadPage() {
  const main = document.querySelector('main');

  // Load header and footer blocks (outside <main>)
  const headerBlock = document.querySelector('.header.block');
  const footerBlock = document.querySelector('.footer.block');

  if (headerBlock) await loadBlock(headerBlock);

  if (main) {
    decorateMain(main);
    await loadBlocks(main);
  }

  if (footerBlock) await loadBlock(footerBlock);

  document.body.classList.add('appear');
}
