// Fixes the missing accessible name on the MkDocs search dialog modal
document.addEventListener("DOMContentLoaded", function () {
  const searchDialog = document.querySelector('div.md-search');
  if (searchDialog && !searchDialog.hasAttribute('aria-label') && !searchDialog.hasAttribute('aria-labelledby')) {
    searchDialog.setAttribute('aria-label', 'Search');
  }
});