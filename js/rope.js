/* ============================================================
   rope.js — Verlet Rope Physics + Cut Interaction
   ============================================================ */

export class Rope {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.points = [];
    this.segments = 14;
    this.segmentLength = 0;
    this.gravity = 0.35;
    this.damping = 0.98;
    this.constraintIterations = 5;
    this.cut = false;
    this.cutIndex = -1;
    this.cutTime = 0;

    // Interaction
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.dragCurrent = { x: 0, y: 0 };
    this.dragTrail = [];

    // Sway animation
    this.swayPhase = 0;
    this.swayAmplitude = 3;

    // Post-cut animation
    this.topHalf = [];
    this.bottomHalf = [];
    this.postCutTime = 0;

    this.resizeCanvas();
    this.initPoints();
    this.bindEvents();
    this.animate();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initPoints() {
    const cx = this.canvas.width / 2;
    const startY = this.canvas.height * 0.15;
    const endY = this.canvas.height * 0.75;
    this.segmentLength = (endY - startY) / this.segments;

    this.points = [];
    for (let i = 0; i <= this.segments; i++) {
      this.points.push({
        x: cx,
        y: startY + i * this.segmentLength,
        oldX: cx,
        oldY: startY + i * this.segmentLength,
        pinned: i === 0 // Pin the top point
      });
    }
  }

  bindEvents() {
    const hitZoneWidth = 80;

    // Mouse events
    this.canvas.addEventListener('mousedown', (e) => this.onPointerDown(e.clientX, e.clientY));
    this.canvas.addEventListener('mousemove', (e) => this.onPointerMove(e.clientX, e.clientY, hitZoneWidth));
    this.canvas.addEventListener('mouseup', () => this.onPointerUp());

    // Touch events
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const t = e.touches[0];
      this.onPointerDown(t.clientX, t.clientY);
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const t = e.touches[0];
      this.onPointerMove(t.clientX, t.clientY, hitZoneWidth * 1.5);
    }, { passive: false });

    this.canvas.addEventListener('touchend', () => this.onPointerUp());

    window.addEventListener('resize', () => {
      this.resizeCanvas();
      if (!this.cut) this.initPoints();
    });
  }

  onPointerDown(x, y) {
    if (this.cut) return;
    this.isDragging = true;
    this.dragStart = { x, y };
    this.dragCurrent = { x, y };
    this.dragTrail = [{ x, y }];
  }

  onPointerMove(x, y, hitZoneWidth) {
    if (this.cut) return;

    // Update cursor style based on proximity
    const cx = this.canvas.width / 2;
    const ropeTop = this.canvas.height * 0.15;
    const ropeBottom = this.canvas.height * 0.75;
    const nearRope = Math.abs(x - cx) < hitZoneWidth && y > ropeTop && y < ropeBottom;
    this.canvas.classList.toggle('cuttable', nearRope);

    if (!this.isDragging) return;

    this.dragCurrent = { x, y };
    this.dragTrail.push({ x, y });

    // Check for cut: has the drag path crossed the rope?
    if (this.dragTrail.length >= 2) {
      const prev = this.dragTrail[this.dragTrail.length - 2];
      const curr = this.dragTrail[this.dragTrail.length - 1];

      // Check if drag crosses the rope line
      for (let i = 1; i < this.points.length; i++) {
        const p1 = this.points[i - 1];
        const p2 = this.points[i];

        if (this.lineSegmentsIntersect(prev.x, prev.y, curr.x, curr.y, p1.x, p1.y, p2.x, p2.y)) {
          // Calculate drag velocity
          const dx = curr.x - prev.x;
          const dy = curr.y - prev.y;
          const velocity = Math.sqrt(dx * dx + dy * dy);

          if (velocity > 5) { // Minimum velocity threshold
            this.performCut(i);
            return;
          }
        }
      }
    }
  }

  onPointerUp() {
    this.isDragging = false;
    this.dragTrail = [];
  }

  lineSegmentsIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (Math.abs(denom) < 0.001) return false;

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

    return t >= 0 && t <= 1 && u >= 0 && u <= 1;
  }

  performCut(index) {
    if (this.cut) return;
    this.cut = true;
    this.cutIndex = index;
    this.cutTime = performance.now();

    // Split into top and bottom halves
    this.topHalf = this.points.slice(0, index).map(p => ({ ...p }));
    this.bottomHalf = this.points.slice(index).map(p => ({ ...p, pinned: false }));

    // Apply impulse to the halves
    this.topHalf.forEach(p => {
      p.oldY = p.y + 2; // Snap upward
      p.oldX = p.x + (Math.random() - 0.5) * 3;
    });
    this.bottomHalf.forEach(p => {
      p.oldY = p.y - 3; // Fall down
      p.oldX = p.x + (Math.random() - 0.5) * 4;
    });

    // Dispatch custom event
    this.canvas.dispatchEvent(new CustomEvent('rope-cut', {
      bubbles: true,
      detail: { cutY: this.points[index].y }
    }));
  }

  updatePhysics() {
    if (this.cut) {
      this.postCutTime = (performance.now() - this.cutTime) / 1000;

      // Update bottom half (falling)
      this.bottomHalf.forEach(p => {
        if (p.pinned) return;
        const vx = (p.x - p.oldX) * this.damping;
        const vy = (p.y - p.oldY) * this.damping;
        p.oldX = p.x;
        p.oldY = p.y;
        p.x += vx;
        p.y += vy + this.gravity * 2; // Extra gravity for dramatic fall
      });

      // Update top half (snap up)
      this.topHalf.forEach((p, i) => {
        if (p.pinned) return;
        const vx = (p.x - p.oldX) * 0.85;
        const vy = (p.y - p.oldY) * 0.85;
        p.oldX = p.x;
        p.oldY = p.y;
        p.x += vx;
        p.y += vy - 1.5; // Snap upward
      });

      return;
    }

    // Normal rope physics
    this.swayPhase += 0.015;

    this.points.forEach((p, i) => {
      if (p.pinned) return;

      const vx = (p.x - p.oldX) * this.damping;
      const vy = (p.y - p.oldY) * this.damping;

      p.oldX = p.x;
      p.oldY = p.y;

      // Add sway
      const swayForce = Math.sin(this.swayPhase + i * 0.3) * this.swayAmplitude * (i / this.segments) * 0.05;
      p.x += vx + swayForce;
      p.y += vy + this.gravity;
    });

    // Constraint solving
    for (let iter = 0; iter < this.constraintIterations; iter++) {
      for (let i = 0; i < this.points.length - 1; i++) {
        const p1 = this.points[i];
        const p2 = this.points[i + 1];

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const diff = (this.segmentLength - dist) / dist * 0.5;

        const offsetX = dx * diff;
        const offsetY = dy * diff;

        if (!p1.pinned) {
          p1.x -= offsetX;
          p1.y -= offsetY;
        }
        if (!p2.pinned) {
          p2.x += offsetX;
          p2.y += offsetY;
        }
      }
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const goldColor = '#D9B872';
    const goldGlow = 'rgba(217, 184, 114, 0.4)';

    if (this.cut) {
      const alpha = Math.max(0, 1 - this.postCutTime * 2);
      if (alpha <= 0) return;

      this.ctx.globalAlpha = alpha;

      // Draw top half
      if (this.topHalf.length > 1) {
        this.drawRopeSegment(this.topHalf, goldColor, goldGlow);
      }

      // Draw bottom half
      if (this.bottomHalf.length > 1) {
        this.drawRopeSegment(this.bottomHalf, goldColor, goldGlow);
      }

      this.ctx.globalAlpha = 1;
    } else {
      this.drawRopeSegment(this.points, goldColor, goldGlow);

      // Draw drag trail hint
      if (this.isDragging && this.dragTrail.length > 1) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'rgba(217, 184, 114, 0.3)';
        this.ctx.lineWidth = 1;
        const trail = this.dragTrail.slice(-10);
        this.ctx.moveTo(trail[0].x, trail[0].y);
        trail.forEach(p => this.ctx.lineTo(p.x, p.y));
        this.ctx.stroke();
      }
    }
  }

  drawRopeSegment(points, color, glow) {
    if (points.length < 2) return;

    // Glow layer
    this.ctx.beginPath();
    this.ctx.strokeStyle = glow;
    this.ctx.lineWidth = 8;
    this.ctx.lineCap = 'round';
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const xc = (points[i].x + points[i - 1].x) / 2;
      const yc = (points[i].y + points[i - 1].y) / 2;
      this.ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
    }
    this.ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    this.ctx.stroke();

    // Main rope
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const xc = (points[i].x + points[i - 1].x) / 2;
      const yc = (points[i].y + points[i - 1].y) / 2;
      this.ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
    }
    this.ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    this.ctx.stroke();

    // Small knot at top
    if (points[0].pinned) {
      this.ctx.beginPath();
      this.ctx.fillStyle = color;
      this.ctx.arc(points[0].x, points[0].y, 5, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Tassel at bottom of full rope (not after cut)
    if (!this.cut && points === this.points) {
      const last = points[points.length - 1];
      for (let i = 0; i < 5; i++) {
        const angle = (i - 2) * 0.15;
        const tx = last.x + Math.sin(angle + this.swayPhase * 0.5) * 8;
        const ty = last.y + 15 + i * 3;
        this.ctx.beginPath();
        this.ctx.strokeStyle = `rgba(217, 184, 114, ${0.7 - i * 0.1})`;
        this.ctx.lineWidth = 1.5;
        this.ctx.moveTo(last.x, last.y);
        this.ctx.lineTo(tx, ty);
        this.ctx.stroke();
      }
    }
  }

  animate() {
    this.updatePhysics();
    this.render();

    if (!this.cut || this.postCutTime < 1) {
      requestAnimationFrame(() => this.animate());
    }
  }

  destroy() {
    this.cut = true;
    this.postCutTime = 10; // Force stop
  }
}
