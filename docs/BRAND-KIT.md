# bmkrs brand kit v1

the single source of truth. everything a designer, developer or writer needs to make something that is unmistakably bmkrs. supersedes nothing; consolidates everything (website spec, logo system, surfaces, voice rules) into one reference.

---

## 1. the brand in three lines

- positioning: **a brand company run by builders.**
- thesis: **the better-told brand wins. we make sure it's yours.**
- proof line: **we build brands the way we build products: shipped, measured, never abandoned.**

core verb is **build**. "bold" is retired sitewide as a load-bearing adjective.

## 2. logo

wordmark: **bmkrs** in archivo medium (500), lowercase, -0.02em tracking, with the orange full stop tight against the s (gap ≈ half the dot's width, baseline-aligned, dot ≈ 0.13em of type size). the dot is always present, always last, and is the only orange element in colour versions.

files (in /logo, outline before production):

- bmkrs-primary-dark.svg — default; anything on ink or dark imagery
- bmkrs-primary-light.svg — documents, light surfaces, print
- bmkrs-mono-white.svg / bmkrs-mono-black.svg — single-colour constraints, busy photography
- bmkrs-inverse-orange.svg — moments only (covers, end slides, merch); never the default
- bmkrs-icon-dark.svg / bmkrs-icon-light.svg — the "b." mark; favicon, avatars, below 96px
- bmkrs-avatar-512.svg — social profiles and og fallback

clearspace: height of the lowercase b on all sides. minimum: 96px / 24mm for the wordmark, icon below that. never: recolour the dot per context, add effects, widen the gap, or set the wordmark in cabinet grotesk.

## 3. colour: the three surfaces

colour is structural, not decorative. every layout is a sequence of surfaces, each with a meaning:

| surface | hex | meaning | headings | body | meta | rule |
|---|---|---|---|---|---|---|
| ink | #181613 | identity, arrival, imagery | #F1EFE8 | #D3D1C7 | #B4B2A9 | rgba(241,239,232,0.16) |
| paper | #F1EFE8 | reading (anything over two paragraphs) | #181613 | #444441 | #5F5E5A | rgba(24,22,19,0.15) |
| orange | #FF4D00 | act (max one block per page) | #181613 | #2C1005 | #4A1B0C | rgba(24,22,19,0.25) |

orange's jobs on ink/paper: kickers, testimonial rule, link hover, form focus, plus one solid-orange button per page. nothing else. rhythm rules: never two paper blocks adjacent; orange always cushioned by ink; open and close on ink.

## 4. typography

- **display + body: cabinet grotesk** (fontshare, self-hosted variable), weights 400 and 500 only.
- **accent: fragment mono** (google fonts), 400 only.
- **logo only: archivo** 500, outlined paths, never loaded as a webfont.

scale (css custom properties):

```
--text-hero:    clamp(3rem, 8vw, 8.75rem);  lh 0.98;  ls -0.02em
--text-h2:      clamp(2.25rem, 4.5vw, 4rem); lh 1.05;  ls -0.02em
--text-h3:      clamp(1.5rem, 2.5vw, 2rem)
--text-body-lg: clamp(1.125rem, 1.4vw, 1.375rem)
--text-body:    1.125rem  (18px floor desktop, 16px mobile)
--text-meta:    0.8125rem (mono only)
```

body measure: 65ch max. hierarchy comes from scale and space, never weight variety.

mono goes on, exhaustively: kickers (0.08em tracking), tickers, stats, all metadata (dates, categories, tags, captions), section numbers, footer legal, email addresses. never in headings, body, buttons or navigation.

## 5. space and structure

```
--space-section: clamp(5rem, 10vw, 10rem)   between sections (earned by content mass)
--space-block:   clamp(2.5rem, 5vw, 5rem)   heading -> content
--space-tight:   1.25rem                     kicker -> heading -> lead (cluster tight)
```

12-column grid, 1440px max, 24px gutter. heroes left-aligned spanning columns 1 to 9; asymmetry over centred stacking. 1px rules structure space: above section kickers, top-border on grid cells. content clusters tight; generosity lives between sections.

## 6. imagery

- project photography pops on ink; full-bleed (21:9 bands, 4:3 in-flow), capped ~60vh, never two bands adjacent.
- **no image runs naked**: every image carries a mono caption, bottom-left: `name · discipline · one human line`.
- people: illustrated portraits in one consistent style, always of real people; never photoreal ai faces. interim: the initials tile (letter + orange dot, the logo's construction).

## 7. voice

- all lowercase, uk english, no em or en dashes anywhere.
- three registers, used in order, never mixed in one block: **symptom** (the customer's own words, second person: "you look fine and sound like everyone"), **craft** (we + the named human + the method: "angle first, always"), **outcome** (what changes, with a number wherever one exists: "acquisition gets cheaper as the brand compounds").
- claims follow the credibility hierarchy: real number > inspectable claim > process claim > experience claim > qualitative-but-observable. internal-feelings claims ("improved alignment") are below the floor. no fabricated quotes, ever.
- banned words: leverage, solutions, passionate, innovative, seamless, world-class, best-in-class, cutting-edge, bold (as a crutch). numbers evict adjectives; they never sit beside them.
- the test for any line: would a real person say it, and would another real person repeat it?

## 8. components (built, in surfaces.tsx)

Section · Kicker · H1/H2 · Body · Rule · Ticker · PullQuote · StatRow · FullBleed · PageBridge · MetaRail · CookieBanner. all colours derive from the SURFACE map; nothing hardcodes text colour.

## 9. applications

- **social avatar**: bmkrs-avatar-512. og images: brand default for static pages, per-article/project art elsewhere; never the logo tile for content pages.
- **email signature**: name in sans, role + contact in mono, primary-dark wordmark at small scale, no banners.
- **decks**: ink slides default, paper for dense reading slides, one orange slide per deck (the ask). same type scale logic at slide proportions.
- **documents/proposals**: primary-light wordmark, paper-equivalent (white) pages, mono for metadata and footers, terms of business attached.

## 10. governance

- one accent, three surfaces, two typefaces (+ archivo locked inside the logo). additions require removing something.
- quarterly: refresh quick-fire facts and "now building"; audit captions and stale claims; re-run the 1.5-viewport rhythm check.
- the kit changes by edit to this document, not by exception in the work.
