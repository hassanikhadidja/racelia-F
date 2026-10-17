"use client";

import { useEffect, useRef } from "react";
import { mountRaceliaApp } from "@/js/index";
import { loadDeferredStyles } from "@/js/deferredStyles";
import { heroImage, toutHeroImage } from "@/js/data";
import { heroDelivery } from "@/js/imageDelivery";
import "@/styles/racelia.css";
import "@/styles/footer.css";

const hero = heroDelivery(heroImage);

function isHomeEntry() {
  const hash = window.location.hash.replace(/^#/, "").trim();
  return !hash || hash === "home";
}

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || mountedRef.current) return;
    mountedRef.current = true;
    if (isHomeEntry()) {
      mountRaceliaApp(el);
      const loadLater = () => loadDeferredStyles();
      if ("requestIdleCallback" in window) window.requestIdleCallback(loadLater, { timeout: 1800 });
      else setTimeout(loadLater, 700);
      return;
    }
    loadDeferredStyles().then(() => {
      if (rootRef.current) mountRaceliaApp(rootRef.current);
    });
  }, []);

  return (
    <>
    <link rel="preload" as="image" href={toutHeroImage} media="(max-width: 1023px)" fetchPriority="high" />
    <div
      ref={rootRef}
      id="racelia-app"
      style={{ minHeight: "100vh", width: "100%" }}
    >
      <section className="hero reveal in" id="ssrHero">
        <div className="hero-frame">
          <picture>
            <source media="(max-width: 1023px)" srcSet={toutHeroImage} />
            <img
              src={hero.src}
              srcSet={hero.srcSet}
              sizes={hero.sizes}
              alt="Collection RACÈLIA"
              fetchPriority="high"
              decoding="async"
              width={767}
              height={1024}
            />
          </picture>
        </div>
        <div className="hero-overlay">
          <h2>RACÈLIA, simplement vous.</h2>
        </div>
      </section>
    </div>
    </>
  );
}
