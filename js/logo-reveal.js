/* ============================================================
   logo-reveal.js — SVG Trace + Shimmer Animation
   ============================================================ */

export class LogoReveal {
  constructor() {
    this.container = document.querySelector('.logo-container');
    this.logoImage = document.querySelector('.logo-image');
    this.shimmer = document.querySelector('.logo-shimmer');
    this.tagline = document.querySelector('.logo-tagline');
    this.storeDetails = document.querySelector('.store-details');
    this.btn = document.querySelector('.reveal-btn');
    this.isRevealed = false;

    if (this.btn) {
      this.btn.addEventListener('click', () => this.reveal());
    }
  }

  reveal() {
    if (this.isRevealed) return;
    this.isRevealed = true;

    // Hide the button
    this.btn.classList.add('hidden');

    // Smooth scroll to the logo container so it's centered in the viewport
    if (this.container) {
      this.container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Show logo container
    setTimeout(() => {
      this.container.classList.add('revealed');

      // Create particle burst around the logo area
      this.createRevealParticles();

      // Step 1: Begin circular border trace (simulated with expanding ring)
      this.animateTraceIn();
    }, 500);
  }

  animateTraceIn() {
    // Step 1: Trace circular border (0 - 1.5s)
    const traceRing = document.createElement('div');
    traceRing.style.cssText = `
      position: absolute;
      top: 50%; left: 50%;
      width: 0; height: 0;
      border: 2px solid #D9B872;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      transition: width 1.5s cubic-bezier(0.25, 0.1, 0.25, 1),
                  height 1.5s cubic-bezier(0.25, 0.1, 0.25, 1),
                  opacity 0.5s ease;
      box-shadow: 0 0 20px rgba(217, 184, 114, 0.3);
    `;
    this.container.appendChild(traceRing);

    requestAnimationFrame(() => {
      const size = Math.min(this.container.offsetWidth, this.container.offsetHeight);
      traceRing.style.width = `${size}px`;
      traceRing.style.height = `${size}px`;
    });

    // Step 2: Show the logo image (after trace completes)
    setTimeout(() => {
      this.logoImage.classList.add('visible');

      // Fade out the trace ring
      traceRing.style.opacity = '0';
      setTimeout(() => traceRing.remove(), 500);
    }, 1500);

    // Step 3: Shimmer sweep (1s after logo appears)
    setTimeout(() => {
      this.shimmer.classList.add('sweep');
    }, 2500);

    // Step 4: Show tagline (after shimmer)
    setTimeout(() => {
      if (this.tagline) {
        this.tagline.classList.add('visible');
      }
    }, 3500);

    // Step 5: Show store details (after tagline) and scroll to center it
    setTimeout(() => {
      if (this.storeDetails) {
        this.storeDetails.classList.add('visible');
        this.storeDetails.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 4200);

    // Step 6: Second subtle particle burst
    setTimeout(() => {
      this.createRevealParticles(true);
    }, 2700);
  }

  createRevealParticles(subtle = false) {
    const parent = this.container.parentElement;
    const count = subtle ? 12 : 20;
    const rect = this.container.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const radius = rect.width / 2;

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Position around the logo
        const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
        const dist = radius * (0.8 + Math.random() * 0.4);
        const x = cx + Math.cos(angle) * dist;
        const y = cy + Math.sin(angle) * dist;
        const size = subtle ? 2 + Math.random() * 3 : 3 + Math.random() * 4;
        const duration = 2 + Math.random() * 2;

        particle.style.cssText = `
          position: fixed;
          left: ${x}px;
          top: ${y}px;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: #D9B872;
          box-shadow: 0 0 ${size * 2}px rgba(217, 184, 114, 0.5);
          z-index: 1000;
          pointer-events: none;
          animation: particleFloat ${duration}s ease-out forwards;
        `;

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), duration * 1000);
      }, i * 60);
    }
  }
}
