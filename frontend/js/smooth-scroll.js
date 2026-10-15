const NAVIGATION_OFFSET = 92;
const LENIS_MODULE_URL = 'https://cdn.jsdelivr.net/npm/lenis@1.1.13/+esm';
const LENIS_LERP = 0.075;
const WHEEL_MULTIPLIER = 0.85;
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

// Register links immediately so navigation remains smooth while Lenis loads or offline.
async function setupSmoothScrolling() {
  let lenis = null;

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;

      event.preventDefault();
      const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;

      if (lenis && !prefersReducedMotion) {
        lenis.scrollTo(target, { offset: -NAVIGATION_OFFSET, lerp: LENIS_LERP });
        return;
      }

      const targetTop = target.getBoundingClientRect().top + window.scrollY - NAVIGATION_OFFSET;
      window.scrollTo({ top: targetTop, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  if (!window.matchMedia(REDUCED_MOTION_QUERY).matches) {
    try {
      const module = await import(LENIS_MODULE_URL);
      lenis = new module.default({
        smoothWheel: true,
        lerp: LENIS_LERP,
        wheelMultiplier: WHEEL_MULTIPLIER,
      });

      // Advance Lenis on animation frames without tying it to page layout.
      function updateLenis(now) {
        lenis.raf(now);
        requestAnimationFrame(updateLenis);
      }

      requestAnimationFrame(updateLenis);
    } catch {
      lenis = null;
    }
  }
}

export { setupSmoothScrolling };
