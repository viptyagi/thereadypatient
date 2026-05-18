/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-category-landing.js
  var import_category_landing_exports = {};
  __export(import_category_landing_exports, {
    default: () => import_category_landing_default
  });

  // tools/importer/parsers/hero-category.js
  function parse(element, { document: document2 }) {
    let bgUrl = "";
    const bgStyle = element.getAttribute("style") || "";
    const bgMatch = bgStyle.match(/background-image\s*:\s*url\(["']?(.*?)["']?\)/i);
    if (bgMatch && bgMatch[1]) {
      bgUrl = bgMatch[1].trim();
      if (bgUrl.startsWith("/")) {
        bgUrl = "https://www.thereadypatient.com" + bgUrl;
      }
    }
    if (!bgUrl && element.style && element.style.backgroundImage) {
      const match = element.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
      if (match && match[1]) {
        bgUrl = match[1];
      }
    }
    let imageEl = element.querySelector("picture, img");
    if (!imageEl && bgUrl) {
      const range = document2.createRange();
      range.selectNode(document2.body);
      const frag = range.createContextualFragment('<img src="' + bgUrl.replace(/"/g, "&quot;") + '">');
      imageEl = frag.querySelector("img");
    }
    const heading = element.querySelector(".hero-headlines__supertitle h1, .hero-headlines__supertitle h2, h1, h2");
    const richText = element.querySelector(".hero-headlines__title .rich-text, .hero-headlines__title");
    const paragraph = richText ? richText.querySelector("p") : element.querySelector("p");
    const cells = [];
    const imageCell = document2.createDocumentFragment();
    imageCell.appendChild(document2.createComment(" field:image "));
    if (imageEl) {
      imageCell.appendChild(imageEl);
    }
    cells.push([imageCell]);
    const textCell = document2.createDocumentFragment();
    textCell.appendChild(document2.createComment(" field:text "));
    if (heading) {
      textCell.appendChild(heading);
    }
    if (paragraph) {
      textCell.appendChild(paragraph);
    } else if (richText) {
      textCell.appendChild(richText);
    }
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-category", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse2(element, { document: document2 }) {
    const articleCards = element.querySelectorAll(
      ".journey-selector-new__results > a.article-card, .journey-selector-new__results > .article-card"
    );
    const cells = [];
    articleCards.forEach((card) => {
      const img = card.querySelector(".imageQ img, img");
      const imageCell = document2.createDocumentFragment();
      if (img) {
        imageCell.appendChild(document2.createComment(" field:image "));
        imageCell.appendChild(img);
      }
      const categoryTag = card.querySelector('.theme-tag, span[class*="tagcolor"]');
      const titleEl = card.querySelector("h1.article-title, h2.article-title, .article-title");
      const href = card.getAttribute("href") || "";
      const textCell = document2.createDocumentFragment();
      textCell.appendChild(document2.createComment(" field:text "));
      if (categoryTag) {
        const tagP = (window.__nativeCreateElement || document2.createElement.bind(document2))("p");
        const em = (window.__nativeCreateElement || document2.createElement.bind(document2))("em");
        em.textContent = categoryTag.textContent.trim();
        tagP.appendChild(em);
        textCell.appendChild(tagP);
      }
      if (titleEl || href) {
        const titleText = titleEl ? titleEl.textContent.trim() : "";
        if (titleText && href) {
          const h3 = (window.__nativeCreateElement || document2.createElement.bind(document2))("h3");
          const link = (window.__nativeCreateElement || document2.createElement.bind(document2))("a");
          link.setAttribute("href", href);
          link.textContent = titleText;
          h3.appendChild(link);
          textCell.appendChild(h3);
        } else if (titleText) {
          const h3 = (window.__nativeCreateElement || document2.createElement.bind(document2))("h3");
          h3.textContent = titleText;
          textCell.appendChild(h3);
        } else if (href) {
          const p = (window.__nativeCreateElement || document2.createElement.bind(document2))("p");
          const link = (window.__nativeCreateElement || document2.createElement.bind(document2))("a");
          link.setAttribute("href", href);
          link.textContent = href;
          p.appendChild(link);
          textCell.appendChild(p);
        }
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "cards-article",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/transformers/thereadypatient-cleanup.js
  try {
    if (typeof Document !== "undefined" && Document.prototype.createElement) {
      document.createElement = Document.prototype.createElement.bind(document);
    }
  } catch (e) {
  }
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      const doc = element.ownerDocument || document;
      doc.querySelectorAll('script[src*="cookielaw.org"], script[src*="onetrust"], script[src*="OneTrust"]').forEach((el) => el.remove());
      doc.querySelectorAll('#onetrust-consent-sdk, #onetrust-banner-sdk, [class*="onetrust"], [id*="onetrust"]').forEach((el) => el.remove());
      const svgSprites = element.querySelectorAll('img[src^="data:image/svg+xml"]');
      svgSprites.forEach((el) => el.remove());
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".cmp-experiencefragment--zb-header-ef"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".cmp-experiencefragment--zb-footer-ef",
        ".footer--default"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe"
      ]);
    }
  }

  // tools/importer/transformers/thereadypatient-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    var _a;
    if (hookName === TransformHook2.afterTransform) {
      const sections = (_a = payload == null ? void 0 : payload.template) == null ? void 0 : _a.sections;
      if (!sections || !Array.isArray(sections) || sections.length < 2) return;
      const doc = element.ownerDocument || document;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (!section.selector) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.parentNode.insertBefore(metaBlock, sectionEl.nextSibling);
        }
        if (i > 0) {
          const hr = doc.createElement("hr");
          sectionEl.parentNode.insertBefore(hr, sectionEl);
        }
      }
    }
  }

  // tools/importer/import-category-landing.js
  var parsers = {
    "hero-category": parse,
    "cards-article": parse2
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "category-landing",
    description: "Category landing pages for body areas with journey sections and article listings",
    urls: [
      "https://www.thereadypatient.com/knee.html",
      "https://www.thereadypatient.com/hip.html",
      "https://www.thereadypatient.com/foot-ankle.html",
      "https://www.thereadypatient.com/shoulder.html",
      "https://www.thereadypatient.com/elbow.html",
      "https://www.thereadypatient.com/brain.html",
      "https://www.thereadypatient.com/cmf-thoracic.html",
      "https://www.thereadypatient.com/coronavirus.html",
      "https://www.thereadypatient.com/dont-let-pain-gain.html",
      "https://www.thereadypatient.com/personalization-do-not-publish.html"
    ],
    blocks: [
      {
        name: "hero-category",
        instances: [".hero-headline.image .hero-headlines--blank"]
      },
      {
        name: "cards-article",
        instances: [".journey-selector-new .journey-selector-new--default"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Breadcrumb",
        selector: ".breadcrumb-zb",
        style: "warm-beige",
        blocks: [],
        defaultContent: [".breadcrumb-zb"]
      },
      {
        id: "section-2",
        name: "Hero",
        selector: ".hero-headline.image",
        style: null,
        blocks: ["hero-category"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Journey Heading",
        selector: ".cmp-title .cmp-title__text.heading-align--center",
        style: null,
        blocks: [],
        defaultContent: [".cmp-title .cmp-title__text.heading-align--center"]
      },
      {
        id: "section-4",
        name: "Article Listing",
        selector: ".journey-selector-new",
        style: null,
        blocks: ["cards-article"],
        defaultContent: []
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_category_landing_default = {
    transform: (payload) => {
      const { document: document2, url, html, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_category_landing_exports);
})();
