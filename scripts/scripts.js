import {
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
} from './aem.js';

/**
 * Moves all the attributes from a given elmenet to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveAttributes(from, to, attributes) {
  if (!attributes) {
    // eslint-disable-next-line no-param-reassign
    attributes = [...from.attributes].map(({ nodeName }) => nodeName);
  }
  attributes.forEach((attr) => {
    const value = from.getAttribute(attr);
    if (value) {
      to?.setAttribute(attr, value);
      from.removeAttribute(attr);
    }
  });
}

/**
 * Move instrumentation attributes from a given element to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveInstrumentation(from, to) {
  moveAttributes(
    from,
    to,
    [...from.attributes]
      .map(({ nodeName }) => nodeName)
      .filter((attr) => attr.startsWith('data-aue-') || attr.startsWith('data-richtext-')),
  );
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks() {
  try {
    // TODO: add auto block, if needed
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

function createPicture(src, alt) {
  return `
    <picture>
      <img loading="eager" src="${src}" alt="${alt}">
    </picture>
  `;
}

function replaceStarterHomepage(main) {
  const isHome = window.location.pathname === '/' || window.location.pathname === '/index.html';
  if (!isHome || !main?.textContent?.includes('Welcome to AEM Authoring with Edge Delivery Services')) return;

  document.title = 'ReadyPatient';
  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.content = 'ReadyPatient exists to cultivate hope and build connections.';
  }

  const asset = (path) => `https://www.thereadypatient.com${path}`;
  main.innerHTML = `
    <div>
      <div class="hero">
        <div><div>${createPicture(asset('/content/dam/zb-content-hub/homepage/re-design/Banner_Homepage.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg'), 'ReadyPatient homepage hero')}</div></div>
        <div><div>
          <h1>Knee pain, hip pain, or something else?</h1>
          <p>Explore articles, patient stories, and tools designed to help you take the next step in your care journey.</p>
          <p><a href="/quiz.html">Start Here!</a></p>
        </div></div>
      </div>
    </div>
    <div>
      <h2>What brings you here today?</h2>
      <div class="cards body-parts">
        <div><div>${createPicture(asset('/content/dam/zb-content-hub/homepage/re-design/bodypart-knee.jpg'), 'Knee')}</div><div><p><a href="/knee.html">Knee Articles</a></p></div></div>
        <div><div>${createPicture(asset('/content/dam/zb-content-hub/homepage/re-design/bodypart-hip.jpg'), 'Hip')}</div><div><p><a href="/hip.html">Hip Articles</a></p></div></div>
        <div><div>${createPicture(asset('/content/dam/zb-content-hub/homepage/re-design/bodypart-foot-ankle.jpg'), 'Foot and Ankle')}</div><div><p><a href="/foot-ankle.html">Foot and Ankle Articles</a></p></div></div>
        <div><div>${createPicture(asset('/content/dam/zb-content-hub/homepage/re-design/bodypart-shoulder.jpg'), 'Shoulder')}</div><div><p><a href="/shoulder.html">Shoulder Articles</a></p></div></div>
        <div><div>${createPicture(asset('/content/dam/zb-content-hub/homepage/re-design/bodypart-elbow.jpg'), 'Elbow')}</div><div><p><a href="/elbow.html">Elbow Articles</a></p></div></div>
        <div><div>${createPicture(asset('/content/dam/zb-content-hub/homepage/re-design/bodypart-brain.jpg'), 'Brain')}</div><div><p><a href="/brain.html">Brain Articles</a></p></div></div>
      </div>
    </div>
    <div>
      <div class="hero">
        <div><div>${createPicture(asset('/content/dam/zb-content-hub/homepage/re-design/Connie-story.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg'), 'Connie patient story')}</div></div>
        <div><div>
          <h2>Real people. Real stories.</h2>
          <p>Read how Connie moved through her knee replacement journey and found her way back to the life she wanted.</p>
          <p><a href="/knee/connies-patient-story.html">Read Connie's Story</a></p>
        </div></div>
      </div>
    </div>
    <div>
      <h2>Here's more you can do</h2>
      <div class="cards promos">
        <div><div>${createPicture(asset('/content/dam/zb-content-hub/homepage/re-design/background-sharestory.jpg'), '')}</div><div><h3>Share Your Story</h3><p>People like you need to hear that they're not alone.</p><p><a href="/share-your-story.html">I Want to Share My Story</a></p></div></div>
        <div><div>${createPicture(asset('/content/dam/zb-content-hub/homepage/re-design/background-newsletter.jpg'), '')}</div><div><h3>Get Updates</h3><p>Sign up for personalized article recommendations in your email.</p><p><a href="/get-updates.html">Get Updates</a></p></div></div>
        <div><div>${createPicture(asset('/content/dam/zb-content-hub/homepage/re-design/background-aboutus.jpg'), '')}</div><div><h3>About Us</h3><p>Learn more about our mission of helping patients find balance in their lives.</p><p><a href="/about-us.html">About Us</a></p></div></div>
        <div><div>${createPicture(asset('/content/dam/zb-content-hub/homepage/re-design/background-FaD.jpg'), '')}</div><div><h3>Find a Doctor</h3><p>Search by specialty, location, and more.</p><p><a href="/find-a-doc.html">Find a Doctor</a></p></div></div>
      </div>
    </div>
  `;
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  replaceStarterHomepage(main);
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  loadHeader(doc.querySelector('header'));

  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();

