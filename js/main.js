/* ============================================================
   main.js — App Bootstrap & Scene Orchestration
   ============================================================ */

import { Rope } from './rope.js';
import { Curtain } from './curtain.js';
import { SpotlightReveal } from './spotlight.js';
import { Countdown } from './countdown.js';

import { LogoReveal } from './logo-reveal.js';

class WonderHubApp {
  constructor() {
    this.rope = null;
    this.curtain = null;
    this.spotlight = null;
    this.countdown = null;

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

    // Initialize tab switching for offers
    this.initTabs();

    // Initialize calendar add button
    this.initCalendarButton();

    // Initialize share button
    this.initShareButton();

    // Initialize scroll indicator logic
    this.initScrollIndicator();
  }

  initScrollIndicator() {
    this.scrollIndicator = document.querySelector('.scroll-indicator');
    if (!this.scrollIndicator) return;
    this.initialRevealScrollY = 0;
    this.scrollIndicatorReadyToHide = false;

    window.addEventListener('scroll', () => {
      if (!this.scrollIndicatorReadyToHide) return;
      
      // Hide the indicator only if the user has scrolled a substantial amount (e.g. 250px)
      // past the point where the automated scroll landed.
      const hideThreshold = this.initialRevealScrollY + 250;
      
      if (window.scrollY > hideThreshold) {
        this.scrollIndicator.classList.add('hidden');
      } else {
        this.scrollIndicator.classList.remove('hidden');
      }
    }, { passive: true });

    this.enableScrollIndicatorHiding = () => {
      this.initialRevealScrollY = window.scrollY;
      this.scrollIndicatorReadyToHide = true;
    };
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

    // Make the audio button bounce if muted
    if (this.isMuted) {
      setTimeout(() => {
        const toggle = document.querySelector('.audio-toggle');
        if (toggle) toggle.classList.add('attention');
      }, 1500);
    }

    // Part the curtains
    this.curtain.part();

    // Trigger celebration poppers
    if (typeof confetti === 'function') {
      const duration = 3000;
      const end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#D9B872', '#241B4E', '#FFF']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#D9B872', '#241B4E', '#FFF']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }

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
    
    if (this.scrollIndicator) {
      this.scrollIndicator.classList.remove('hidden');
    }

    // Smooth scroll to announcement section so user is anchored correctly
    const announcement = document.getElementById('scene-announcement');
    if (announcement) {
      announcement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Wait for smooth scroll to finish before enabling hide logic
    setTimeout(() => {
      if (this.enableScrollIndicatorHiding) {
        this.enableScrollIndicatorHiding();
      }
    }, 1500);

    // Trigger announcement animations
    setTimeout(() => {
      this.animateAnnouncement();
    }, 1500);

    // Start countdown updates
    if (this.countdown) {
      this.countdown.start();
    }



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
      '#scene-announcement .calendar-add-container'
    );

    elements.forEach(el => {
      el.classList.add('animate-in');
    });
  }

  initAudio() {
    const toggle = document.querySelector('.audio-toggle');
    if (!toggle) return;

    // Try to load the audio
    this.audio = new Audio('PikuSarodThemeRingtoneMp31640621143.mp3');
    this.audio.loop = true;
    this.audio.volume = 0.3;

    toggle.addEventListener('click', () => {
      this.isMuted = !this.isMuted;
      this.updateAudioIcon(toggle);
      
      toggle.classList.remove('attention');

      if (!this.isMuted && this.audio) {
        this.audio.play().catch(() => { });
      } else if (this.audio) {
        this.audio.pause();
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (this.audio) {
          this.audio.pause();
        }
      } else {
        if (!this.isMuted && this.audio) {
          this.audio.play().catch(() => { });
        }
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

  initTabs() {
    const tabs = document.querySelectorAll('.offer-tab-btn');
    const panes = document.querySelectorAll('.offer-tab-pane');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panes.forEach(p => p.classList.remove('active'));
        
        tab.classList.add('active');
        const target = tab.dataset.target;
        const targetPane = document.getElementById(target);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });
  }

  initCalendarButton() {
    const btn = document.getElementById('calendar-add-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const event = {
        title: "Wonder Hub Grand Opening",
        description: "Join us for the Grand Opening of Wonder Hub! Explore our exclusive collections of sarees, jewelry, and gifts. Flat 10% OFF on first purchase, Free Surprise Gift above 2,499, and Free Gift for the first 25 customers!",
        location: "Near 6 No. Garia Bus Stand (beside Sevangan Nursing Home), Kolkata 700047",
        startDate: "20260723T100000", // 10:00 AM Local
        endDate: "20260723T200000"    // 8:00 PM
      };
      
      const icsMsg = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Wonder Hub//Grand Opening//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `DTSTART;TZID=Asia/Kolkata:${event.startDate}`,
        `DTEND;TZID=Asia/Kolkata:${event.endDate}`,
        `DTSTAMP:${event.startDate}Z`,
        `UID:wonderhub-grand-opening-2026@wonderhub.in`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description}`,
        `LOCATION:${event.location}`,
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");
      
      const blob = new Blob([icsMsg], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'wonder-hub-opening.ics';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  initShareButton() {
    const shareBtn = document.getElementById('native-share-btn');
    if (!shareBtn) return;
    
    // Preload the pdf as a blob so it downloads instantly on click
    let preloadedBlobUrl = null;
    fetch('grand opening online.pdf')
      .then(res => res.blob())
      .then(blob => { preloadedBlobUrl = URL.createObjectURL(blob); })
      .catch(err => console.warn('Share pdf prefetch failed:', err));

    shareBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const link = document.createElement('a');
      link.download = 'WonderHub-Grand-Opening.pdf';
      if (preloadedBlobUrl) {
        link.href = preloadedBlobUrl;
      } else {
        // Fallback if fetch failed or didn't finish
        link.href = 'grand opening online.pdf';
        link.target = '_blank';
      }
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
}

// Boot the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new WonderHubApp();
});
