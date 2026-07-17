// Self-healing Progress Bar attached to the MkDocs Header
const waitForMkDocs = setInterval(() => {
  if (typeof document$ !== 'undefined') {
    clearInterval(waitForMkDocs); // MkDocs is ready
    
    document$.subscribe(() => {
      // 1. Target the MkDocs Header specifically
      const header = document.querySelector('.md-header');
      if (!header) return;

      let bar = document.getElementById('reading-progress');
      if (!bar) {
        bar = document.createElement('div');
        bar.id = 'reading-progress';
        
        // 2. Position it ABSOLUTELY inside the header
        bar.style.position = 'absolute';
        bar.style.bottom = '0'; // Snaps perfectly to the bottom edge of the header
        bar.style.left = '0';
        bar.style.height = '3px';
        
        // 3. High Contrast Color (White) to pop against the Indigo header
        bar.style.backgroundColor = '#ffffff'; 
        bar.style.boxShadow = '0 1px 4px rgba(0,0,0,0.4)'; // Adds depth so it stands out
        
        bar.style.width = '0%';
        bar.style.zIndex = '100'; // Safe inside the header
        bar.style.transition = 'width 0.1s linear';
        bar.style.pointerEvents = 'none';
        
        // 4. Inject INSIDE the header, not the body
        header.appendChild(bar);
      }

      // Reset width on new page load
      bar.style.width = '0%';

      // High-performance scroll tracking
      let ticking = false;
      const updateProgress = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 100;
        bar.style.width = percent + '%';
        ticking = false;
      };

      // Clean up old listeners to prevent memory leaks on instant nav
      window.removeEventListener('scroll', handleScroll);
      
      function handleScroll() {
        if (!ticking) {
          window.requestAnimationFrame(updateProgress);
          ticking = true;
        }
      }
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      updateProgress(); // Run once immediately for short pages
    });
  }
}, 100);