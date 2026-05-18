/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroCategoryParser from './parsers/hero-category.js';
import cardsArticleParser from './parsers/cards-article.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/thereadypatient-cleanup.js';
import sectionsTransformer from './transformers/thereadypatient-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-category': heroCategoryParser,
  'cards-article': cardsArticleParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'category-landing',
  description: 'Category landing pages for body areas with journey sections and article listings',
  urls: [
    'https://www.thereadypatient.com/knee.html',
    'https://www.thereadypatient.com/hip.html',
    'https://www.thereadypatient.com/foot-ankle.html',
    'https://www.thereadypatient.com/shoulder.html',
    'https://www.thereadypatient.com/elbow.html',
    'https://www.thereadypatient.com/brain.html',
    'https://www.thereadypatient.com/cmf-thoracic.html',
    'https://www.thereadypatient.com/coronavirus.html',
    'https://www.thereadypatient.com/dont-let-pain-gain.html',
    'https://www.thereadypatient.com/personalization-do-not-publish.html'
  ],
  blocks: [
    {
      name: 'hero-category',
      instances: ['.hero-headline.image .hero-headlines--blank']
    },
    {
      name: 'cards-article',
      instances: ['.journey-selector-new .journey-selector-new--default']
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Breadcrumb',
      selector: '.breadcrumb-zb',
      style: 'warm-beige',
      blocks: [],
      defaultContent: ['.breadcrumb-zb']
    },
    {
      id: 'section-2',
      name: 'Hero',
      selector: '.hero-headline.image',
      style: null,
      blocks: ['hero-category'],
      defaultContent: []
    },
    {
      id: 'section-3',
      name: 'Journey Heading',
      selector: '.cmp-title .cmp-title__text.heading-align--center',
      style: null,
      blocks: [],
      defaultContent: ['.cmp-title .cmp-title__text.heading-align--center']
    },
    {
      id: 'section-4',
      name: 'Article Listing',
      selector: '.journey-selector-new',
      style: null,
      blocks: ['cards-article'],
      defaultContent: []
    }
  ]
};

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
