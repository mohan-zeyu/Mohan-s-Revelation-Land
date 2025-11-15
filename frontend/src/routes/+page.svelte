<script lang="ts">
  import { onMount } from 'svelte';

  interface RainDrop {
    id: number;
    left: number;
    delay: number;
    duration: number;
    length: number;
    angle: number;
    opacity: number;
  }

  function createRandom(seed: number) {
    return function () {
      // Mulberry32 PRNG for deterministic output
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const dropCount = 420;
  const random = createRandom(20240427);
  const drops: RainDrop[] = Array.from({ length: dropCount }, (_, index) => ({
    id: index,
    left: random() * 120,
    delay: random() * -8,
    duration: 4 + random() * 7,
    length: 40 + random() * 90,
    angle: 85 + random() * 12,
    opacity: 0.25 + random() * 0.55
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

<section class="hero-shell">
  <div class="rain" aria-hidden="true">
    <div class="left"></div>
    <div class="left center"></div>
    <div class="right center"></div>
    <div class="right"></div>
    {#each drops as drop (drop.id)}
      <div
        class="drop"
        style={`--left:${drop.left}vw; --delay:${drop.delay}s; --duration:${drop.duration}s; --length:${drop.length}px; --angle:${drop.angle}deg; --opacity:${drop.opacity};`}
      />
    {/each}
  </div>

  <div class="hero container">
    <div class="hero-content">
      <p class="eyebrow">Welcome to Revelation Land</p>
      <h1>Thoughtful notes and discoveries from Mohan</h1>
      <p class="tagline">
        A calm space for dynamics, study notes, and daily findings—documented in
        Markdown and shared with intention.
      </p>
      <div class="hero-actions">
        <a class="primary-link" href="/recent">Read recent posts</a>
        <a class="secondary-link" href="/study-notes">Explore study notes</a>
      </div>
    </div>
  </div>
</section>

<div class="container">
  <section class="home-panels">
    <article class="panel">
      <h2>Start here</h2>
      <p>
        Revelation Land is a living archive of Mohan's reflections. Posts are written in Markdown, so
        every article stays clean, structured, and easy to maintain.
      </p>
      <p>
        Curious about the writing cadence? Visit the <a href="/recent">recent posts</a> feed for the
        latest additions.
      </p>
    </article>
    <article class="panel">
      <h2>Browse sections</h2>
      <ul class="links">
        <li><a href="/dynamics">Dynamics</a> — personal updates and evolving thoughts.</li>
        <li><a href="/study-notes">Study Notes</a> — distilled learnings and references.</li>
        <li><a href="/daily-findings">Daily Findings</a> — small discoveries worth keeping.</li>
      </ul>
    </article>
    <article class="panel">
      <h2>Stay connected</h2>
      <p>
        Administrators can log in to curate new posts, set concise abstracts, and publish Markdown
        stories that render beautifully—complete with automatic tables of contents.
      </p>
      <a class="secondary-link subtle" href="/admin">Go to admin dashboard</a>
    </article>
  </section>
</div>

<style>
  :global(body.home-page) {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    background: linear-gradient(180deg, #343a40, #495057 65%, #212529 100%);
    color: var(--surface-color);
  }

  .hero-shell {
    position: relative;
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4rem 0;
    overflow: hidden;
  }

  .rain {
    position: absolute;
    width: 140vw;
    height: 110%;
    left: -20vw;
    top: -5%;
    pointer-events: none;
    z-index: 0;
  }

  .rain .left,
  .rain .left.center,
  .rain .right,
  .rain .right.center {
    position: absolute;
    width: 20vw;
    height: 100%;
    top: 0;
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

  .drop {
    position: absolute;
    top: -120px;
    left: var(--left);
    width: 2px;
    height: var(--length);
    background: linear-gradient(180deg, rgba(233, 236, 239, 0), rgba(233, 236, 239, 0.85));
    opacity: var(--opacity);
    animation: fall var(--duration) linear infinite;
    animation-delay: var(--delay);
    transform-origin: top;
    filter: blur(0.4px);
  }

  @keyframes fall {
    0% {
      transform: rotate(var(--angle)) translateY(0);
    }
    100% {
      transform: rotate(var(--angle)) translateY(120vh);
    }
  }

  .hero {
    position: relative;
    z-index: 1;
  }

  .hero-content {
    max-width: 520px;
    background: rgba(233, 236, 239, 0.82);
    border-radius: 18px;
    border: 1px solid rgba(206, 212, 218, 0.8);
    padding: 3rem;
    box-shadow: 0 25px 45px rgba(0, 0, 0, 0.18);
    color: var(--text-color);
    backdrop-filter: blur(10px);
  }

  .eyebrow {
    margin: 0 0 0.75rem 0;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    font-size: 0.8rem;
    color: var(--muted-text);
  }

  h1 {
    margin-bottom: 1.5rem;
    font-size: 2.6rem;
    color: var(--heading-color);
  }

  .tagline {
    margin-bottom: 2.5rem;
    font-size: 1.05rem;
    color: var(--muted-text);
    line-height: 1.8;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .primary-link,
  .secondary-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.65rem 1.4rem;
    border-radius: 999px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    font-size: 0.85rem;
  }

  .primary-link {
    background: var(--primary-color);
    color: var(--surface-color);
  }

  .primary-link:hover {
    background: var(--secondary-color);
  }

  .secondary-link {
    background: rgba(255, 255, 255, 0.14);
    border: 1px solid rgba(206, 212, 218, 0.8);
    color: var(--heading-color);
  }

  .secondary-link:hover {
    background: rgba(233, 236, 239, 0.8);
    color: var(--text-color);
  }

  .secondary-link.subtle {
    margin-top: 1rem;
    padding-inline: 1.1rem;
  }

  .home-panels {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    margin-top: -3rem;
  }

  .panel {
    background: var(--surface-elevated);
    border-radius: 16px;
    border: 1px solid var(--border-color);
    padding: 2rem;
    box-shadow: var(--shadow);
    color: var(--text-color);
    backdrop-filter: blur(6px);
  }

  .panel h2 {
    margin-top: 0;
    margin-bottom: 1rem;
  }

  .panel p {
    color: var(--muted-text);
    line-height: 1.7;
  }

  .links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 0.75rem;
    color: var(--muted-text);
  }

  .links a {
    color: var(--heading-color);
  }

  @media (max-width: 768px) {
    .hero-shell {
      padding: 3rem 0 4rem;
    }

    .hero-content {
      padding: 2.25rem;
    }

    h1 {
      font-size: 2.2rem;
    }

    .hero-actions {
      flex-direction: column;
      align-items: stretch;
    }

    .home-panels {
      margin-top: -2rem;
    }
  }
</style>
