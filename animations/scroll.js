// --- Inertia-based Smooth Scroll (tuned for Chrome 141) ---
(() => {
  let currentY = 0;                // Current scroll position
  let velocity = 0;                // Current scroll velocity
  const friction = 0.92;           // Slightly stronger drag (slower deceleration)
  const stopThreshold = 0.04;      // Lower = stops more gradually
  const scrollScale = 0.08;        // Reduced sensitivity (was 0.2 before)
  const maxInputVelocity = 2.5;    // Cap single-wheel flicks
  const maxTotalVelocity = 30;     // Prevent runaway speed
  let isAnimating = false;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  function animate() {
    velocity *= friction;

    if (Math.abs(velocity) < stopThreshold) {
      velocity = 0;
      isAnimating = false;
      return;
    }

    currentY += velocity;

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    currentY = clamp(currentY, 0, maxScroll);

    // 'instant' avoids Chrome's built-in scroll easing interference
    window.scrollTo({ top: currentY, behavior: 'instant' });

    requestAnimationFrame(animate);
  }

  window.addEventListener(
    "wheel",
    (e) => {
      if (e.cancelable) e.preventDefault();

      // Normalize and reduce sensitivity
      let inputVelocity = e.deltaY * scrollScale;

      inputVelocity = clamp(inputVelocity, -maxInputVelocity, maxInputVelocity);
      velocity = clamp(velocity + inputVelocity, -maxTotalVelocity, maxTotalVelocity);

      if (!isAnimating) {
        isAnimating = true;
        requestAnimationFrame(animate);
      }
    },
    { passive: false }
  );

  window.addEventListener("load", () => {
    currentY = window.scrollY;
  });
})();
