<script lang="ts">
  import { onMount } from 'svelte';

  interface RainDrop {
    id: number;
    x: number;
    delay: number;
    duration: number;
    length: number;
    opacity: number;
    drift: number;
    width: number;
  }

  function createRandom(seed: number) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const dropCount = 500;
  const random = createRandom(20240502);
  const drops: RainDrop[] = Array.from({ length: dropCount }, (_, index) => ({
    id: index,
    x: random() * 120,
    delay: random() * -12,
    duration: 1.5 + random() * 2.5,
    length: 12 + random() * 22,
    opacity: 0.35 + random() * 0.45,
    drift: -3 + random() * 6,
    width: 1 + random() * 1.4
  }));

  onMount(() => {
    document.body.classList.add('home-page');
    return () => {
      document.body.classList.remove('home-page');
    };
  });
</script>

<svelte:head>
  <title>Revelation Land · Home</title>
  <meta
    name="description"
    content="Revelation Land is Mohan's quiet corner for reflections, study notes, and daily findings."
  />
</svelte:head>

<section class="hero">
  <div class="rain" aria-hidden="true">
    <div class="left"></div>
    <div class="left center"></div>
    <div class="right center"></div>
    <div class="right"></div>
    {#each drops as drop (drop.id)}
      <span
        class="drop"
        style={`--x:${drop.x}vw; --delay:${drop.delay}s; --duration:${drop.duration}s; --length:${drop.length}vh; --opacity:${drop.opacity}; --drift:${drop.drift}vw; --width:${drop.width}px;`}
      />
    {/each}
  </div>

  <div class="hero-inner container">
    <div class="hero-text">
      <p class="eyebrow">Revelation Land</p>
      <h1>Mohan's notebook for quiet breakthroughs</h1>
      <p class="tagline">
        Dynamics, study notes, and daily findings recorded in Markdown. Slow down, read with intention,
        and follow the rain.
      </p>
      <div class="hero-actions">
        <a class="primary-link" href="/recent">Recent posts</a>
        <a class="secondary-link" href="/dynamics">Browse dynamics</a>
      </div>
    </div>
  </div>
</section>

<section class="container intro">
  <div class="intro-text">
    <p>
      Revelation Land grows entry by entry. Every post includes a clear abstract, detailed body written in
      Markdown, and an automatically generated table of contents for fast orientation.
    </p>
    <p>
      Use the navigation above to jump directly to Dynamics, Study Notes, Daily Findings, or the latest
      posts. Administrators can sign in to publish new insights at any time.
    </p>
  </div>

  <div class="intro-links" aria-label="Sections">
    <h2>Where to next</h2>
    <ul>
      <li><a href="/study-notes">Study Notes</a> · condensed references from Mohan's research.</li>
      <li><a href="/daily-findings">Daily Findings</a> · fleeting discoveries worth keeping.</li>
      <li><a href="/admin">Admin Dashboard</a> · manage posts, abstracts, and categories.</li>
    </ul>
  </div>
</section>

<style>
  :global(body.home-page) {
    background: linear-gradient(180deg, #07131c, #305472 60%, #0f1f2b 100%);
    color: var(--surface-color);
    overflow-x: hidden;
  }

  :global(body.home-page)::before,
  :global(body.home-page)::after {
    content: "";
    display: none;
  }

  .hero {
    position: relative;
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 4rem 0;
  }

  .rain {
    position: absolute;
    inset: 0;
    width: 120vw;
    left: -10vw;
    z-index: 0;
    --speed: 1;
  }

  .rain .left,
  .rain .right,
  .rain .left.center,
  .rain .right.center {
    position: absolute;
    width: 20vw;
    height: 100%;
    top: 0;
    pointer-events: auto;
    cursor: pointer;
  }

  .rain .left {
    left: 10vw;
  }

  .rain .left.center {
    left: 30vw;
  }

  .rain .right.center {
    right: 30vw;
  }

  .rain .right {
    right: 10vw;
  }

  .rain .left:hover ~ .drop {
    --wind: -3vw;
  }

  .rain .left.center:hover ~ .drop {
    --wind: -1.5vw;
  }

  .rain .right.center:hover ~ .drop {
    --wind: 1.5vw;
  }

  .rain .right:hover ~ .drop {
    --wind: 3vw;
  }

  .rain:active {
    --speed: 1.6;
  }

  .drop {
    position: absolute;
    top: -15vh;
    left: var(--x);
    width: var(--width);
    height: var(--length);
    background: linear-gradient(180deg, rgba(222, 226, 230, 0), rgba(173, 197, 227, 0.55) 55%, rgba(173, 197, 227, 0.9));
    opacity: var(--opacity);
    animation: fall calc(var(--duration) / var(--speed)) linear var(--delay) infinite;
    will-change: transform;
    border-radius: 999px;
    filter: drop-shadow(0 14px 18px rgba(15, 31, 43, 0.35));
    pointer-events: none;
    --wind: 0vw;
  }

  @keyframes fall {
    from {
      transform: translate3d(0, -15vh, 0);
    }
    to {
      transform: translate3d(calc(var(--drift) + var(--wind)), 110vh, 0);
    }
  }

  .hero-inner {
    position: relative;
    z-index: 1;
    width: 100%;
    display: flex;
    justify-content: flex-start;
  }

  .hero-text {
    max-width: 520px;
    color: #f8f9fa;
  }

  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.32em;
    font-size: 0.78rem;
    color: rgba(233, 236, 239, 0.68);
    margin-bottom: 0.9rem;
  }

  h1 {
    margin: 0 0 1.6rem;
    font-size: 2.6rem;
    color: #f8f9fa;
    text-shadow: 0 10px 18px rgba(7, 19, 28, 0.5);
  }

  .tagline {
    margin-bottom: 2.2rem;
    color: rgba(233, 236, 239, 0.85);
    line-height: 1.85;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.85rem;
  }

  .primary-link,
  .secondary-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.55rem 1.3rem;
    border-radius: 999px;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.82rem;
    letter-spacing: 0.08em;
  }

  .primary-link {
    background: rgba(233, 236, 239, 0.92);
    color: #212529;
  }

  .primary-link:hover {
    background: rgba(233, 236, 239, 1);
  }

  .secondary-link {
    background: rgba(233, 236, 239, 0.18);
    border: 1px solid rgba(233, 236, 239, 0.45);
    color: rgba(233, 236, 239, 0.92);
  }

  .secondary-link:hover {
    background: rgba(233, 236, 239, 0.3);
  }

  .intro {
    display: grid;
    gap: 2.4rem;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    align-items: start;
    padding: 3.5rem 0 4rem;
  }

  .intro-text p {
    color: var(--muted-text);
    line-height: 1.85;
  }

  .intro-links h2 {
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 1.25rem;
    color: var(--heading-color);
  }

  .intro-links ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 0.85rem;
    color: var(--muted-text);
  }

  .intro-links a {
    color: var(--heading-color);
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .hero {
      min-height: 540px;
      padding: 3rem 0;
    }

    h1 {
      font-size: 2.2rem;
    }

    .intro {
      grid-template-columns: 1fr;
      padding: 2.5rem 0 3rem;
    }
  }
</style>
