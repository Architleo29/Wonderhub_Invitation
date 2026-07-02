/* ============================================================
   spotlight.js — Spotlight Cones + Gold Particles
   ============================================================ */

export class SpotlightReveal {
  constructor() {
    this.scene = document.getElementById('scene-reveal');
    this.particles = [];
    this.animationId = null;
    this.isActive = false;
  }

  activate() {
    if (this.isActive) return;
    this.isActive = true;

    this.scene.classList.add('active');

    // Create spotlight cones
    this.createSpotlights();

    // Create particles after spotlights settle
    setTimeout(() => this.createParticles(), 800);

    // Auto-fade after a while
    setTimeout(() => this.fadeOut(), 5000);
  }

  createSpotlights() {
    const positions = [
      { x: '25%', rotation: 15, delay: 0 },
      { x: '50%', rotation: 0, delay: 200 },
      { x: '75%', rotation: -15, delay: 100 },
    ];

    positions.forEach(({ x, rotation, delay }) => {
      const spotlight = document.createElement('div');
      spotlight.className = 'spotlight';
      spotlight.style.left = x;
      spotlight.style.transform = `translateX(-50%) rotate(${rotation + 20}deg)`;
      this.scene.appendChild(spotlight);

      setTimeout(() => {
        spotlight.classList.add('active');
        spotlight.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
      }, delay);
    });
  }

  createParticles() {
    const count = window.innerWidth < 768 ? 15 : 25;

    for (let i = 0; i < count; i++) {
      setTimeout(() => this.spawnParticle(), i * 120);
    }
  }

  spawnParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random position in center area
    const x = 30 + Math.random() * 40; // 30%-70% of viewport
    const startY = 60 + Math.random() * 30; // Start from lower portion
    const size = 2 + Math.random() * 4;
    const duration = 3 + Math.random() * 4;

    // Alternate between gold and pink particles
    const isGold = Math.random() > 0.3;
    const color = isGold ? '#D9B872' : '#F5A9C9';
    const glow = isGold ? 'rgba(217, 184, 114, 0.5)' : 'rgba(245, 169, 201, 0.5)';

    particle.style.left = `${x}%`;
    particle.style.top = `${startY}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.background = color;
    particle.style.boxShadow = `0 0 ${size * 2}px ${glow}`;
    particle.style.animation = `particleFloat ${duration}s ease-out forwards`;

    this.scene.appendChild(particle);
    this.particles.push(particle);

    // Clean up after animation
    setTimeout(() => {
      particle.remove();
    }, duration * 1000);
  }

  fadeOut() {
    this.scene.style.transition = 'opacity 2s ease';
    this.scene.style.opacity = '0';

    setTimeout(() => {
      this.scene.classList.remove('active');
      this.particles.forEach(p => p.remove());
      this.particles = [];
    }, 2000);
  }
}
