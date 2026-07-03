/* ============================================================
   curtain.js — Curtain Parting Animation
   ============================================================ */

export class Curtain {
  constructor() {
    this.leftPanel = document.querySelector('.curtain-panel--left');
    this.rightPanel = document.querySelector('.curtain-panel--right');
    this.scene = document.getElementById('scene-curtain');
    this.instruction = document.querySelector('.cut-instruction');
    this.heading = document.querySelector('.curtain-heading');
    this.isParted = false;
  }

  part() {
    if (this.isParted) return;
    this.isParted = true;

    // Hide the instruction and heading
    if (this.instruction) {
      this.instruction.classList.add('hidden');
    }
    if (this.heading) {
      this.heading.classList.add('hidden');
    }

    // Part the curtains with asymmetric timing
    requestAnimationFrame(() => {
      this.leftPanel.classList.add('parted');

      // Right panel follows with slight delay (handled via CSS transition-delay)
      this.rightPanel.classList.add('parted');

      // Shift background to warm gradient
      document.body.style.transition = 'background 2s ease';
      document.body.style.background = 'linear-gradient(135deg, #4A2D7A 0%, #B03A8C 50%, #F5A9C9 100%)';

      // After curtains are parted, hide the scene
      setTimeout(() => {
        this.scene.classList.add('hidden');
      }, 2500);
    });
  }

  destroy() {
    if (this.scene) {
      this.scene.remove();
    }
  }
}
