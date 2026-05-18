/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroLandingParser from './parsers/hero-landing.js';
import cardsCategoryParser from './parsers/cards-category.js';
import heroTestimonialParser from './parsers/hero-testimonial.js';
import cardsCtaParser from './parsers/cards-cta.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/thereadypatient-cleanup.js';
import sectionsTransformer from './transformers/thereadypatient-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-landing': heroLandingParser,
  'cards-category': cardsCategoryParser,
  'hero-testimonial': heroTestimonialParser,
  'cards-cta': cardsCtaParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Main landing page with hero banner, category cards for body areas, patient stories, and call-to-action sections',
  urls: [
    'https://www.thereadypatient.com/'
  ],
  blocks: [
    {
      name: 'hero-landing',
      instances: ['.hero-headline.image:first-of-type .hero-headlines--blank']
    },
    {
      name: 'cards-category',
      instances: ['.article-categories .article-categories--default']
    },
    {
      name: 'hero-testimonial',
      instances: ['.hero-headline.image ~ .hero-headline.image .hero-headlines--blank']
    },
    {
      name: 'cards-cta',
      instances: ['.resource-grid-cards .resource-grid-cards--default']
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Section',
      selector: '.hero-headline.image:first-of-type',
      style: null,
      blocks: ['hero-landing'],
      defaultContent: []
    },
    {
      id: 'section-2',
      name: 'Category Cards Section',
      selector: '#title-83bd028105',
      style: null,
      blocks: ['cards-category'],
      defaultContent: ['#title-83bd028105']
    },
    {
      id: 'section-3',
      name: 'Patient Testimonial Section',
      selector: '#title-b71b7dca44',
      style: null,
      blocks: ['hero-testimonial'],
      defaultContent: ['#title-b71b7dca44']
    },
    {
      id: 'section-4',
      name: 'CTA Cards Section',
      selector: '#title-27543d93ee',
      style: null,
      blocks: ['cards-cta'],
      defaultContent: ['#title-27543d93ee']
    },
    {
      id: 'section-5',
      name: 'Disclaimer Section',
      selector: '#text-e30175cbcb',
      style: null,
      blocks: [],
      defaultContent: ['#text-e30175cbcb']
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

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
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

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
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
