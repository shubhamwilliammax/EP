/* ==========================================================================
   PORTFOLIO FILTER & LIGHTBOX GALLERY MODULE
   ========================================================================== */

export function initPortfolio() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const lightboxModal = document.getElementById('portfolioLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxLocation = document.getElementById('lightboxLocation');
  const closeLightbox = document.getElementById('closeLightbox');

  if (!filterTabs.length || !portfolioItems.length) return;

  // Filter Tabs Handler
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.dataset.filter;

      portfolioItems.forEach(item => {
        const itemCategory = item.dataset.category;
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox Modal Trigger
  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.portfolio-item-title')?.textContent || '';
      const category = item.querySelector('.portfolio-tag')?.textContent || '';
      const location = item.querySelector('.portfolio-location')?.textContent || '';

      if (lightboxImg && img) lightboxImg.src = img.src;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxCategory) lightboxCategory.textContent = category;
      if (lightboxLocation) lightboxLocation.textContent = location;

      if (lightboxModal) {
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeLightbox && lightboxModal) {
    closeLightbox.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    });

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }
}
