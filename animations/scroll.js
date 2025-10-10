// --- Adaptive Inertia-based Smooth Scroll (Chrome 141+) ---
(() => {
  let currentY = 0;
  let velocity = 0;
  let isAnimating = false;

  // Core tuning (slightly looser than previous version)
  let friction = 0.40;            // Lower = looser, slower stop (5% looser than 0.92)
  const stopThreshold = 0.04;
  const baseScrollScale = 0.08;
  const maxInputVelocity = 2.8;
  const maxTotalVelocity = 35;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  // --- Device sensitivity auto-adjust ---
  function getDeviceScale(e) {
    // Trackpad scrolls are small & frequent, mouse wheels are larger
    const abs = Math.abs(e.deltaY);
    if (abs < 15) return baseScrollScale * 2.2; // gentle touchpad
    if (abs < 60) return baseScrollScale * 1.2; // mid-range
    return baseScrollScale * 0.6;               // coarse wheel (reduce speed)
  }

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

    window.scrollTo({ top: currentY, behavior: "instant" });
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

  window.addEventListener("load", () => {
    currentY = window.scrollY;
  });
})();


