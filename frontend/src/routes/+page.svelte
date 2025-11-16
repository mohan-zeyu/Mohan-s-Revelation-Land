<script lang="ts">
  import { onMount } from 'svelte';

  const dropCount = 500;
  let rainEl: HTMLDivElement | null = null;

  onMount(() => {
    document.body.classList.add('home-page');

    const drops: HTMLElement[] = [];
    const styleEl = document.createElement('style');
    document.head.appendChild(styleEl);

    if (rainEl) {
      for (let i = 0; i < dropCount; i += 1) {
        const drop = document.createElement('div');
        drop.className = 'drop';

        const opacity = (Math.floor(Math.random() * 90) + 1) * 0.01;
        const left = Math.floor(Math.random() * 1200) * 0.1;
        const borderWidth = Math.floor(Math.random() * 80) * 0.1;
        const duration = (Math.floor(Math.random() * 15) + 1) * 0.15;
        const delay = (Math.floor(Math.random() * 25) + 1) * -0.5;
        const rotatePoint = Math.floor(Math.random() * 50) / 500;

        drop.style.opacity = `${opacity}`;
        drop.style.left = `${left}vw`;
        drop.style.borderLeftWidth = `${borderWidth}vmin`;
        drop.style.animation = `fall-${i} ${duration}s ${delay}s ease-in infinite`;

        const keyframes = `@keyframes fall-${i} {
          ${(rotatePoint * 100).toFixed(2)}% {
            transform: rotate(var(--angle)) translateX(0);
          }
          100% {
            transform: rotate(var(--angle)) translateX(calc(100vh + 5vmin));
          }
        }`;

        styleEl.append(keyframes);
        rainEl.appendChild(drop);
        drops.push(drop);
      }
    }

    return () => {
      document.body.classList.remove('home-page');
      drops.forEach((drop) => drop.remove());
      styleEl.remove();
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
  <div class="rain" aria-hidden="true" bind:this={rainEl}>
    <div class="left"></div>
    <div class="left center"></div>
    <div class="right center"></div>
    <div class="right"></div>
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
    syntax: '<angle>';
    inherits: false;
    initial-value: 91deg;
  }

  :global(body.home-page) {
    background: linear-gradient(180deg, #07131c, #305472);
    color: var(--surface-color);
    overflow-x: hidden;
  }

  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 4rem 0;
  }

  .hero::before,
  .hero::after {
    content: 'CLICK & HOLD TO CREATE LIGHTNING';
    font-family: Arial, Helvetica, serif;
    font-size: 12px;
    position: absolute;
    width: 100%;
    text-align: center;
    bottom: 18px;
    color: rgba(255, 255, 255, 0.27);
    z-index: 0;
  }

  .hero::before {
    content: 'HOVER SCREEN TO CHANGE WIND SPEED';
    top: 18px;
    bottom: auto;
  }

  .hero:active::before,
  .hero:active::after {
    color: rgba(255, 255, 255, 0);
    transition: all 0.5s ease 0s;
  }

  .rain {
    position: absolute;
    width: 120vw;
    height: 100%;
    left: -10vw;
    cursor: pointer;
    z-index: 0;
  }

  .left,
  .right {
    width: 20vw;
    height: 100%;
    left: 10vw;
    position: absolute;
    box-sizing: border-box;
    z-index: 2;
  }

  .right {
    left: initial;
    right: 10vw;
  }

  .right::after {
    content: '▲ \A ▼';
    position: fixed;
    text-indent: 1px;
    left: calc(50% - 30px);
    top: 45px;
    color: rgba(255, 255, 255, 0.53);
    font-size: 20px;
    border: 2px dashed rgba(255, 255, 255, 0.2);
    border-radius: 100%;
    width: 60px;
    height: 60px;
    box-sizing: border-box;
    padding: 13px 18px;
    text-align: center;
    line-height: 15px;
    transition: all 0.5s ease 0s;
    white-space: pre-wrap;
  }

  .right.center {
    right: 30vw;
  }

  .right.center::after {
    display: none;
  }

  .left.center {
    left: 30vw;
  }

  .rain::after {
    content: '↯';
    position: fixed;
    left: calc(50% - 30px);
    bottom: 45px;
    color: rgba(255, 255, 255, 0.53);
    font-size: 35px;
    border: 2px dashed rgba(255, 255, 255, 0.2);
    border-radius: 100%;
    width: 60px;
    height: 60px;
    box-sizing: border-box;
    padding: 13px 18px;
    text-align: center;
    line-height: 30px;
    transition: all 0.5s ease 0s;
    white-space: pre-wrap;
  }

  .left:hover ~ :global(.drop) {
    --angle: 105deg;
  }

  .left:hover ~ .right::after {
    transform: rotate(22deg);
    transition: all 0.5s ease 0s;
  }

  .right:hover::after {
    transform: rotate(-22deg);
    transition: all 0.5s ease 0s;
  }

  .right:hover ~ :global(.drop) {
    --angle: 75deg;
  }

  .right.center:hover ~ :global(.drop) {
    --angle: 85deg;
  }

  .right.center:hover ~ .right::after {
    transform: rotate(-12deg);
    transition: all 0.5s ease 0s;
  }

  .left.center:hover ~ :global(.drop) {
    --angle: 95deg;
  }

  .left.center:hover ~ .right::after {
    transform: rotate(12deg);
    transition: all 0.5s ease 0s;
  }

  .hero:active .rain {
    cursor: none;
    animation: lightning 0.1s linear 0s 2, lightning 0.15s ease-out 0.25s 1;
  }

  .hero:active .rain::after,
  .hero:active .right::after {
    opacity: 0;
    transition: all 0.5s ease 0s;
  }

  @keyframes lightning {
    50% {
      background: radial-gradient(
          circle at calc(50% - 10vw) -20%,
          rgba(255, 255, 255, 0.27),
          rgba(255, 255, 255, 0) 20%
        ),
        linear-gradient(180deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.2));
    }
  }

  :global(.drop) {
    border: 0.25vmin solid transparent;
    border-bottom-color: #abc2e9;
    position: absolute;
    top: -5vmin;
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
