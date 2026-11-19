"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import elephant from "@/assets/brand/logo-elephant.png";
import tagline from "@/assets/brand/logo-tagline.png";
import wordmark from "@/assets/brand/logo-wordmark.png";
import { gsap, useGSAP } from "@/lib/gsap";
import { QUERIES } from "@/lib/media";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import { palette, withAlpha } from "@/lib/tokens";
import { uiStore } from "@/lib/ui-store";

const STORAGE_KEY = "folk:intro";
const READY_CAP_MS = 1000;
/** Longest wait for the logo artwork to decode before it starts drawing in. */
const LOGO_CAP_MS = 500;
/** The logo takes this long to draw itself in; the iris never opens before it has. */
const MIN_LOGO_MS = 1450;
const FAILSAFE_MS = 6500;

/** Fired when the iris is 40% open, so the hero load timeline can overlap it. */
export const INTRO_OPEN_EVENT = "folk:intro-open";

interface Iris {
  radius: number;
  rotation: number;
  edges: number;
}

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

/**
 * Resolves two frames from now. The smooth scroll turns GSAP's lag smoothing off, so a tween made
 * straight after a long main-thread block (hydration) would be timed from a stale clock and finish
 * on its first tick; two frames later the clock has caught up and the tween plays in full.
 */
const freshFrame = () =>
  new Promise((resolve) => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)));

/**
 * First-visit intro: the studio's own logo draws itself in on the logo's maroon (the lettering is
 * written left to right, the tagline settles, the elephant rises out of a mask) while a gold
 * hairline fills with real progress (fonts and the hero photo decoding, capped at 1s). Then an
 * aperture iris opens onto the hero, which is server-rendered and already painted underneath.
 * Click, wheel, touch or a key skips it. Repeat visits in the same session never render it (the
 * head script hides it before paint).
 */
export function Preloader() {
  const [mounted, setMounted] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const root = rootRef.current;
      if (!root || !contextSafe) return;

      const html = document.documentElement;
      if (html.classList.contains("intro-seen")) {
        uiStore.set({ preloaderDone: true });
        if (!document.querySelector("[data-hero]")) uiStore.set({ navReady: true });
        setMounted(false);
        return;
      }

      const logo = root.querySelector<HTMLElement>("[data-preloader-logo]");
      const word = root.querySelector<HTMLElement>("[data-preloader-wordmark]");
      const tag = root.querySelector<HTMLElement>("[data-preloader-tagline]");
      const emblem = root.querySelector<HTMLElement>("[data-preloader-elephant]");
      const line = root.querySelector<HTMLElement>("[data-preloader-line]");
      const canvas = root.querySelector<HTMLCanvasElement>("canvas");
      const context2d = canvas?.getContext("2d") ?? null;
      if (!logo || !word || !tag || !emblem || !line || !canvas || !context2d) return;

      const reduce = window.matchMedia(QUERIES.reduce).matches;
      let finished = false;
      let opening = false;
      let timeline: gsap.core.Timeline | null = null;

      lockScroll();

      const finish = () => {
        if (finished) return;
        finished = true;
        try {
          window.sessionStorage.setItem(STORAGE_KEY, "1");
        } catch {
          // Storage can be unavailable (private mode); the intro then simply plays again.
        }
        uiStore.set({ preloaderDone: true });
        // The hero releases the nav from its own timeline; without a hero, release it here.
        if (!document.querySelector("[data-hero]")) uiStore.set({ navReady: true });
        unlockScroll();
        setMounted(false);
      };

      // Canvas iris: one layer, a hexagonal hole cut with destination-out, gold blade edges.
      const iris: Iris = { radius: 0, rotation: 0, edges: 0 };
      let width = 0;
      let height = 0;
      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        context2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      const draw = () => {
        context2d.globalCompositeOperation = "source-over";
        context2d.clearRect(0, 0, width, height);
        context2d.fillStyle = palette.maroon;
        context2d.fillRect(0, 0, width, height);
        if (iris.radius <= 0) return;
        const cx = width / 2;
        const cy = height / 2;
        const points = Array.from({ length: 6 }, (_, index) => {
          const angle = ((index * 60 + iris.rotation) * Math.PI) / 180;
          return [cx + iris.radius * Math.cos(angle), cy + iris.radius * Math.sin(angle)] as const;
        });
        context2d.globalCompositeOperation = "destination-out";
        context2d.beginPath();
        points.forEach(([x, y], index) => (index === 0 ? context2d.moveTo(x, y) : context2d.lineTo(x, y)));
        context2d.closePath();
        context2d.fill();
        context2d.globalCompositeOperation = "source-over";
        if (iris.edges > 0) {
          context2d.strokeStyle = withAlpha(palette.gold, 0.6 * iris.edges);
          context2d.lineWidth = 1;
          context2d.beginPath();
          points.forEach(([x1, y1], index) => {
            const [x2, y2] = points[(index + 1) % 6];
            context2d.moveTo(x1, y1);
            context2d.lineTo(x1 + (x2 - x1) * 1.6, y1 + (y2 - y1) * 1.6);
          });
          context2d.stroke();
        }
      };

      const open = contextSafe(() => {
        if (opening) return;
        opening = true;
        if (reduce) {
          uiStore.set({ preloaderDone: true });
          window.dispatchEvent(new Event(INTRO_OPEN_EVENT));
          gsap.to(root, { autoAlpha: 0, duration: 0.2, ease: "power1.out", onComplete: finish });
          return;
        }
        resize();
        const maxRadius = (Math.hypot(width, height) / 2 / Math.cos(Math.PI / 6)) * 1.06;
        timeline = gsap.timeline({ onComplete: finish });
        timeline
          .to(line, { scaleX: 1, duration: 0.2, ease: "power2.out" })
          .to([logo, line], { y: -28, autoAlpha: 0, duration: 0.4, ease: "power2.in" }, "+=0.06")
          .addLabel("iris", "+=0.02")
          .add(() => {
            draw();
            gsap.set(canvas, { autoAlpha: 1 });
            root.style.backgroundColor = "transparent";
          }, "iris")
          .to(iris, { edges: 1, duration: 0.2, ease: "power1.out", onUpdate: draw }, "iris")
          .to(iris, { radius: maxRadius, rotation: 60, duration: 0.85, ease: "cinematic", onUpdate: draw }, "iris")
          .to(iris, { edges: 0, duration: 0.45, ease: "power1.in", onUpdate: draw }, "iris+=0.45")
          .add(() => {
            uiStore.set({ preloaderDone: true });
            window.dispatchEvent(new Event(INTRO_OPEN_EVENT));
          }, "iris+=0.34");
      });

      const skip = contextSafe(() => {
        if (finished) return;
        if (!opening) open();
        timeline?.timeScale(3);
      });

      // The logo draws in once its artwork has decoded (or after a short cap, whichever is first).
      const enter = contextSafe(() => {
        gsap.set(logo, { autoAlpha: 1 });
        if (reduce) return;
        gsap.fromTo(
          word,
          { clipPath: "inset(-12% 100% -12% 0%)" },
          // An even pace from left to right reads as handwriting rather than a wipe.
          { clipPath: "inset(-12% 0% -12% 0%)", duration: 1.2, ease: "power2.inOut" },
        );
        gsap.fromTo(
          emblem,
          { yPercent: 14, clipPath: "inset(100% 0% 0% 0%)" },
          { yPercent: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "expo.out", delay: 0.25 },
        );
        gsap.fromTo(tag, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.6 });
      });
      const artwork = Array.from(logo.querySelectorAll("img"), (image) => image.decode().catch(() => undefined));
      const logoReady = Promise.race([Promise.all(artwork), wait(LOGO_CAP_MS)])
        .then(freshFrame)
        .then(() => enter());

      // Real progress: half for fonts, half for the hero photo decoding.
      let progress = 0;
      const setProgress = gsap.quickTo(line, "scaleX", { duration: 0.3, ease: "power2.out" });
      const step = () => {
        progress = Math.min(1, progress + 0.5);
        setProgress(progress);
      };
      const fontsReady = (document.fonts?.ready ?? Promise.resolve()).then(step);
      const heroImage = document.querySelector<HTMLImageElement>("[data-hero-image] img");
      const imageReady = (heroImage ? heroImage.decode().catch(() => undefined) : Promise.resolve()).then(step);
      const capped = wait(READY_CAP_MS);
      const logoDone = logoReady.then(() => wait(reduce ? 0 : MIN_LOGO_MS));
      void Promise.all([Promise.race([Promise.all([fontsReady, imageReady]), capped]), logoDone]).then(() => open());

      const events: (keyof WindowEventMap)[] = ["wheel", "touchstart", "keydown", "pointerdown"];
      for (const type of events) window.addEventListener(type, skip, { passive: true });
      const failsafe = window.setTimeout(finish, FAILSAFE_MS);
      window.addEventListener("resize", resize);

      return () => {
        for (const type of events) window.removeEventListener(type, skip);
        window.removeEventListener("resize", resize);
        window.clearTimeout(failsafe);
        if (!finished) {
          finished = true;
          unlockScroll();
        }
      };
    },
    { scope: rootRef },
  );

  if (!mounted) return null;

  const eager = { loading: "eager", fetchPriority: "high" } as const;

  return (
    <div ref={rootRef} className="preloader" aria-hidden="true">
      <canvas className="preloader-canvas" />
      <div className="preloader-center">
        <div data-preloader-logo className="preloader-logo">
          <Image {...eager} alt="" data-preloader-wordmark src={wordmark} sizes="(min-width: 768px) 23rem, 15rem" className="preloader-wordmark" />
          <Image {...eager} alt="" data-preloader-tagline src={tagline} sizes="(min-width: 768px) 17.5rem, 11.5rem" className="preloader-tagline" />
          <Image {...eager} alt="" data-preloader-elephant src={elephant} sizes="(min-width: 768px) 17rem, 11rem" className="preloader-elephant" />
        </div>
        <span data-preloader-line className="preloader-line" />
      </div>
    </div>
  );
}
