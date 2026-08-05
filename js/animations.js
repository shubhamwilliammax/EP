/* ==========================================================================
   ANIMATIONS & SCROLL OBSERVERS MODULE
   ========================================================================== */

export function initAnimations() {
  // 1. Scroll Reveal Observer
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    revealObserver.observe(el);
  });

  // Inject CSS class for revealed state
  const style = document.createElement('style');
  style.textContent = `
    .reveal-on-scroll.revealed {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

  // 2. Counter Animation for Stats
  const statNumbers = document.querySelectorAll('.stat-number');
  const statsSection = document.querySelector('.stats-section');

  if (statsSection && statNumbers.length) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.target, 10);
            const prefix = stat.dataset.prefix || '';
            const suffix = stat.dataset.suffix || '';
            animateCounter(stat, target, prefix, suffix, 2000);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
  }

  function animateCounter(element, target, prefix, suffix, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * target);
      element.textContent = `${prefix}${value.toLocaleString()}${suffix}`;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }
}
