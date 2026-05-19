/**
 * ReadyPatient Header / Navigation Block
 *
 * Authorable via /nav.html in GitHub (code bus).
 * Structure expected in nav.html  <main>:
 *
 *   <div>   ← nav-brand   : logo link  <p><a href="/">Brand name or img</a></p>
 *   <div>   ← nav-sections: top-level <ul> with optional nested <ul> for dropdowns
 *   <div>   ← nav-tools   : utility links  <p><a>…</a></p>  (Find a Doctor, etc.)
 *
 * The block fetches /nav.plain.html.  If AEM content-bus overrides that endpoint
 * with boilerplate content (detected by absence of body-part link keywords) the
 * block falls back to fetching /nav.html directly from GitHub via the code bus
 * (/nav.html is a code file, served at the same CDN origin).
 */

import { getMetadata } from '../../scripts/aem.js';

/* ─── constants ──────────────────────────────────────────────────────────── */
const MQ_DESKTOP = window.matchMedia('(min-width: 900px)');
const LOGO_SRC = 'https://www.thereadypatient.com/etc.clientlibs/zb/clientlibs/clientlib-base/resources/img/logo-desktop-stacked.svg';
const LOGO_ALT = 'ReadyPatient — Brought to you by Zimmer Biomet';

/* ─── nav content source ─────────────────────────────────────────────────── */

/**
 * Returns true when the fetched plain-HTML is the AEM boilerplate placeholder,
 * not real ReadyPatient nav content.
 */
function isBoilerplateNav(html) {
  return !html.includes('/knee.html') && !html.includes('/hip.html');
}

/**
 * Parse a plain-HTML string into a DocumentFragment containing the nav sections.
 * Strips outer <div> wrappers so we get three sibling <div> elements:
 *   [0] brand  [1] sections  [2] tools
 */
function parseNavHtml(html) {
  const tpl = document.createElement('template');
  tpl.innerHTML = html.trim();
  return tpl.content;
}

/**
 * Load nav content.  Priority:
 *   1. /nav.plain.html  (content-bus – works when doc is authored)
 *   2. /nav.html        (code-bus – our GitHub source of truth)
 *
 * Returns a DocumentFragment with the three nav <div> children.
 */
async function loadNavContent(navPath) {
  // Try content-bus (.plain.html)
  let resp = await fetch(`${navPath}.plain.html`);
  if (resp.ok) {
    const html = await resp.text();
    if (!isBoilerplateNav(html)) return parseNavHtml(html);
  }

  // Fall back to code-bus (.html) – parse out the <main> children
  resp = await fetch(`${navPath}.html`);
  if (resp.ok) {
    const raw = await resp.text();
    const doc = new DOMParser().parseFromString(raw, 'text/html');
    const main = doc.querySelector('main');
    if (main) {
      const frag = document.createDocumentFragment();
      [...main.children].forEach((el) => frag.append(el.cloneNode(true)));
      return frag;
    }
  }

  return null;
}

/* ─── logo helper ────────────────────────────────────────────────────────── */

function ensureLogo(brandSection) {
  // If the authored brand div has no img, inject the SVG logo
  if (!brandSection.querySelector('img')) {
    const a = brandSection.querySelector('a') || document.createElement('a');
    if (!a.href) a.href = '/';
    a.innerHTML = `<img src="${LOGO_SRC}" alt="${LOGO_ALT}" width="170" height="76" loading="eager">`;
    if (!brandSection.contains(a)) {
      brandSection.textContent = '';
      brandSection.append(a);
    } else {
      // replace text node with img
      [...a.childNodes].forEach((n) => { if (n.nodeType === Node.TEXT_NODE) n.remove(); });
      if (!a.querySelector('img')) a.prepend(Object.assign(document.createElement('img'), { src: LOGO_SRC, alt: LOGO_ALT }));
    }
  }
}

/* ─── search ─────────────────────────────────────────────────────────────── */

function buildSearch() {
  const form = document.createElement('form');
  form.className = 'nav-search';
  form.setAttribute('role', 'search');
  form.action = '/search.html';
  form.method = 'get';
  form.innerHTML = `
    <label>
      <span class="sr-only">Search ReadyPatient</span>
      <input type="search" name="query" placeholder="Search" autocomplete="off" aria-label="Search">
    </label>
    <button type="submit" aria-label="Submit search">
      <svg class="nav-search-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="8.5" cy="8.5" r="5.75" stroke="currentColor" stroke-width="2"/>
        <line x1="13.1" y1="13.1" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>`;
  return form;
}

/* ─── tools / utility bar ────────────────────────────────────────────────── */

function decorateTools(toolsSection) {
  const links = [...toolsSection.querySelectorAll('a')];
  toolsSection.innerHTML = '';

  const utility = document.createElement('div');
  utility.className = 'nav-utility';
  links.forEach((a) => {
    a.className = 'nav-utility-link';
    utility.append(a);
  });

  const wrapper = document.createElement('div');
  wrapper.className = 'nav-tools-inner';
  wrapper.append(utility, buildSearch());
  toolsSection.append(wrapper);
}

/* ─── dropdown / section toggles ────────────────────────────────────────── */

function collapseAll(navSections) {
  navSections.querySelectorAll('li[aria-expanded="true"]').forEach((li) => {
    li.setAttribute('aria-expanded', 'false');
  });
}

function toggleSection(li, navSections) {
  const expanded = li.getAttribute('aria-expanded') === 'true';
  collapseAll(navSections);
  li.setAttribute('aria-expanded', expanded ? 'false' : 'true');
}

/* ─── mobile menu toggle ─────────────────────────────────────────────────── */

function setMobileMenu(nav, navSections, open) {
  nav.setAttribute('aria-expanded', open ? 'true' : 'false');
  document.body.style.overflowY = open ? 'hidden' : '';
  const btn = nav.querySelector('.nav-hamburger button');
  if (btn) btn.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  if (!open) collapseAll(navSections);
}

/* ─── keyboard support ───────────────────────────────────────────────────── */

function addKeyboardSupport(nav, navSections) {
  nav.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (MQ_DESKTOP.matches) {
        collapseAll(navSections);
      } else {
        setMobileMenu(nav, navSections, false);
        nav.querySelector('.nav-hamburger button')?.focus();
      }
    }
  });

  navSections.querySelectorAll('li.nav-drop').forEach((li) => {
    li.setAttribute('tabindex', '0');
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleSection(li, navSections);
      }
    });
  });

  // Collapse dropdown when focus leaves the nav
  nav.addEventListener('focusout', (e) => {
    if (MQ_DESKTOP.matches && !nav.contains(e.relatedTarget)) collapseAll(navSections);
  });
}

/* ─── sections (main nav items) ─────────────────────────────────────────── */

function decorateSections(navSections) {
  const topItems = navSections.querySelectorAll(':scope > ul > li, :scope .default-content-wrapper > ul > li');
  topItems.forEach((li) => {
    if (li.querySelector('ul')) {
      li.classList.add('nav-drop');
      li.setAttribute('aria-expanded', 'false');
      li.setAttribute('aria-haspopup', 'true');

      // wrap label text / link for clear click target
      const firstChild = li.firstElementChild;
      if (firstChild && firstChild.tagName !== 'BUTTON') {
        const btn = document.createElement('button');
        btn.className = 'nav-drop-toggle';
        btn.setAttribute('aria-label', `Toggle ${li.textContent.trim().split('\n')[0]}`);
        li.insertBefore(btn, firstChild.nextSibling);
      }

      // Desktop: click on the <li> text toggles; mobile handled by hamburger
      li.addEventListener('click', (e) => {
        if (!MQ_DESKTOP.matches) return; // mobile handled differently
        // Don't fire when clicking a direct link inside the <li>
        if (e.target.tagName === 'A' && !li.querySelector('ul')?.contains(e.target)) return;
        toggleSection(li, navSections);
        e.stopPropagation();
      });
    }
  });

  // Close dropdowns on outside click (desktop)
  document.addEventListener('click', (e) => {
    if (MQ_DESKTOP.matches && !navSections.contains(e.target)) collapseAll(navSections);
  });
}

/* ─── hamburger ──────────────────────────────────────────────────────────── */

function buildHamburger(nav, navSections) {
  const wrap = document.createElement('div');
  wrap.className = 'nav-hamburger';
  wrap.innerHTML = `
    <button type="button" aria-controls="nav" aria-label="Open navigation" aria-expanded="false">
      <span class="nav-hamburger-icon" aria-hidden="true"></span>
    </button>`;
  wrap.querySelector('button').addEventListener('click', () => {
    const isOpen = nav.getAttribute('aria-expanded') === 'true';
    setMobileMenu(nav, navSections, !isOpen);
  });
  return wrap;
}

/* ─── responsive breakpoint watcher ─────────────────────────────────────── */

function watchBreakpoint(nav, navSections) {
  const handler = (mq) => {
    if (mq.matches) {
      // switched to desktop — ensure menu is "open" (visible via CSS) and clean up
      setMobileMenu(nav, navSections, false);
      nav.setAttribute('aria-expanded', 'false'); // CSS shows sections at desktop regardless
    } else {
      // switched to mobile — collapse everything
      setMobileMenu(nav, navSections, false);
    }
  };
  MQ_DESKTOP.addEventListener('change', handler);
}

/* ─── main decorate ──────────────────────────────────────────────────────── */

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';

  const navContent = await loadNavContent(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main navigation');
  nav.setAttribute('aria-expanded', 'false');

  // Append the three authored sections
  if (navContent) {
    const sections = [...navContent.children];
    sections.forEach((s) => nav.append(s));
  }

  // Label sections semantically
  const [brandEl, sectionsEl, toolsEl] = [...nav.children];
  if (brandEl) brandEl.classList.add('nav-brand');
  if (sectionsEl) sectionsEl.classList.add('nav-sections');
  if (toolsEl) toolsEl.classList.add('nav-tools');

  // Logo
  if (brandEl) ensureLogo(brandEl);

  // Strip boilerplate button-wrapper classes from brand link
  brandEl?.querySelectorAll('.button, .button-container, .button-wrapper').forEach((el) => {
    el.className = '';
  });

  // Tools / utility bar + search
  if (toolsEl) decorateTools(toolsEl);

  // Nav section dropdowns
  if (sectionsEl) {
    decorateSections(sectionsEl);
    addKeyboardSupport(nav, sectionsEl);
  }

  // Hamburger (prepend so it comes first in the grid)
  const hamburger = buildHamburger(nav, sectionsEl);
  nav.prepend(hamburger);

  // Breakpoint watcher
  watchBreakpoint(nav, sectionsEl);

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
