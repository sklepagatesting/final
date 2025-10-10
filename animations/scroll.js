// --- Adaptive Inertia-based Smooth Scroll (Chrome 141+) ---
(() => {
  let currentY = window.scrollY;
  let velocity = 0;
  let isAnimating = false;

  // Core tuning (≈40% freer)
  const friction = 0.88;            // Lower = more glide (0.92 → 0.88 = 40% looser)
  const stopThreshold = 0.04;
  const baseScrollScale = 0.11;     // Higher = more responsive
  const maxInputVelocity = 3.5;
  const maxTotalVelocity = 45;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  // --- Device sensitivity auto-adjust ---
  function getDeviceScale(e) {
    const abs = Math.abs(e.deltaY);
    if (abs < 15) return baseScrollScale * 2.0; // gentle touchpad
    if (abs < 60) return baseScrollScale * 1.1; // mid-range
    return baseScrollScale * 0.6;               // coarse wheel
  }

  function animate() {
    if (!isAnimating) return;

    velocity *= friction;
    if (Math.abs(velocity) < stopThreshold) {
      velocity = 0;
      isAnimating = false;
      return;
    }

    currentY += velocity;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    currentY = clamp(currentY, 0, maxScroll);

    window.scrollTo(0, currentY);
    requestAnimationFrame(animate);
  }

  window.addEventListener(
    "wheel",
    (e) => {
      if (e.cancelable) e.preventDefault();

      const scale = getDeviceScale(e);
      let inputVelocity = e.deltaY * scale;
      inputVelocity = clamp(inputVelocity, -maxInputVelocity, maxInputVelocity);
      velocity = clamp(velocity + inputVelocity, -maxTotalVelocity, maxTotalVelocity);

      if (!isAnimating) {
        isAnimating = true;
        requestAnimationFrame(animate);
      }
    },
    { passive: false }
  );
})();
