<script lang="ts">
  import { onMount } from 'svelte';

  const dropCount = 200;
  const DEFAULT_ANGLE = 91;
  const MIN_ANGLE = 75;
  const MAX_ANGLE = 105;
  const splashCount = 40;
  let rainEl: HTMLDivElement | null = null;
  let splashEl: HTMLDivElement | null = null;
  let targetAngle = DEFAULT_ANGLE;

  onMount(() => {
    document.body.classList.add('home-page');

    const drops: HTMLElement[] = [];
    const splashes: HTMLElement[] = [];
    const droplets: HTMLElement[] = [];
    const cleanupFns: Array<() => void> = [];
    const styleEl = document.createElement('style');
    document.head.appendChild(styleEl);

    const rainTarget = rainEl;

    if (rainTarget) {
      const setAngle = (angle: number) => {
        rainTarget.style.setProperty('--angle', `${angle}deg`);
      };

      setAngle(DEFAULT_ANGLE);

      let rafId: number | null = null;
      let lastEvent: PointerEvent | null = null;

      const updateAngleFromEvent = () => {
        if (!lastEvent) return;
        const rect = rainTarget.getBoundingClientRect();
        const ratio = Math.min(Math.max((lastEvent.clientX - rect.left) / rect.width, 0), 1);
        const angle = MAX_ANGLE - (MAX_ANGLE - MIN_ANGLE) * ratio;
        targetAngle = Number(angle.toFixed(2));
        setAngle(targetAngle);
        rafId = null;
      };

      const handlePointerMove = (event: PointerEvent) => {
        lastEvent = event;
        if (rafId === null) {
          rafId = requestAnimationFrame(updateAngleFromEvent);
        }
      };

      const handlePointerLeave = () => {
        lastEvent = null;
        targetAngle = DEFAULT_ANGLE;
        setAngle(targetAngle);
      };

      let currentPaused = false;
      let isWindowFocused = document.hasFocus();

      const applyPauseState = () => {
        const paused = document.visibilityState !== 'visible' || !isWindowFocused;
        if (paused === currentPaused) return;
        rainTarget.classList.toggle('rain-paused', paused);
        splashEl?.classList.toggle('rain-paused', paused);
        currentPaused = paused;
      };

      const handlePageHide = () => applyPauseState();
      const handlePageShow = () => applyPauseState();
      const handleFocus = () => {
        isWindowFocused = true;
        applyPauseState();
      };
      const handleBlur = () => {
        isWindowFocused = false;
        applyPauseState();
      };

      rainTarget.addEventListener('pointermove', handlePointerMove);
      rainTarget.addEventListener('pointerleave', handlePointerLeave);
      document.addEventListener('visibilitychange', applyPauseState);
      window.addEventListener('blur', handleBlur);
      window.addEventListener('focus', handleFocus);
      window.addEventListener('pagehide', handlePageHide);
      window.addEventListener('pageshow', handlePageShow);

      applyPauseState();

      cleanupFns.push(() => {
        rainTarget.removeEventListener('pointermove', handlePointerMove);
        rainTarget.removeEventListener('pointerleave', handlePointerLeave);
        document.removeEventListener('visibilitychange', applyPauseState);
        window.removeEventListener('blur', handleBlur);
        window.removeEventListener('focus', handleFocus);
        window.removeEventListener('pagehide', handlePageHide);
        window.removeEventListener('pageshow', handlePageShow);
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
      });
    }

    if (rainTarget) {

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
        rainTarget.appendChild(drop);
        drops.push(drop);

        const handleIter = () => {
          drop.style.setProperty('--angle', `${targetAngle}deg`);
        };

        drop.addEventListener('animationiteration', handleIter);
        cleanupFns.push(() => drop.removeEventListener('animationiteration', handleIter));

      }
    }

    const splashTarget = splashEl;
    if (splashTarget) {
      for (let i = 0; i < splashCount; i += 1) {
        const splash = document.createElement('div');
        splash.className = 'splash';

        const left = Math.floor(Math.random() * 1200) * 0.1;
        const delay = Math.random() * 2;
        const duration = 0.4 + Math.random() * 0.4;
        const scale = 0.8 + Math.random() * 0.6;
        const glow = 0.4 + Math.random() * 0.4;

        splash.style.left = `${left}vw`;
        splash.style.setProperty('--splash-delay', `${delay}s`);
        splash.style.setProperty('--splash-duration', `${duration}s`);
        splash.style.setProperty('--splash-scale', `${scale}`);
        splash.style.setProperty('--splash-glow', `${glow}`);

        splashes.push(splash);
        splashTarget.appendChild(splash);

        if (i % 3 === 0) {
          const dropletCount = 2 + Math.floor(Math.random() * 3);
          for (let j = 0; j < dropletCount; j += 1) {
            const droplet = document.createElement('div');
            droplet.className = 'splash-droplet';

            const dropletLeft = left + (Math.random() - 0.5) * 2;
            const bounceHeight = -(10 + Math.random() * 20);
            const bounceX = (Math.random() - 0.5) * 10;
            const dropletDelay = delay + Math.random() * 0.1;
          const dropletDuration = 0.3 + Math.random() * 0.3;

          droplet.style.left = `${dropletLeft}vw`;
          droplet.style.setProperty('--bounce-height', `${bounceHeight}px`);
          droplet.style.setProperty('--bounce-x', `${bounceX}px`);
          droplet.style.animation = `splash-bounce ${dropletDuration}s ${dropletDelay}s ease-out infinite`;
          droplet.style.opacity = `${0.55 + Math.random() * 0.35}`;

          splashTarget.appendChild(droplet);
            droplets.push(droplet);
          }
        }
      }
    }

    return () => {
      document.body.classList.remove('home-page');
      drops.forEach((drop) => drop.remove());
      splashes.forEach((splash) => splash.remove());
      droplets.forEach((droplet) => droplet.remove());
      cleanupFns.forEach((fn) => fn());
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
  <div class="rain" aria-hidden="true" bind:this={rainEl}></div>
  <div class="splash-container" aria-hidden="true" bind:this={splashEl}></div>

  <div class="hero-inner container">
    <div class="hero-text">
      <p class="eyebrow">Revelation Land</p>
      <h1>Mohan's notebook for quiet breakthroughs</h1>
      <p class="tagline">
        Revelation Land is a lantern-lit cloister where notes, visions, and daily wonders are set like
        verses along the path; walk slowly, breathe in the hush, and let each drop be a sign.
      </p>
      <p class="motto">“All's Fair in Love and Revelation.”</p>
    </div>
  </div>
</section>

<section class="container intro">
  <div class="intro-text">
    <p>
      Revelation Land grows entry by entry—each note a candle, each abstract a verse, every table of contents
      a starred map leading deeper into the cloister.
    </p>
    <p>
      Follow the sigils in the navigation to step through Dynamics, Study Notes, Daily Findings, or the most
      recent testimonies. Administrators tend the shrine at any hour.
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
    padding: 5rem 0 6rem;
  }

  .hero::after {
    content: '';
    position: absolute;
    inset: 0;
    /* background-image: linear-gradient(180deg, rgba(3, 5, 11, 0.2), rgba(3, 5, 11, 0.85)); */
    opacity: 0.9;
    z-index: 0;
    pointer-events: none;
  }

  .rain {
    position: absolute;
    width: 130vw;
    height: 100%;
    left: -15vw;
    cursor: crosshair;
    z-index: 2;
    pointer-events: auto;
    user-select: none;
    touch-action: none;
    opacity: 0.8;
    mix-blend-mode: screen;
    --angle: 91deg;
  }

  :global(.rain.rain-paused .drop),
  :global(.rain.rain-paused .drop::before),
  :global(.rain.rain-paused .drop::after) {
    animation-play-state: paused;
  }

  :global(.splash-container.rain-paused .splash),
  :global(.splash-container.rain-paused .splash::before),
  :global(.splash-container.rain-paused .splash::after),
  :global(.splash-container.rain-paused .splash-droplet) {
    animation-play-state: paused;
  }

  .splash-container {
    position: absolute;
    bottom: 0;
    left: -15vw;
    width: 130vw;
    height: 25vh;
    pointer-events: none;
    z-index: 1;
  }

  :global(.splash) {
    position: absolute;
    bottom: 0;
    width: 0;
    height: 0;
    transform: translateZ(0) scale(var(--splash-scale, 1));
    opacity: calc(0.4 + var(--splash-glow, 0.5) * 0.4);
    mix-blend-mode: screen;
  }

  :global(.splash::before),
  :global(.splash::after) {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 50%;
    background: radial-gradient(circle, rgba(173, 213, 255, 0.35), rgba(173, 213, 255, 0.05));
  }

  :global(.splash::before) {
    width: 100%;
    height: 100%;
    animation: splash-ripple1 var(--splash-duration, 0.6s) ease-out infinite;
    animation-delay: var(--splash-delay, 0s);
  }

  :global(.splash::after) {
    width: 100%;
    height: 100%;
    animation: splash-ripple2 var(--splash-duration, 0.6s) ease-out infinite;
    animation-delay: var(--splash-delay, 0s);
  }

  :global(.splash-droplet) {
    position: absolute;
    bottom: 0;
    width: 0;
    height: 0;
    background: transparent;
    border-radius: 50%;
    box-shadow:
      0 0 4px rgba(173, 213, 255, 0.5),
      0 0 10px rgba(173, 213, 255, 0.25);
  }

  .hero:active .rain {
    cursor: none;
    animation: lightning 0.1s linear 0s 2, lightning 0.15s ease-out 0.25s 1;
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

  @keyframes splash-ripple1 {
    0% {
      width: 4px;
      height: 4px;
      opacity: 0.9;
      transform: translate(-50%, 0) scaleX(1) scaleY(0.8);
    }
    50% {
      width: 20px;
      height: 10px;
      opacity: 0.5;
      transform: translate(-50%, 0) scaleX(1.3) scaleY(0.9);
    }
    100% {
      width: 34px;
      height: 4px;
      opacity: 0;
      transform: translate(-50%, 0) scaleX(1.6) scaleY(0.6);
    }
  }

  @keyframes splash-ripple2 {
    0% {
      width: 4px;
      height: 4px;
      opacity: 0.75;
      transform: translate(-50%, 0) scale(1);
    }
    50% {
      width: 26px;
      height: 12px;
      opacity: 0.4;
      transform: translate(-50%, 0) scaleX(1.4) scaleY(0.8);
    }
    100% {
      width: 40px;
      height: 5px;
      opacity: 0;
      transform: translate(-50%, 0) scaleX(1.7) scaleY(0.5);
    }
  }

  @keyframes splash-bounce {
    0% {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      transform: translateY(var(--bounce-height, -15px)) translateX(var(--bounce-x, 0)) scale(0.4);
      opacity: 0;
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
    align-items: flex-end;
    gap: 4rem;
  }

  .hero-text {
    max-width: 640px;
    color: var(--heading-color);
  }

  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.32em;
    font-size: 0.78rem;
    color: rgba(233, 236, 239, 0.68);
    margin-bottom: 1.2rem;
  }

  h1 {
    margin: 0 0 1.6rem;
    font-size: clamp(2.8rem, 6vw, 3.6rem);
    color: var(--heading-color);
    text-shadow: 0 15px 35px rgba(3, 5, 11, 0.65);
  }

  .tagline {
    margin-bottom: 2.2rem;
    color: rgba(233, 236, 239, 0.85);
    line-height: 1.85;
  }

  .motto {
    margin: 0 0 1.5rem;
    font-size: 0.95rem;
    letter-spacing: 0.34em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.75);
  }


  .intro {
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    align-items: start;
    padding: 4rem 0 5rem;
  }

  .intro-text,
  .intro-links {
    padding: 0;
  }

  .intro-text p {
    color: var(--muted-text);
    line-height: 2;
    font-size: 1.05rem;
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
