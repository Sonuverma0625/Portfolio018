import { renderPortfolio } from './render.js';
import { setupAnimations, startPreloader } from './animations.js';
import { setupCubeAnimation } from './cube3d.js';
import { setupCertificateDrag, setupCursorEffects } from './cursor.js';
import { setupSmoothScrolling } from './smooth-scroll.js';
import { setupContactForm } from './contact-form.js';

const NAV_MENU_BREAKPOINT = 760;

// Keep the small navigation menu usable with a keyboard and on touch screens.
function setupMobileNavigation() {
  const menuButton = document.getElementById('menu-toggle');
  const navigation = document.getElementById('nav-links');

  // Close the menu after a visitor follows a link or presses Escape.
  function closeMenu() {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation menu');
  }

  menuButton.addEventListener('click', () => {
    const shouldOpen = menuButton.getAttribute('aria-expanded') !== 'true';
    navigation.classList.toggle('is-open', shouldOpen);
    menuButton.setAttribute('aria-expanded', String(shouldOpen));
    menuButton.setAttribute('aria-label', shouldOpen ? 'Close navigation menu' : 'Open navigation menu');
  });

  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > NAV_MENU_BREAKPOINT) closeMenu();
  });
}

// Render portfolio data before observers and interactions look for their cards.
function startPortfolio() {
  document.body.classList.add('js-ready');
  renderPortfolio();
  setupMobileNavigation();
  setupAnimations();
  setupCubeAnimation();
  setupCursorEffects();
  setupCertificateDrag();
  setupSmoothScrolling();
  setupContactForm();
  startPreloader();
}

startPortfolio();
