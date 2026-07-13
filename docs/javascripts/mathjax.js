window.MathJax = {
  tex: {
    inlineMath: [["\\(", "\\)"], ["$", "$"]], // Added single dollar signs for inline convenient math
    displayMath: [["\\[", "\\]"], ["$$", "$$"]],
    processEscapes: true,
    processEnvironments: true
  },
  options: {
    // Allows MathJax to scan all standard body text and raw HTML blocks
    ignoreHtmlClass: "tex2jax_ignore",
    processHtmlClass: "tex2jax_process|arithmatex"
  }
};