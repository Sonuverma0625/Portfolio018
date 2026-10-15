import { prefersReducedMotion } from './animations.js';

const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const CURSOR_FOLLOW_FACTOR = 0.16;
const BUTTON_PULL_FACTOR = 0.08;
const CARD_TILT_DEGREES = 5;

// Add the delayed ring and magnetic response only for a mouse or trackpad.
function setupCursorEffects() {
  if (!hasFinePointer || prefersReducedMotion.matches) return;

  const cursor = document.getElementById('custom-cursor');
  const ring = cursor.querySelector('i');
  const pointer = { x: -100, y: -100, ringX: -100, ringY: -100 };

  // Ease the larger ring behind the small pointer dot.
  function moveCursor() {
    pointer.ringX += (pointer.x - pointer.ringX) * CURSOR_FOLLOW_FACTOR;
    pointer.ringY += (pointer.y - pointer.ringY) * CURSOR_FOLLOW_FACTOR;
    cursor.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`;
    ring.style.transform = `translate(calc(-50% + ${pointer.ringX - pointer.x}px), calc(-50% + ${pointer.ringY - pointer.y}px))`;
    requestAnimationFrame(moveCursor);
  }

  document.addEventListener('pointermove', (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    cursor.classList.add('is-visible');
  }, { passive: true });

  document.addEventListener('pointerout', (event) => {
    if (!event.relatedTarget) cursor.classList.remove('is-visible');
  });

  document.querySelectorAll('a, button, input, textarea').forEach((element) => {
    element.addEventListener('pointerenter', () => cursor.classList.add('is-hovering'));
    element.addEventListener('pointerleave', () => cursor.classList.remove('is-hovering'));
  });

  document.querySelectorAll('.magnetic').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const bounds = button.getBoundingClientRect();
      const x = (event.clientX - bounds.left - bounds.width / 2) * BUTTON_PULL_FACTOR;
      const y = (event.clientY - bounds.top - bounds.height / 2) * BUTTON_PULL_FACTOR;
      button.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
    button.addEventListener('pointerleave', () => {
      button.style.transform = '';
    });
  });

  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      card.style.setProperty('--spot-x', `${x * 100}%`);
      card.style.setProperty('--spot-y', `${y * 100}%`);
      card.style.transform = `perspective(900px) rotateX(${(0.5 - y) * CARD_TILT_DEGREES * 0.8}deg) rotateY(${(x - 0.5) * CARD_TILT_DEGREES}deg)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });

  requestAnimationFrame(moveCursor);
}

// Let mouse users drag the certificate strip while touch users keep native swipes.
function setupCertificateDrag() {
  const rail = document.getElementById('certificate-rail');
  let startPointerX = 0;
  let startScrollLeft = 0;
  let isDragging = false;

  rail.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    isDragging = true;
    startPointerX = event.clientX;
    startScrollLeft = rail.scrollLeft;
    rail.classList.add('is-dragging');
    rail.setPointerCapture(event.pointerId);
  });

  rail.addEventListener('pointermove', (event) => {
    if (!isDragging) return;
    rail.scrollLeft = startScrollLeft - (event.clientX - startPointerX);
  });

  // Reset the mouse drag after release or an interrupted pointer event.
  function stopDragging() {
    isDragging = false;
    rail.classList.remove('is-dragging');
  }

  rail.addEventListener('pointerup', stopDragging);
  rail.addEventListener('pointercancel', stopDragging);
}

export { setupCertificateDrag, setupCursorEffects };
