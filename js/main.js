/* ============================================================
   main.js — App Bootstrap & Scene Orchestration
   ============================================================ */

import { Rope } from './rope.js';
import { Curtain } from './curtain.js';
import { SpotlightReveal } from './spotlight.js';
import { Countdown } from './countdown.js';
import { Journey } from './journey.js';
import { LogoReveal } from './logo-reveal.js';

class WonderHubApp {
  constructor() {
    this.rope = null;
    this.curtain = null;
    this.spotlight = null;
    this.countdown = null;
    this.journey = null;
    this.logoReveal = null;
    this.audio = null;
    this.isMuted = true;

    this.init();
  }

  async init() {
    // Initialize countdown immediately to resolve "--" hyphens before reveal
    this.countdown = new Countdown();
    this.countdown.update();

    // Wait for fonts to load
    await this.preloadFonts();

    // Initialize Scene 1 — Curtain + Rope
    this.initCurtainScene();

    // Initialize audio (muted by default)
    this.initAudio();
  }

  async preloadFonts() {
    try {
      await document.fonts.ready;
    } catch (e) {
      // Fonts may not support this API, proceed anyway
    }
  }

  initCurtainScene() {
    const canvas = document.getElementById('rope-canvas');
    if (!canvas) return;

    this.rope = new Rope(canvas);
    this.curtain = new Curtain();

    // Listen for the rope cut event
    document.addEventListener('rope-cut', (e) => {
      this.onRopeCut(e.detail);
    });
  }

  onRopeCut(detail) {
    // Play cut sound effect hint
    this.playRevealSound();

    // Part the curtains
    this.curtain.part();

    // Activate spotlights + particles after a brief delay
    setTimeout(() => {
      this.spotlight = new SpotlightReveal();
      this.spotlight.activate();
    }, 400);

    // Show main content
    setTimeout(() => {
      this.showMainContent();
    }, 1200);

    // Show proscenium frame
    setTimeout(() => {
      document.querySelectorAll('.proscenium-frame').forEach(el => {
        el.classList.add('visible');
      });
    }, 2000);
  }

  showMainContent() {
    const main = document.getElementById('main-content');
    if (!main) return;

    main.classList.add('visible');

    // Smooth scroll to announcement section so user is anchored correctly
    const announcement = document.getElementById('scene-announcement');
    if (announcement) {
      announcement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Trigger announcement animations
    setTimeout(() => {
      this.animateAnnouncement();
    }, 1500);

    // Start countdown updates
    if (this.countdown) {
      this.countdown.start();
    }

    // Initialize journey scrollytelling
    setTimeout(() => {
      this.journey = new Journey();
    }, 2000);

    // Initialize logo reveal
    this.logoReveal = new LogoReveal();
  }

  animateAnnouncement() {
    const elements = document.querySelectorAll(
      '#scene-announcement .announcement-eyebrow, ' +
      '#scene-announcement .announcement-headline, ' +
      '#scene-announcement .announcement-body, ' +
      '#scene-announcement .announcement-script, ' +
      '#scene-announcement .announcement-date, ' +
      '#scene-announcement .countdown, ' +
      '#scene-announcement .scroll-prompt'
    );

    elements.forEach(el => {
      el.classList.add('animate-in');
    });
  }

  initAudio() {
    const toggle = document.querySelector('.audio-toggle');
    if (!toggle) return;

    // Try to load the audio
    this.audio = new Audio('ElevenLabs_Symphony_timpani_drum_roll.mp3');
    this.audio.loop = false;
    this.audio.volume = 0.3;

    toggle.addEventListener('click', () => {
      this.isMuted = !this.isMuted;
      this.updateAudioIcon(toggle);

      if (!this.isMuted && this.audio) {
        this.audio.play().catch(() => { });
      } else if (this.audio) {
        this.audio.pause();
      }
    });
  }

  playRevealSound() {
    if (!this.isMuted && this.audio) {
      this.audio.currentTime = 0;
      this.audio.play().catch(() => { });
    }
  }

  updateAudioIcon(toggle) {
    const svg = toggle.querySelector('svg');
    if (this.isMuted) {
      svg.innerHTML = `
        <path d="M11 5L6 9H2v6h4l5 4V5z"/>
        <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" stroke-width="2"/>
        <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" stroke-width="2"/>
      `;
    } else {
      svg.innerHTML = `
        <path d="M11 5L6 9H2v6h4l5 4V5z"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke="currentColor" stroke-width="2"/>
      `;
    }
  }
}

// Boot the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new WonderHubApp();
});
