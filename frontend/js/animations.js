import { portfolio } from './data.js';

const PROGRESS_BAR = document.getElementById('scroll-progress');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const PRELOADER_DURATION_MS = 1100;
const PRELOADER_EXIT_MS = 760;
const REVEAL_THRESHOLD = 0.12;
const REVEAL_ROOT_MARGIN = '0px 0px -32px 0px';
const TYPING_SPEED_MS = 75;
const DELETING_SPEED_MS = 38;
const ROLE_PAUSE_MS = 1250;
const COUNTER_DURATION_MS = 900;
const COUNTER_THRESHOLD = 0.5;
const SKILL_THRESHOLD = 0.25;
const TIMELINE_VIEWPORT_POINT = 0.72;

// Count the opening screen up before it slides away.
function startPreloader() {
  const preloader = document.getElementById('preloader');
  const count = document.getElementById('preloader-count');
  let currentCount = 0;
  const duration = prefersReducedMotion.matches ? 0 : PRELOADER_DURATION_MS;
  const startTime = performance.now();

  preloader.hidden = false;

  // Update the opening count and its progress rule in one animation frame.
  function updateCount(now) {
    const progress = duration === 0 ? 1 : Math.min((now - startTime) / duration, 1);
    currentCount = Math.round(progress * 100);
    count.textContent = String(currentCount);
    preloader.style.setProperty('--loader-scale', String(progress));

    if (progress < 1) {
      requestAnimationFrame(updateCount);
      return;
    }

    document.getElementById('hero-title').classList.add('is-revealed');
    preloader.classList.add('is-leaving');
    window.setTimeout(() => {
      preloader.hidden = true;
    }, PRELOADER_EXIT_MS);
  }

  requestAnimationFrame(updateCount);
}

// Reveal ordinary content as it reaches the visible part of the page.
function setupRevealObserver() {
  if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) return;

  document.body.classList.add('motion-enabled');
  // Reveal each item only once when it comes into view.
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: REVEAL_THRESHOLD, rootMargin: REVEAL_ROOT_MARGIN });

  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
}

// Type each role with a short pause and delete it before the next phrase.
function setupTypingText() {
  const target = document.getElementById('typing-role');
  const roles = portfolio.roles;
  let roleIndex = 0;
  let characterIndex = roles[0].length;
  let isDeleting = false;
  if (prefersReducedMotion.matches) return;

  // Type the current role and pause before moving to the next one.
  function updateText() {
    const role = roles[roleIndex];
    characterIndex += isDeleting ? -1 : 1;
    target.textContent = role.slice(0, characterIndex);

    if (characterIndex === role.length) {
      isDeleting = true;
      window.setTimeout(updateText, ROLE_PAUSE_MS);
      return;
    }

    if (characterIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }

    window.setTimeout(updateText, isDeleting ? DELETING_SPEED_MS : TYPING_SPEED_MS);
  }

  window.setTimeout(updateText, ROLE_PAUSE_MS);
}

// Count each portfolio number only the first time its card enters view.
function setupNumberCounters() {
  if (!('IntersectionObserver' in window)) return;

  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const counter = entry.target;
      const target = Number(counter.dataset.count);
      const suffix = counter.dataset.suffix || '';
      const duration = prefersReducedMotion.matches ? 0 : COUNTER_DURATION_MS;
      const startedAt = performance.now();

      // Update a counter with text so its card keeps the same size.
      function showValue(now) {
        const progress = duration === 0 ? 1 : Math.min((now - startedAt) / duration, 1);
        counter.textContent = `${Math.round(target * progress)}${suffix}`;
        if (progress < 1) requestAnimationFrame(showValue);
      }

      requestAnimationFrame(showValue);
      observer.unobserve(counter);
    });
  }, { threshold: COUNTER_THRESHOLD });

  counters.forEach((counter) => counterObserver.observe(counter));
}

// Fill each skill bar from a transform after its own skill card is visible.
function setupSkillBars() {
  const skillCards = document.querySelectorAll('.skill-card');

  skillCards.forEach((card) => {
    card.querySelectorAll('.skill-item').forEach((item) => {
      item.style.setProperty('--skill-level', `${item.dataset.skillLevel}%`);
    });
  });

  if (!('IntersectionObserver' in window)) {
    skillCards.forEach((card) => card.classList.add('is-visible'));
    return;
  }

  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: SKILL_THRESHOLD });

  skillCards.forEach((card) => skillObserver.observe(card));
}

// Draw the experience line with scale rather than changing its layout size.
function setupTimeline() {
  const timeline = document.getElementById('timeline');
  const line = document.getElementById('timeline-progress');
  let frameRequested = false;

  // Scale the timeline line instead of changing the layout around it.
  function updateLine() {
    frameRequested = false;
    const bounds = timeline.getBoundingClientRect();
    const visibleProgress = Math.min(Math.max((window.innerHeight * TIMELINE_VIEWPORT_POINT - bounds.top) / bounds.height, 0), 1);
    line.style.transform = `scaleY(${visibleProgress})`;
  }

  // Limit scroll work to one update per frame.
  function requestLineUpdate() {
    if (frameRequested) return;
    frameRequested = true;
    requestAnimationFrame(updateLine);
  }

  window.addEventListener('scroll', requestLineUpdate, { passive: true });
  window.addEventListener('resize', requestLineUpdate);
  requestLineUpdate();
}

// Keep the orange progress line in step with the visitor's scroll position.
function setupScrollProgress() {
  let frameRequested = false;

  // Update the top progress bar from the current scroll position.
  function updateProgress() {
    frameRequested = false;
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    PROGRESS_BAR.style.transform = `scaleX(${progress})`;
  }

  // Reuse one animation frame when several scroll events arrive together.
  function requestProgressUpdate() {
    if (frameRequested) return;
    frameRequested = true;
    requestAnimationFrame(updateProgress);
  }

  window.addEventListener('scroll', requestProgressUpdate, { passive: true });
  window.addEventListener('resize', requestProgressUpdate);
  requestProgressUpdate();
}

// Turn on the small animation systems after page content exists.
function setupAnimations() {
  setupRevealObserver();
  setupTypingText();
  setupNumberCounters();
  setupSkillBars();
  setupTimeline();
  setupScrollProgress();
}

export { setupAnimations, startPreloader, prefersReducedMotion };
