// --- Inertia-based Smooth Scroll ---
(function() {
  let currentY = 0;                // Current scroll position
  let velocity = 0;                // Current scroll velocity
  const friction = 0.92;           // Scroll resistance (quicker stop)
  const stopThreshold = 0.1;       // Minimum velocity before stopping
  const maxInputVelocity = 8;      // Limit input speed from one wheel/touch event
  const maxTotalVelocity = 80;     // Maximum velocity allowed
  const scrollScale = 0.6;         // How much wheel movement affects scroll
  let isAnimating = false;         // Prevent multiple animation loops
  
  function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
  }
  
  function animate() {
    // Apply friction to slow down scrolling
    velocity *= friction;
    
    // Stop if velocity is very small
    if (Math.abs(velocity) < stopThreshold) {
      velocity = 0;
      isAnimating = false;
      return;
    }
    
    // Update scroll position
    currentY += velocity;
    
    // Ensure we don't scroll beyond page boundaries
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    currentY = clamp(currentY, 0, maxScroll);
    
    // Move the page
    window.scrollTo(0, currentY);
    
    // Keep animating until velocity reaches zero
    requestAnimationFrame(animate);
  }
  
  // Handle mouse wheel input
  function handleWheel(e) {
    e.preventDefault();
    
    // Sync with actual scroll position (in case user scrolled via scrollbar)
    currentY = window.pageYOffset || document.documentElement.scrollTop;
    
    // Convert wheel delta to velocity
    let inputVelocity = e.deltaY * scrollScale;
    inputVelocity = clamp(inputVelocity, -maxInputVelocity, maxInputVelocity);
    
    // Add to current velocity and clamp total
    velocity += inputVelocity;
    velocity = clamp(velocity, -maxTotalVelocity, maxTotalVelocity);
    
    // If there's enough velocity and not already animating, start animation loop
    if (Math.abs(velocity) >= stopThreshold && !isAnimating) {
      isAnimating = true;
      requestAnimationFrame(animate);
    }
  }
  
  // Add wheel listener with proper browser support
  if (window.addEventListener) {
    // Modern browsers
    window.addEventListener('wheel', handleWheel, { passive: false });
  } else if (window.attachEvent) {
    // IE8 and older
    window.attachEvent('onmousewheel', handleWheel);
  }
  
  // Sync starting position with actual scroll
  function initScroll() {
    currentY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }
  
  if (document.readyState === 'complete') {
    initScroll();
  } else if (window.addEventListener) {
    window.addEventListener('load', initScroll);
  } else if (window.attachEvent) {
    window.attachEvent('onload', initScroll);
  }
})();
