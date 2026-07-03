/* ============================================================
   countdown.js — Live Countdown to 23 July 2026
   ============================================================ */

export class Countdown {
  constructor() {
    this.targetDate = new Date('2026-07-23T00:00:00').getTime();
    this.daysEl = document.getElementById('countdown-days');
    this.hoursEl = document.getElementById('countdown-hours');
    this.minutesEl = document.getElementById('countdown-minutes');
    this.secondsEl = document.getElementById('countdown-seconds');
    this.intervalId = null;
  }

  start() {
    this.update();
    this.intervalId = setInterval(() => this.update(), 1000);
  }

  update() {
    const now = Date.now();
    const diff = this.targetDate - now;

    if (diff <= 0) {
      this.daysEl.textContent = '00';
      this.hoursEl.textContent = '00';
      this.minutesEl.textContent = '00';
      this.secondsEl.textContent = '00';
      clearInterval(this.intervalId);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    this.daysEl.textContent = String(days).padStart(2, '0');
    this.hoursEl.textContent = String(hours).padStart(2, '0');
    this.minutesEl.textContent = String(minutes).padStart(2, '0');
    this.secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
