<script lang="ts">
  import { onMount } from 'svelte';

  interface RainDrop {
    id: number;
    x: number;
    delay: number;
    duration: number;
    thickness: number;
    opacity: number;
    offset: number;
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
    delay: random() * -8,
    duration: 3 + random() * 8,
    thickness: 0.5 + random() * 0.7,
    opacity: 0.25 + random() * 0.55,
    offset: -6 + random() * 12
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
      <div
        class="drop"
        style={`--x:${drop.x}vw; --delay:${drop.delay}s; --duration:${drop.duration}s; --thickness:${drop.thickness}vmin; --opacity:${drop.opacity}; --offset:${drop.offset}deg;`}
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
  @property --angle {
    syntax: "<angle>";
    inherits: false;
    initial-value: 91deg;
  }

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
    min-height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .rain {
    position: absolute;
    width: 120vw;
    height: 100vh;
    left: -10vw;
    top: 0;
    cursor: pointer;
    z-index: 0;
    --angle: 91deg;
  }

  .rain .left,
  .rain .right,
  .rain .left.center,
  .rain .right.center {
    position: absolute;
    width: 20vw;
    height: 100vh;
    top: 0;
    box-sizing: border-box;
    z-index: 2;
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
    --angle: 105deg;
  }

  .rain .left.center:hover ~ .drop {
    --angle: 95deg;
  }

  .rain .right.center:hover ~ .drop {
    --angle: 85deg;
  }

  .rain .right:hover ~ .drop {
    --angle: 75deg;
  }

  .rain:active {
    animation: lightning 0.12s linear 0s 2, lightning 0.18s ease-out 0.25s 1;
  }

  @keyframes lightning {
    50% {
      background: radial-gradient(circle at calc(50% - 10vw) -15%, #ffffff33, transparent 22%),
        linear-gradient(180deg, #ffffffaa, #ffffff33);
    }
  }

  .drop {
    position: absolute;
    top: -5vmin;
    left: var(--x);
    border: 0.25vmin solid transparent;
    border-bottom-color: rgba(171, 194, 233, 0.85);
    border-left-width: var(--thickness);
    opacity: var(--opacity);
    transform: rotate(calc(var(--angle) + var(--offset))) translateY(0);
    animation: fall var(--duration) linear var(--delay) infinite;
    will-change: transform;
    filter: drop-shadow(0 0 0.35vmin rgba(173, 197, 227, 0.3));
  }

  @keyframes fall {
    0% {
      transform: rotate(calc(var(--angle) + var(--offset))) translateY(0);
    }
    100% {
      transform: rotate(calc(var(--angle) + var(--offset))) translateY(calc(100vh + 10vmin));
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
    max-width: 540px;
    background: rgba(233, 236, 239, 0.14);
    border: 1px solid rgba(206, 212, 218, 0.28);
    border-radius: 16px;
    padding: 2.4rem;
    backdrop-filter: blur(16px);
    color: #f8f9fa;
    box-shadow: 0 35px 60px rgba(15, 31, 43, 0.35);
  }

  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.3em;
    font-size: 0.8rem;
    color: rgba(233, 236, 239, 0.7);
    margin-bottom: 0.75rem;
  }

  h1 {
    margin: 0 0 1.5rem;
    font-size: 2.5rem;
    color: #f8f9fa;
    text-shadow: 0 8px 16px rgba(7, 19, 28, 0.6);
  }

  .tagline {
    margin-bottom: 2.25rem;
    color: rgba(233, 236, 239, 0.8);
    line-height: 1.8;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.9rem;
  }

  .primary-link,
  .secondary-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.6rem 1.4rem;
    border-radius: 999px;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.08em;
  }

  .primary-link {
    background: rgba(233, 236, 239, 0.85);
    color: #212529;
  }

  .primary-link:hover {
    background: rgba(233, 236, 239, 0.95);
  }

  .secondary-link {
    background: rgba(233, 236, 239, 0.18);
    border: 1px solid rgba(233, 236, 239, 0.4);
    color: rgba(233, 236, 239, 0.9);
  }

  .secondary-link:hover {
    background: rgba(233, 236, 239, 0.32);
  }

  .intro {
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    align-items: start;
    padding-bottom: 3rem;
  }

  .intro-text p {
    color: var(--muted-text);
    line-height: 1.8;
  }

  .intro-links h2 {
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 1.3rem;
    color: var(--heading-color);
  }

  .intro-links ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 0.9rem;
    color: var(--muted-text);
  }

  .intro-links a {
    color: var(--heading-color);
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .hero {
      min-height: 520px;
    }

    .hero-text {
      padding: 1.8rem;
    }

    .hero-text h1 {
      font-size: 2.1rem;
    }

    .intro {
      grid-template-columns: 1fr;
    }
  }
</style>
