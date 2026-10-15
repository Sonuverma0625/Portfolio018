import { prefersReducedMotion } from './animations.js';

const SWAY_DEGREES = 38;
const POINTER_TILT_DEGREES = 7;
const SCROLL_TILT_DEGREES = 9;
const SHRINK_AMOUNT = 0.08;

// Animate the portrait cube with small pointer and scroll influences.
function setupCubeAnimation() {
  const stage = document.getElementById('cube-stage');
  const cube = document.getElementById('photo-cube');
  const pointer = { x: 0, y: 0 };

  if (prefersReducedMotion.matches) {
    cube.style.transform = 'rotateX(-8deg) rotateY(-24deg)';
    return;
  }

  stage.addEventListener('pointermove', (event) => {
    const bounds = stage.getBoundingClientRect();
    pointer.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    pointer.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
  });
  stage.addEventListener('pointerleave', () => {
    pointer.x = 0;
    pointer.y = 0;
  });

  let smoothedPointerX = 0;
  let smoothedPointerY = 0;

  // Keep the motion smooth by updating transforms once per animation frame.
  function animateCube(now) {
    const scrollProgress = Math.min(Math.max(window.scrollY / Math.max(window.innerHeight, 1), 0), 1);
    smoothedPointerX += (pointer.x - smoothedPointerX) * 0.035;
    smoothedPointerY += (pointer.y - smoothedPointerY) * 0.035;

    const sway = Math.sin(now * 0.00036) * SWAY_DEGREES;
    const mouseTurn = smoothedPointerX * POINTER_TILT_DEGREES;
    const mouseLean = -smoothedPointerY * POINTER_TILT_DEGREES;
    const scrollTilt = scrollProgress * SCROLL_TILT_DEGREES;
    const scale = 1 - scrollProgress * SHRINK_AMOUNT;
    cube.style.transform = `rotateX(${-8 + mouseLean - scrollTilt}deg) rotateY(${sway + mouseTurn}deg) scale(${scale})`;

    requestAnimationFrame(animateCube);
  }

  requestAnimationFrame(animateCube);
}

export { setupCubeAnimation };
