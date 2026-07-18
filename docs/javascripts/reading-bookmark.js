// Self-healing Reading Position Bookmark for MkDocs Material
const waitForMkDocs = setInterval(() => {
  if (typeof document$ !== 'undefined') {
    clearInterval(waitForMkDocs);

    // 1. SAVE LOGIC: Debounced scroll listener
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Save the current path and scroll Y
        const path = window.location.pathname;
        localStorage.setItem(`mkdocs-scroll-${path}`, window.scrollY);
      }, 200); // Saves 200ms after user stops scrolling
    }, { passive: true });

    // Also save if the user switches tabs or closes the window
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        const path = window.location.pathname;
        localStorage.setItem(`mkdocs-scroll-${path}`, window.scrollY);
      }
    });

    // 2. RESTORE LOGIC: Hook into Instant Navigation
    document$.subscribe(() => {
      const path = window.location.pathname;
      
      // Guard: Do NOT restore if the user clicked a direct anchor link (e.g., #heading)
      if (window.location.hash) return;

      const savedPos = localStorage.getItem(`mkdocs-scroll-${path}`);
      
      if (savedPos !== null) {
        // Wait 150ms for MathJax SVG and images to render and stabilize page height
        setTimeout(() => {
          window.scrollTo({ 
            top: parseInt(savedPos, 10), 
            behavior: 'auto' // 'auto' is instant, preventing disorientation
          });
        }, 150);
      }
    });
  }
}, 100);