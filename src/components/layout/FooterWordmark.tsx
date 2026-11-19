"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { QUERIES } from "@/lib/media";

/**
 * The studio name, set huge and fitted exactly to the container width. CSS gives a close estimate
 * for the first paint (it sits far below the fold); a ResizeObserver and the font load then set
 * the exact size. It rises out of a mask when it scrolls into view. Decorative: aria-hidden.
 */
export function FooterWordmark({ children }: { children: ReactNode }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const box = boxRef.current;
      const word = wordRef.current;
      if (!box || !word) return;

      let lastWidth = -1;
      const fit = (force = false) => {
        const width = box.clientWidth;
        if (!force && width === lastWidth) return;
        lastWidth = width;
        const size = Number.parseFloat(getComputedStyle(word).fontSize);
        const natural = word.offsetWidth;
        if (!size || !natural) return;
        box.style.setProperty("--fit-size", `${Math.floor((width / (natural / size)) * 100) / 100}px`);
      };
      fit(true);
      void document.fonts?.ready.then(() => fit(true));
      const observer = new ResizeObserver(() => fit());
      observer.observe(box);

      const mm = gsap.matchMedia();
      mm.add(QUERIES.motion, () => {
        gsap.fromTo(
          word,
          { yPercent: 100, autoAlpha: 1 },
          {
            yPercent: 0,
            duration: 1.4,
            ease: "cinematic",
            scrollTrigger: { trigger: box, start: "top 92%", once: true },
          },
        );
      });

      return () => {
        observer.disconnect();
        mm.revert();
      };
    },
    { scope: boxRef },
  );

  return (
    <div ref={boxRef} aria-hidden="true" className="footer-wordmark-box mt-8 overflow-hidden md:mt-10">
      <span ref={wordRef} data-reveal className="footer-wordmark">
        {children}
      </span>
    </div>
  );
}
