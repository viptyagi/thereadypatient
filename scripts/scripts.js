/**
 * scripts.js — EDS entry point
 * TheReadyPatient EDS Migration
 *
 * Bootstraps the page via loadPage() and re-exports common helpers
 * for use by individual block scripts.
 */

import {
  loadPage,
  decorateBlock,
  loadBlock,
  loadCSS,
} from './aem.js';

export {
  decorateBlock,
  loadBlock,
  loadCSS,
};

// Kick off page decoration and block loading immediately.
loadPage();
