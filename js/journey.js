/* ============================================================
   journey.js — Scroll-Snapped Journey Section
   ============================================================ */

export class Journey {
  constructor() {
    this.milestones = document.querySelectorAll('.journey-milestone');
    this.observer = null;
    this.init();
  }

  init() {
    // Intersection Observer for milestone visibility
    // Toggles in-view on enter AND off on leave so only the active icon glows
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        } else {
          entry.target.classList.remove('in-view');
        }
      });
    }, {
      threshold: 0.4,
      rootMargin: '-10% 0px -10% 0px'
    });

    this.milestones.forEach(milestone => {
      this.observer.observe(milestone);
    });
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
