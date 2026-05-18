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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-landing.js
  function parse(element, { document: document2 }) {
    const pictureEl = element.querySelector("picture");
    const imgEl = element.querySelector("img");
    let bgImage = pictureEl || imgEl;
    if (!bgImage && element.parentElement) {
      const parentPicture = element.parentElement.querySelector(":scope > picture, :scope > img");
      if (parentPicture) {
        bgImage = parentPicture;
      } else {
        const parentImg = element.parentElement.querySelector("picture, img");
        if (parentImg && !element.contains(parentImg)) {
          bgImage = parentImg;
        }
      }
    }
    let bgImageFromStyle = null;
    if (!bgImage) {
      const candidates = [element, element.parentElement, ...Array.from(element.querySelectorAll("*"))];
      for (const candidate of candidates) {
        if (candidate && candidate.style && candidate.style.backgroundImage) {
          const match = candidate.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
          if (match && match[1]) {
            bgImageFromStyle = (window.__nativeCreateElement || document2.createElement.bind(document2))("img");
            bgImageFromStyle.src = match[1];
            break;
          }
        }
      }
    }
    const imageNode = bgImage || bgImageFromStyle;
    const heading = element.querySelector('h1, h2, [class*="supertitle"] h1, [class*="supertitle"] h2');
    const richTextContainer = element.querySelector('.rich-text, [class*="rich-text"]');
    const paragraphs = richTextContainer ? Array.from(richTextContainer.querySelectorAll(":scope > p")) : Array.from(element.querySelectorAll(".hero-headlines__title p, .hero-headlines__text-overlay p"));
    const ctaLink = element.querySelector('a.button, a[class*="button"], .hero-headlines__text-overlay a');
    const imageFrag = document2.createDocumentFragment();
    if (imageNode) {
      imageFrag.appendChild(document2.createComment(" field:image "));
      imageFrag.appendChild(imageNode);
    }
    const imageCell = [imageFrag];
    const textFrag = document2.createDocumentFragment();
    textFrag.appendChild(document2.createComment(" field:text "));
    if (heading) {
      textFrag.appendChild(heading);
    }
    paragraphs.forEach((p) => {
      textFrag.appendChild(p);
    });
    if (ctaLink) {
      const alreadyIncluded = paragraphs.some((p) => p.contains(ctaLink));
      if (!alreadyIncluded) {
        const ctaParagraph = (window.__nativeCreateElement || document2.createElement.bind(document2))("p");
        ctaParagraph.appendChild(ctaLink);
        textFrag.appendChild(ctaParagraph);
      }
    }
    const textCell = [textFrag];
    const cells = [imageCell, textCell];
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-landing", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-category.js
  function parse2(element, { document: document2 }) {
    const cardLinks = element.querySelectorAll(":scope > a.card, :scope > a.link");
    const cells = [];
    cardLinks.forEach((cardLink) => {
      const cardBody = cardLink.querySelector(".card__body, .card__body--default");
      const labelText = cardBody ? cardBody.textContent.trim() : cardLink.textContent.trim();
      const href = cardLink.getAttribute("href") || "";
      const imageCell = "";
      const textFrag = document2.createDocumentFragment();
      textFrag.appendChild(document2.createComment(" field:text "));
      const link = (window.__nativeCreateElement || document2.createElement.bind(document2))("a");
      link.setAttribute("href", href);
      link.textContent = labelText;
      const p = (window.__nativeCreateElement || document2.createElement.bind(document2))("p");
      p.appendChild(link);
      textFrag.appendChild(p);
      cells.push([imageCell, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-category", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-testimonial.js
  function parse3(element, { document: document2 }) {
    let bgImage = element.querySelector(":scope > img, img.hero-headlines__image");
    if (!bgImage) {
      const bgStyle = element.getAttribute("style") || "";
      const bgMatch = bgStyle.match(/background-image\s*:\s*url\(["']?([^"')]+)["']?\)/);
      if (bgMatch) {
        bgImage = (window.__nativeCreateElement || document2.createElement.bind(document2))("img");
        bgImage.src = bgMatch[1];
        bgImage.alt = "";
      }
    }
    const heading = element.querySelector(".hero-headlines__supertitle h1, .hero-headlines__supertitle h2, h1.heading");
    const quoteEl = element.querySelector(".hero-headlines__title .rich-text h5, .hero-headlines__title h5");
    const ctaLink = element.querySelector("a.button--primary, a.button--link, .hero-headlines__text-overlay > a");
    const cells = [];
    const imageCell = document2.createDocumentFragment();
    if (bgImage) {
      imageCell.appendChild(document2.createComment(" field:image "));
      imageCell.appendChild(bgImage);
    }
    cells.push([imageCell]);
    const textCell = document2.createDocumentFragment();
    const hasTextContent = heading || quoteEl || ctaLink;
    if (hasTextContent) {
      textCell.appendChild(document2.createComment(" field:text "));
    }
    if (heading) {
      textCell.appendChild(heading);
    }
    if (quoteEl) {
      textCell.appendChild(quoteEl);
    }
    if (ctaLink) {
      textCell.appendChild(ctaLink);
    }
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-cta.js
  function parse4(element, { document: document2 }) {
    const cards = element.querySelectorAll(".card, .card--default");
    const cells = [];
    cards.forEach((card) => {
      let img = card.querySelector(":scope > img, :scope img");
      if (!img) {
        const style = card.getAttribute("style") || "";
        const bgMatch = style.match(/background-image\s*:\s*url\(["']?([^"')]+)["']?\)/i);
        if (bgMatch && bgMatch[1]) {
          img = (window.__nativeCreateElement || document2.createElement.bind(document2))("img");
          img.src = bgMatch[1];
        }
      }
      const heading = card.querySelector("h4, h3, h2, .heading");
      const richText = card.querySelector(".rich-text, .rich-text--default");
      const ctaLink = card.querySelector("a.button, a.button--primary, a.button--link");
      const imageCell = document2.createDocumentFragment();
      if (img) {
        imageCell.appendChild(document2.createComment(" field:image "));
        imageCell.appendChild(img);
      }
      const textCell = document2.createDocumentFragment();
      const hasTextContent = heading || richText || ctaLink;
      if (hasTextContent) {
        textCell.appendChild(document2.createComment(" field:text "));
        if (heading) textCell.appendChild(heading);
        if (richText) textCell.appendChild(richText);
        if (ctaLink) {
          const p = (window.__nativeCreateElement || document2.createElement.bind(document2))("p");
          p.appendChild(ctaLink);
          textCell.appendChild(p);
        }
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "cards-cta",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/transformers/thereadypatient-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      const doc = element.ownerDocument || document;
      const oneTrust = doc.querySelector("#onetrust-consent-sdk");
      if (oneTrust) oneTrust.remove();
      const otScripts = doc.querySelectorAll('script[src*="cookielaw.org"], script[src*="onetrust"]');
      otScripts.forEach((el) => el.remove());
      const svgSprites = element.querySelectorAll('img[src^="data:image/svg+xml"]');
      svgSprites.forEach((el) => el.remove());
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".cmp-experiencefragment--zb-header-ef"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".cmp-experiencefragment--zb-footer-ef"
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

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-landing": parse,
    "cards-category": parse2,
    "hero-testimonial": parse3,
    "cards-cta": parse4
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Main landing page with hero banner, category cards for body areas, patient stories, and call-to-action sections",
    urls: [
      "https://www.thereadypatient.com/"
    ],
    blocks: [
      {
        name: "hero-landing",
        instances: [".hero-headline.image:first-of-type .hero-headlines--blank"]
      },
      {
        name: "cards-category",
        instances: [".article-categories .article-categories--default"]
      },
      {
        name: "hero-testimonial",
        instances: [".hero-headline.image ~ .hero-headline.image .hero-headlines--blank"]
      },
      {
        name: "cards-cta",
        instances: [".resource-grid-cards .resource-grid-cards--default"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Section",
        selector: ".hero-headline.image:first-of-type",
        style: null,
        blocks: ["hero-landing"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Category Cards Section",
        selector: "#title-83bd028105",
        style: null,
        blocks: ["cards-category"],
        defaultContent: ["#title-83bd028105"]
      },
      {
        id: "section-3",
        name: "Patient Testimonial Section",
        selector: "#title-b71b7dca44",
        style: null,
        blocks: ["hero-testimonial"],
        defaultContent: ["#title-b71b7dca44"]
      },
      {
        id: "section-4",
        name: "CTA Cards Section",
        selector: "#title-27543d93ee",
        style: null,
        blocks: ["cards-cta"],
        defaultContent: ["#title-27543d93ee"]
      },
      {
        id: "section-5",
        name: "Disclaimer Section",
        selector: "#text-e30175cbcb",
        style: null,
        blocks: [],
        defaultContent: ["#text-e30175cbcb"]
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
  var import_homepage_default = {
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
  return __toCommonJS(import_homepage_exports);
})();
