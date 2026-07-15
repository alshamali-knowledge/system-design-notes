// Hook into MkDocs Material's instant navigation lifecycle
document$.subscribe(function() {
  // If MathJax is loaded, tell it to re-scan the new page content
  if (window.MathJax) {
    MathJax.typesetPromise();
  }
});