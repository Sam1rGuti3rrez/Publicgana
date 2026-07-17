document.addEventListener('DOMContentLoaded', () => {
  const year = new Date().getFullYear();
  const footer = document.querySelector('.md-footer-meta__inner');
  if (footer && !footer.dataset.publiganaYear) {
    footer.dataset.publiganaYear = String(year);
  }
});
