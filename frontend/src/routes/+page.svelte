<script lang="ts">
  import { onMount } from 'svelte';

  const dropCount = 500;
  const dropIds = Array.from({ length: dropCount }, (_, index) => index);
  let targetAngle = 91;

  function setAngle(angle: number) {
    targetAngle = angle;
  }

  function resetAngle() {
    targetAngle = 91;
  }

  function randomBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  function applyDropStyles(node: HTMLElement, options: { initial?: boolean } = {}) {
    const { initial = false } = options;
    const angle = initial ? 91 : targetAngle;
    const fallDistance =
      typeof window !== 'undefined' ? window.innerHeight + 160 : 960;
    const angleOffset = angle - 90;
    const drift = Math.tan((angleOffset * Math.PI) / 180) * fallDistance;
    const startOffset = -randomBetween(0.15, 0.95) * fallDistance;
    const duration = randomBetween(1.6, 3.1);
    const resetDelay = initial ? randomBetween(0, duration) : randomBetween(0, 0.9);

    node.style.left = `${randomBetween(-10, 110)}vw`;
    node.style.setProperty('--angle', `${angle}deg`);
    node.style.setProperty('--opacity', `${randomBetween(0.25, 0.9)}`);
    node.style.setProperty('--thickness', `${randomBetween(0.12, 0.6)}vmin`);
    node.style.setProperty('--length', `${randomBetween(8, 26)}vmin`);
    node.style.setProperty('--drift', `${drift}px`);
    node.style.setProperty('--fall-distance', `${fallDistance}px`);
    node.style.setProperty('--start-offset', `${startOffset}px`);
    node.style.animationDuration = `${duration}s`;
    node.style.animationDelay = `${-resetDelay}s`;
  }

  function rainDrop(node: HTMLElement) {
    applyDropStyles(node, { initial: true });

    const handle = () => {
      applyDropStyles(node);
    };

    node.addEventListener('animationiteration', handle);

    return {
      destroy() {
        node.removeEventListener('animationiteration', handle);
      }
    };
  }

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
    <div class="left" on:pointerenter={() => setAngle(105)} on:pointerleave={resetAngle}></div>
    <div class="left center" on:pointerenter={() => setAngle(95)} on:pointerleave={resetAngle}></div>
    <div class="right center" on:pointerenter={() => setAngle(85)} on:pointerleave={resetAngle}></div>
    <div class="right" on:pointerenter={() => setAngle(75)} on:pointerleave={resetAngle}></div>
    {#each dropIds as dropId (dropId)}
      <span class="drop" use:rainDrop>
        <span class="streak" />
      </span>
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

  @property --angle {
    syntax: '<angle>';
    inherits: false;
    initial-value: 91deg;
  }

  .rain {
    position: absolute;
    inset: 0;
    width: 120vw;
    left: -10vw;
    z-index: 0;
    cursor: pointer;
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

  .rain:active {
    animation: lightning 0.1s linear 0s 2, lightning 0.15s ease-out 0.25s 1;
  }

  .drop {
    position: absolute;
    top: 0;
    pointer-events: none;
    animation: fall linear infinite;
    will-change: transform;
  }

  .streak {
    display: block;
    border: 0.25vmin solid transparent;
    border-bottom-color: rgba(171, 194, 233, var(--opacity));
    border-left-width: var(--thickness);
    border-bottom-width: var(--length);
    opacity: var(--opacity);
    transform: rotate(var(--angle));
    transform-origin: top left;
  }

  @keyframes fall {
    0% {
      transform: translate3d(0, var(--start-offset, -160px), 0);
    }
    100% {
      transform: translate3d(var(--drift, 0px), var(--fall-distance, 120vh), 0);
    }
  }

  @keyframes lightning {
    50% {
      background: radial-gradient(
          circle at calc(50% - 10vw) -20%,
          rgba(255, 255, 255, 0.24),
          rgba(255, 255, 255, 0) 20%
        ),
        linear-gradient(180deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.18));
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
