/**
 * Header block for The Ready Patient (Zimmer Biomet EDS migration)
 * Builds utility bar, main nav with dropdowns, search panel, mobile drawer, and overlay.
 */

// ---------------------------------------------------------------------------
// Data defaults
// ---------------------------------------------------------------------------

const LOGO_DESKTOP =
  'https://www.thereadypatient.com/etc.clientlibs/zb/clientlibs/clientlib-base/resources/img/logo-desktop-stacked.svg';
const LOGO_MOBILE =
  'https://www.thereadypatient.com/etc.clientlibs/zb/clientlibs/clientlib-base/resources/img/logo-mobile.svg';

const ARTICLE_SUBS = [
  { label: 'Diagnosis and Options', href: '' },
  { label: 'Surgery', href: '' },
  { label: 'Recovery', href: '' },
  { label: 'Healthy Living', href: '' },
];

const DEFAULT_NAV = [
  { label: 'Knee Articles', href: '/knee.html', subs: ARTICLE_SUBS },
  { label: 'Hip Articles', href: '/hip.html', subs: ARTICLE_SUBS },
  { label: 'Foot and Ankle Articles', href: '/foot-ankle.html', subs: ARTICLE_SUBS },
  { label: 'Shoulder Articles', href: '/shoulder.html', subs: ARTICLE_SUBS },
  { label: 'Elbow Articles', href: '/elbow.html', subs: ARTICLE_SUBS },
  {
    label: 'About Us',
    href: '/about-us.html',
    subs: [
      { label: 'Contributors', href: '/about-us/contributors.html' },
      { label: 'Contact Us', href: '/about-us/contact-us.html' },
    ],
  },
];

const DEFAULT_UTILITY = [
  { label: 'Find a Doctor', href: '/find-a-doc.html' },
  { label: 'Get Updates', href: '/get-updates.html' },
  { label: 'Share Your Story', href: '/share-your-story.html' },
];

// ---------------------------------------------------------------------------
// SVG Icons
// ---------------------------------------------------------------------------

const ICON_SEARCH = /* html */ `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="11" cy="11" r="7"/>
  <line x1="16.5" y1="16.5" x2="22" y2="22"/>
</svg>`;

const ICON_CLOSE = /* html */ `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <line x1="18" y1="6" x2="6" y2="18"/>
  <line x1="6" y1="6" x2="18" y2="18"/>
</svg>`;

const ICON_HAMBURGER = /* html */ `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <line x1="3" y1="6" x2="21" y2="6"/>
  <line x1="3" y1="12" x2="21" y2="12"/>
  <line x1="3" y1="18" x2="21" y2="18"/>
</svg>`;

const ICON_CHEVRON = /* html */ `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <polyline points="6 9 12 15 18 9"/>
</svg>`;

// ---------------------------------------------------------------------------
// DOM helper
// ---------------------------------------------------------------------------

/**
 * Create an element with attributes and children.
 * @param {string} tag
 * @param {Object} attrs  — key/value pairs; class → className; boolean true → attribute present
 * @param {...(Node|string)} children
 * @returns {HTMLElement}
 */
function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') {
      node.className = v;
    } else if (k === 'html') {
      node.innerHTML = v;
    } else if (v === true) {
      node.setAttribute(k, '');
    } else if (v !== false && v != null) {
      node.setAttribute(k, v);
    }
  });
  children.forEach((child) => {
    if (child == null) return;
    node.append(typeof child === 'string' ? document.createTextNode(child) : child);
  });
  return node;
}

// ---------------------------------------------------------------------------
// Build sections
// ---------------------------------------------------------------------------

function buildUtilityBar(links) {
  const bar = el('div', { class: 'header-utility', role: 'navigation', 'aria-label': 'Utility' });
  links.forEach(({ label, href }) => {
    bar.append(el('a', { href, class: 'header-utility-link' }, label));
  });
  return bar;
}

function buildNavItem(item, isMobile = false) {
  const hasSubs = item.subs && item.subs.length > 0;
  const li = el('li', { class: `header-nav-item${hasSubs ? ' header-nav-item--has-dropdown' : ''}` });

  const pathname = window.location.pathname;
  const isActive = pathname === item.href || pathname.startsWith(item.href.replace('.html', '/'));

  const link = el(
    'a',
    {
      href: item.href,
      class: `header-nav-link${isActive ? ' active' : ''}`,
      ...(hasSubs ? { 'aria-haspopup': 'true', 'aria-expanded': 'false' } : {}),
    },
    item.label,
  );

  if (hasSubs) {
    const chevron = el('span', { class: 'header-nav-chevron', 'aria-hidden': 'true', html: ICON_CHEVRON });
    link.append(chevron);

    const dropdown = el('ul', { class: 'header-dropdown', role: 'menu' });
    item.subs.forEach((sub) => {
      const subHref = sub.href || `${item.href}#${sub.label.toLowerCase().replace(/\s+/g, '-')}`;
      const subLi = el('li', { role: 'none' });
      subLi.append(el('a', { href: subHref, class: 'header-dropdown-link', role: 'menuitem' }, sub.label));
      dropdown.append(subLi);
    });

    li.append(link, dropdown);
  } else {
    li.append(link);
  }

  return li;
}

function buildMainBar(navItems, utilityLinks) {
  const bar = el('div', { class: 'header-main' });

  // Logo
  const logoLink = el('a', { href: '/', class: 'header-logo', 'aria-label': 'The Ready Patient — Home' });
  const logoDesktop = el('img', {
    src: LOGO_DESKTOP,
    alt: 'The Ready Patient',
    class: 'logo-desktop',
    width: '160',
    height: '52',
  });
  const logoMobile = el('img', {
    src: LOGO_MOBILE,
    alt: 'The Ready Patient',
    class: 'logo-mobile',
    width: '120',
    height: '40',
  });
  logoLink.append(logoDesktop, logoMobile);

  // Nav
  const navWrapper = el('div', { class: 'header-nav-wrapper' });
  const nav = el('nav', { 'aria-label': 'Main navigation' });
  const ul = el('ul', { class: 'header-nav', role: 'menubar' });
  navItems.forEach((item) => ul.append(buildNavItem(item)));
  nav.append(ul);
  navWrapper.append(nav);

  // Search button
  const searchBtn = el('button', {
    class: 'header-search-btn',
    type: 'button',
    'aria-label': 'Toggle search',
    'aria-expanded': 'false',
    html: ICON_SEARCH,
  });

  // Hamburger
  const hamburger = el('button', {
    class: 'header-hamburger',
    type: 'button',
    'aria-label': 'Open menu',
    'aria-expanded': 'false',
    'aria-controls': 'header-drawer',
    html: ICON_HAMBURGER,
  });

  bar.append(logoLink, navWrapper, searchBtn, hamburger);
  return bar;
}

function buildSearchPanel() {
  const panel = el('div', { class: 'header-search-panel', id: 'header-search-panel', role: 'search' });
  const inner = el('div', { class: 'header-search-inner' });

  const input = el('input', {
    type: 'search',
    class: 'header-search-input',
    placeholder: 'Search articles, topics…',
    'aria-label': 'Site search',
  });

  const closeBtn = el('button', {
    type: 'button',
    class: 'header-search-close',
    'aria-label': 'Close search',
    html: ICON_CLOSE,
  });

  inner.append(input, closeBtn);
  panel.append(inner);
  return panel;
}

function buildDrawer(navItems, utilityLinks) {
  const drawer = el('div', {
    class: 'header-drawer',
    id: 'header-drawer',
    role: 'dialog',
    'aria-modal': 'true',
    'aria-label': 'Site menu',
  });

  // Drawer header
  const drawerHead = el('div', { class: 'drawer-header' });
  const drawerLogo = el('a', { href: '/', class: 'drawer-logo', 'aria-label': 'The Ready Patient — Home' });
  drawerLogo.append(
    el('img', { src: LOGO_MOBILE, alt: 'The Ready Patient', class: 'drawer-logo-img', width: '120', height: '40' }),
  );
  const drawerClose = el('button', {
    type: 'button',
    class: 'drawer-close',
    'aria-label': 'Close menu',
    html: ICON_CLOSE,
  });
  drawerHead.append(drawerLogo, drawerClose);

  // Drawer nav
  const drawerNav = el('nav', { class: 'drawer-nav', 'aria-label': 'Mobile main navigation' });
  const drawerUl = el('ul', { class: 'drawer-nav-list' });

  navItems.forEach((item) => {
    const hasSubs = item.subs && item.subs.length > 0;
    const li = el('li', { class: 'drawer-nav-item' });

    const pathname = window.location.pathname;
    const isActive = pathname === item.href || pathname.startsWith(item.href.replace('.html', '/'));

    if (hasSubs) {
      const toggleBtn = el(
        'button',
        {
          type: 'button',
          class: `drawer-nav-link drawer-nav-toggle${isActive ? ' active' : ''}`,
          'aria-expanded': 'false',
        },
        item.label,
      );
      const chevron = el('span', { class: 'drawer-nav-chevron', 'aria-hidden': 'true', html: ICON_CHEVRON });
      toggleBtn.append(chevron);

      const subUl = el('ul', { class: 'drawer-sub-list', hidden: true });
      // Top-level link first
      const topLi = el('li');
      topLi.append(el('a', { href: item.href, class: 'drawer-sub-link drawer-sub-link--top' }, `All ${item.label}`));
      subUl.append(topLi);

      item.subs.forEach((sub) => {
        const subHref = sub.href || `${item.href}#${sub.label.toLowerCase().replace(/\s+/g, '-')}`;
        const subLi = el('li');
        subLi.append(el('a', { href: subHref, class: 'drawer-sub-link' }, sub.label));
        subUl.append(subLi);
      });

      toggleBtn.addEventListener('click', () => {
        const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        toggleBtn.setAttribute('aria-expanded', String(!expanded));
        subUl.hidden = expanded;
        toggleBtn.classList.toggle('is-open', !expanded);
      });

      li.append(toggleBtn, subUl);
    } else {
      li.append(
        el('a', { href: item.href, class: `drawer-nav-link${isActive ? ' active' : ''}` }, item.label),
      );
    }

    drawerUl.append(li);
  });

  drawerNav.append(drawerUl);

  // Drawer utility links
  const drawerUtil = el('div', { class: 'drawer-utility' });
  const drawerUtilHead = el('p', { class: 'drawer-utility-heading' }, 'Quick Links');
  const drawerUtilUl = el('ul', { class: 'drawer-utility-list' });
  utilityLinks.forEach(({ label, href }) => {
    const li = el('li');
    li.append(el('a', { href, class: 'drawer-utility-link' }, label));
    drawerUtilUl.append(li);
  });
  drawerUtil.append(drawerUtilHead, drawerUtilUl);

  drawer.append(drawerHead, drawerNav, drawerUtil);
  return drawer;
}

function buildOverlay() {
  return el('div', { class: 'drawer-overlay', 'aria-hidden': 'true' });
}

// ---------------------------------------------------------------------------
// Event wiring helpers
// ---------------------------------------------------------------------------

function openDrawer(drawer, overlay, hamburger) {
  drawer.classList.add('is-open');
  overlay.classList.add('is-visible');
  document.body.classList.add('drawer-open');
  hamburger.setAttribute('aria-expanded', 'true');
  hamburger.setAttribute('aria-label', 'Close menu');
  // Move focus into drawer
  const firstFocusable = drawer.querySelector('button, [href]');
  if (firstFocusable) firstFocusable.focus();
}

function closeDrawer(drawer, overlay, hamburger) {
  drawer.classList.remove('is-open');
  overlay.classList.remove('is-visible');
  document.body.classList.remove('drawer-open');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Open menu');
  hamburger.focus();
}

function openSearch(panel, searchBtn, input) {
  panel.classList.add('is-open');
  searchBtn.setAttribute('aria-expanded', 'true');
  // Wait for transition before focusing
  setTimeout(() => input.focus(), 50);
}

function closeSearch(panel, searchBtn) {
  panel.classList.remove('is-open');
  searchBtn.setAttribute('aria-expanded', 'false');
}

function closeAllDropdowns(navEl) {
  navEl.querySelectorAll('.header-nav-item--open').forEach((item) => {
    item.classList.remove('header-nav-item--open');
    const link = item.querySelector('.header-nav-link');
    if (link) link.setAttribute('aria-expanded', 'false');
  });
}

// ---------------------------------------------------------------------------
// Main decorate
// ---------------------------------------------------------------------------

export default function decorate(block) {
  // Parse optional overrides from block table rows (future-proofing)
  // Rows would need to be: | nav | <json> | or | utility | <json> |
  // For now we always use defaults.
  block.innerHTML = '';

  // Sticky target: prefer <header> element, fall back to .header-wrapper, then the block itself
  const wrapper = block.closest('header') || block.closest('.header-wrapper') || block;

  // Build DOM pieces
  const utilityBar = buildUtilityBar(DEFAULT_UTILITY);
  const mainBar = buildMainBar(DEFAULT_NAV, DEFAULT_UTILITY);
  const searchPanel = buildSearchPanel();
  const drawer = buildDrawer(DEFAULT_NAV, DEFAULT_UTILITY);
  const overlay = buildOverlay();

  block.append(utilityBar, mainBar, searchPanel, drawer, overlay);

  // ---- Element references ----
  const hamburger = block.querySelector('.header-hamburger');
  const drawerClose = block.querySelector('.drawer-close');
  const searchBtn = block.querySelector('.header-search-btn');
  const searchClose = block.querySelector('.header-search-close');
  const searchInput = block.querySelector('.header-search-input');
  const navEl = block.querySelector('.header-nav');

  // ---- Sticky ----
  const stickyObserver = new IntersectionObserver(
    ([entry]) => {
      wrapper.classList.toggle('is-sticky', !entry.isIntersecting);
    },
    { threshold: 0, rootMargin: '-60px 0px 0px 0px' },
  );
  // Observe a sentinel at the top of the page
  let sentinel = document.getElementById('header-sticky-sentinel');
  if (!sentinel) {
    sentinel = el('div', { id: 'header-sticky-sentinel', style: 'position:absolute;top:0;height:1px;' });
    document.body.prepend(sentinel);
  }
  stickyObserver.observe(sentinel);

  // ---- Scroll-based sticky (fallback) ----
  window.addEventListener('scroll', () => {
    wrapper.classList.toggle('is-sticky', window.scrollY > 60);
  }, { passive: true });

  // ---- Hamburger ----
  hamburger.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('is-open');
    if (isOpen) {
      closeDrawer(drawer, overlay, hamburger);
    } else {
      openDrawer(drawer, overlay, hamburger);
    }
  });

  drawerClose.addEventListener('click', () => closeDrawer(drawer, overlay, hamburger));
  overlay.addEventListener('click', () => closeDrawer(drawer, overlay, hamburger));

  // ---- Search panel positioning — always sits directly below the header ----
  function updateSearchPanelTop() {
    const headerRect = (block.closest('header') || block).getBoundingClientRect();
    searchPanel.style.top = `${headerRect.bottom}px`;
  }
  updateSearchPanelTop();
  window.addEventListener('scroll', updateSearchPanelTop, { passive: true });
  window.addEventListener('resize', updateSearchPanelTop, { passive: true });

  // ---- Search ----
  searchBtn.addEventListener('click', () => {
    const isOpen = searchPanel.classList.contains('is-open');
    if (isOpen) {
      closeSearch(searchPanel, searchBtn);
    } else {
      updateSearchPanelTop(); // recalculate before opening
      openSearch(searchPanel, searchBtn, searchInput);
    }
  });

  searchClose.addEventListener('click', () => closeSearch(searchPanel, searchBtn));

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const query = encodeURIComponent(searchInput.value.trim());
      if (query) window.location.href = `/search.html?q=${query}`;
    }
  });

  // ---- Desktop dropdowns ----
  const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;

  navEl.querySelectorAll('.header-nav-item--has-dropdown').forEach((item) => {
    const link = item.querySelector('.header-nav-link');

    // Hover (desktop)
    item.addEventListener('mouseenter', () => {
      if (!isDesktop()) return;
      closeAllDropdowns(navEl);
      item.classList.add('header-nav-item--open');
      link.setAttribute('aria-expanded', 'true');
    });

    item.addEventListener('mouseleave', () => {
      if (!isDesktop()) return;
      item.classList.remove('header-nav-item--open');
      link.setAttribute('aria-expanded', 'false');
    });

    // Click (mobile — though desktop nav is hidden on mobile, keep for medium viewports)
    link.addEventListener('click', (e) => {
      if (isDesktop()) return; // let hover handle it on desktop
      e.preventDefault();
      const isOpen = item.classList.contains('header-nav-item--open');
      closeAllDropdowns(navEl);
      if (!isOpen) {
        item.classList.add('header-nav-item--open');
        link.setAttribute('aria-expanded', 'true');
      }
    });

    // Keyboard: Enter/Space toggle
    link.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (isDesktop()) return;
        e.preventDefault();
        link.click();
      }
    });
  });

  // ---- Click outside to close dropdown ----
  document.addEventListener('click', (e) => {
    if (!navEl.contains(e.target)) {
      closeAllDropdowns(navEl);
    }
  });

  // ---- Escape key ----
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (drawer.classList.contains('is-open')) {
      closeDrawer(drawer, overlay, hamburger);
    }
    if (searchPanel.classList.contains('is-open')) {
      closeSearch(searchPanel, searchBtn);
    }
    closeAllDropdowns(navEl);
  });
}
