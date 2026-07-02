# Wonder Hub — Brand Reveal Website Design Document
### A Cinematic Pre-Launch Experience — "A Journey From Sari to Many More"

---

## 1. Creative Concept

Wonder Hub's own brand art already tells its story: a single gold thread winds across the page, linking milestones from *"A Tradition Begins"* through *"The Hub Is Born."* The reveal website should feel like the visitor is arriving at the end of that same thread — they cut the rope, the curtain opens, and they step through the glowing archway that closes the brand's cover art into the world Wonder Hub has built.

The signature moment is still the cut — a small, tactile, physics-driven interaction that rewards precision — but it now doubles as the *first bead on the timeline*. Cutting the rope is the visitor's own entry point into the journey the brand already illustrates: sari, to passion, to dream, to hub.

**One-line creative thesis:** *"Every thread leads to the Hub — cut one to begin yours."*

---

## 2. Design Tokens

*(Derived directly from the Wonder Hub cover art: deep indigo dissolving into magenta/pink, fine gold line-illustration, circular WH monogram with laurel wreath.)*

### Color Palette
| Token | Hex | Usage |
|---|---|---|
| Twilight Indigo | `#241B4E` | Base background (left/curtain side) |
| Deep Violet | `#4A2D7A` | Mid-gradient transition |
| Hub Magenta | `#B03A8C` | Gradient warm end (right side, archway glow) |
| Antique Gold | `#D9B872` | Primary accent — rope, linework, monogram, CTAs |
| Warm Ivory | `#F6ECD9` | Body text on dark backgrounds |
| Glow Pink | `#F5A9C9` | Archway light, particle highlights, spotlight tint |
| Near Black Indigo | `#150F30` | Vignette, spotlight-off state |

The palette runs as a diagonal gradient (indigo → violet → magenta), not a flat wash — this is core to the brand's existing look and should carry through every scene, not just the hero.

### Typography
| Role | Typeface | Notes |
|---|---|---|
| Display | Cormorant SC | Headlines, small caps, echoes the "WONDER HUB" arc lettering |
| Monogram/Script | Playfair Display Italic or Parisienne | For "Wh" / "Love the Hub" style flourishes, used sparingly |
| Body | Cormorant Garamond / Marcellus | Supporting copy, quiet and legible against the gradient |
| Utility | Jost (wide tracking) | Date, countdown, milestone labels |

### Layout Concept
- Full-bleed single scene on load, no scroll — this is a moment, not a page
- After the reveal, the parted curtains remain framing the edges of the viewport like a proscenium arch, echoing the glowing archway in the brand's own artwork
- The gold "journey thread" motif from the cover art becomes a recurring structural device — used again post-reveal to lead the eye from headline → date → CTA → logo → social, as a single continuous line with small lit nodes at each stop

### Signature Element
Two, working together: the rope-cut interaction (genuine sag, fray, uneven snap), and the gold thread-path that reappears after the reveal to visually stitch the announcement, logo, and social sections into one continuous journey — directly quoting the brand's cover art rather than inventing a new motif.

---

## 3. Experience Flow

### Scene 1 — The Curtain
- Two curtain panels meet at center, full viewport, each rendered as the brand's own diagonal gradient (Twilight Indigo → Deep Violet), with faint gold line-art fabric folds instead of flat velvet shading — a quiet nod to the linework style of the cover art
- A single gold rope hangs vertically at center with a gentle idle sway (4s loop)
- Cursor becomes a custom blade/scissor icon near the rope's hit zone
- Caption beneath: *"Drag to cut the thread"*
- No music yet — silence (or a faint sitar drone) builds anticipation

**Interaction mechanics**
- Rope modeled as a short chain of points (simple verlet-style sag) so it responds to a simulated cut force
- User drags across the rope; once drag distance/velocity crosses a threshold, it severs at that point
- Top half snaps up, bottom half falls with a slight swing, both fading past the frame (300–500ms, ease-in-back)
- A crisp fabric-snap sound plays on cut (not a swoosh — a tactile thread snap)
- Touch fallback: single swipe or tap-and-hold across a generous hit zone

### Scene 2 — The Reveal
- Curtains part outward from center, left panel leading right by ~100ms to avoid a mirrored, robotic feel
- Duration ~1.8–2.2s with a slight overshoot-and-settle
- As the curtains part, the background gradient shifts to reveal its warm end — Hub Magenta with Glow Pink light — pooling behind a faint arch silhouette at center, echoing the glowing doorway in the cover art
- Two to three spotlight cones snap on with a brief flicker, sweeping inward before settling, tinted gold-to-pink rather than plain white
- Fine gold particles drift upward through the beams — kept sparse (20–30 max) for restraint
- Sound: a single warm swell (strings or plucked sitar/veena), 2–3 seconds, then silence. Audio is muted by default with a small toggle — never autoplay forced sound

### Scene 3 — Launch Announcement

Immediately after the spotlights settle, the brand's own gold "journey thread" draws itself in — a thin animated line entering from the left edge, pausing briefly at a lit node beside the headline, exactly as it does in the cover art. This is what carries the "sari to many more" story into the reveal itself.

**Copy:**

> GRAND OPENING SOON
> *(eyebrow, tracked-out gold caps)*

> A Journey From Sari to Many More
> *(headline / hook — direct from the brand's own tagline)*

> One tradition, endlessly reimagined — sarees, jewelry, gifts, and a community of women who love the Hub. Every thread you see brought us here.
> *(supporting line)*

> Opening 23rd July 2026
> *(date, utility typeface, wide tracking)*

**Hook line — confirmed, taken directly from the cover art:**
*"A Journey From Sari to Many More"* (used as the headline above), paired with the cover's closing line *"to create the hub"* as a small script flourish beneath the supporting copy — same pairing as the original artwork, not a new invention.

A slim, understated countdown (days : hours : minutes) sits beneath the date in the utility face, positioned as the next lit node on the gold thread — styled like a jeweller's engraving, not a sale-countdown clock.

### Scene 4 — The Journey (full illustrated scene, confirmed to appear post-reveal)

The full cover illustration — woman in saree, sewing machine, clothing rack, laptop with cart, jewelry, gift box, community of women, glowing archway — is too good a piece of storytelling to reserve for social/cover use only. It becomes its own scrollytelling section between the announcement and the logo reveal, so the visitor physically travels the same path the cover art shows.

- Presented as a **horizontal-feeling scroll strip** (implemented as a scroll-snapped section, vertically scrolled but visually panning left to right) tracing the six milestones exactly as illustrated: *A Tradition Begins → A Passion Ignites → A Dream Takes Shape → Creations Expand → Community Grows → The Hub Is Born*
- Each milestone is its own beat: the fine gold linework illustration for that stage fades in (woman draping a saree at the start, sewing machine mid-way, rack/laptop/jewelry as the offering expands, the community-of-women illustration near the end), with its label lighting up on the gold thread as the visitor scrolls past
- The thread itself is the scroll progress indicator — no separate progress bar needed, since the brand already drew one
- Ends at the illustrated **archway**, glowing in Hub Magenta / Glow Pink, which visually hands off into Scene 5's logo reveal (the archway is where the visitor "arrives" at the Hub)
- Kept restrained: thin gold outline illustrations on the gradient background, no added color fills, consistent with the cover art's linework style — this section should read as one continuous piece of art the visitor scrolls through, not a series of separate graphics

### Scene 5 — Identity Reveal
- Trigger: **"Reveal Our Identity"** button, styled as a wax-seal / embroidered-border pill in Antique Gold, sitting just past the archway at the end of Scene 4
- On click: the archway illustration recedes, spotlights converge to center, the gold thread coils inward toward the center point
- Logo sequence (matching the existing Wonder Hub mark — circular badge, "WONDER HUB" arced along the top, script "Wh" monogram at center, laurel wreath beneath, "LOVE THE HUB" arced along the bottom):
  1. The circular border and arc lettering trace themselves in gold stroke first, as if being embroidered live (SVG stroke-dasharray animation)
  2. The "Wh" script monogram draws in next, slightly delayed, with a single-pass golden shimmer sweep across the fill
  3. The laurel wreath fills in last, low to high, anchoring the mark
  4. Particles briefly intensify around the full badge, then settle
- This is the second and final "big" animation moment — everything after stays calm by comparison

### Scene 6 — Social Connection
- *"Love the Hub. Follow the journey before it begins."*
- Instagram button: gold outline pill, fills gold on hover with the icon inverting to deep indigo (not maroon, to stay consistent with the new palette). **Handle is currently unset/TBD** — button should be wired to a placeholder link (or hidden entirely) until the handle is confirmed, rather than shipped with a dead or guessed link
- Optional secondary CTA: *"Be the first through the door."* — single email input, minimal submit, styled as the final lit node on the gold thread
- Footer: Wonder Hub wordmark only, no clutter, no social-proof badges — this stays a teaser, not a storefront

---

## 4. Technical Implementation

**Stack**
- Static HTML/CSS/vanilla JS, or React if componentizing scenes (Curtain, Spotlight, Announcement, LogoReveal, Footer)
- GSAP for choreographed timelines (curtain parting, spotlight flicker, particle drift, logo trace); its Draggable plugin can also drive the rope-cut gesture
- Rope physics: a lightweight verlet-integration snippet (a few dozen lines) — no need for a full physics engine
- SVG for the rope, curtain fold highlights, and logo trace (crisp at any resolution, animatable via stroke properties)
- Particles via canvas or absolutely-positioned divs, kept low-count for performance

**Performance & accessibility**
- Respect `prefers-reduced-motion`: swap choreographed transitions for instant/fade equivalents rather than removing content
- Provide a visible "Skip intro" text link and remember the choice for returning visitors (session flag) so the cut isn't mandatory every visit
- Preload fonts and the logo SVG before Scene 1 renders to avoid mid-animation pop-in
- Mobile: simplify the cut to one swipe across a generous hit zone; reduce spotlight beam count and particle density
- Audio: muted by default, explicit unmute toggle only

**Suggested component structure**
```
CurtainScene        — rope, cut interaction, curtain panels
SpotlightReveal      — light cones + particles, triggered on cut completion
Announcement         — eyebrow, headline, hook, date, countdown, CTA
JourneyScroll        — full illustrated cover scene, six-milestone scrollytelling strip
LogoReveal           — triggered on CTA click, trace + shimmer
SocialFooter         — Instagram CTA, email capture, brand mark
```

---

## 5. Open Decisions

- [x] Brand name confirmed: **Wonder Hub** (tagline: "Love the Hub")
- [x] Logo confirmed: circular WH monogram badge with laurel wreath and arc lettering (from cover art) — needs a clean vector/SVG export for the trace animation to work at full quality
- [x] Hook line confirmed: **"A Journey From Sari to Many More"** / "to create the hub" — taken directly from the cover art, no A/B testing needed
- [x] Official opening date confirmed: **23rd July 2026**
- [x] Full illustrated cover scene confirmed to appear post-reveal, as its own scrollytelling Journey section (Scene 4) rather than staying reserved for cover/social use
- [ ] Instagram handle — currently unset. Reveal button/link should ship as a placeholder (or stay hidden) until this is confirmed
- [ ] Decide on background audio: instrumental swell only, or a short branded audio sting
