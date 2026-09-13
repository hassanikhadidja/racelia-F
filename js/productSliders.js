const ARROW_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>';

function createArrow(direction) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `product-arrow product-arrow--${direction}`;
  button.setAttribute(
    "aria-label",
    direction === "prev" ? "Image précédente" : "Image suivante"
  );
  button.innerHTML = ARROW_SVG;
  return button;
}

function currentIndex(slides, count) {
  if (!slides.clientWidth) return 0;
  return Math.min(count - 1, Math.max(0, Math.round(slides.scrollLeft / slides.clientWidth)));
}

export function initProductSliders(root, scope = root) {
  scope.querySelectorAll(".product").forEach((product) => {
    const imgs = (product.dataset.images || "").split("|").filter(Boolean);
    if (!imgs.length) return;

    const slides = product.querySelector(".slides");
    const underline = product.querySelector(".underline");
    const imgwrap = product.querySelector(".imgwrap");
    if (!slides || !underline) return;

    slides.innerHTML = imgs
      .map(
        (src) =>
          `<img src="${src}" alt="" onerror="this.style.visibility='hidden'">`
      )
      .join("");

    const fill = underline.querySelector(".underline__fill");
    if (!fill) return;

    let prev = product.querySelector(".product-arrow--prev");
    let next = product.querySelector(".product-arrow--next");
    if (imgwrap && !prev) {
      prev = createArrow("prev");
      next = createArrow("next");
      imgwrap.append(prev, next);
    }
    if (prev) prev.hidden = false;
    if (next) next.hidden = false;

    const setActive = (index) => {
      const count = imgs.length;
      fill.style.width = `${100 / count}%`;
      fill.style.left = `${(index / count) * 100}%`;
    };

    setActive(0);

    if (prev && next && product.dataset.arrowsBound !== "true") {
      product.dataset.arrowsBound = "true";
      const step = (delta) => {
        const sources = (product.dataset.images || "").split("|").filter(Boolean);
        if (!sources.length) return;
        const index =
          (currentIndex(slides, sources.length) + delta + sources.length) % sources.length;
        slides.scrollTo({
          left: index * slides.clientWidth,
          behavior: "smooth",
        });
      };
      prev.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        step(-1);
      });
      next.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        step(1);
      });
    }

    if (slides.dataset.axisLockBound !== "true") {
      slides.dataset.axisLockBound = "true";
      let startX = 0;
      let startY = 0;
      let axis = "";

      const releaseAxis = () => {
        axis = "";
        slides.style.overflowX = "";
      };

      slides.addEventListener(
        "touchstart",
        (event) => {
          const touch = event.touches[0];
          if (!touch) return;
          startX = touch.clientX;
          startY = touch.clientY;
          axis = "";
          slides.style.overflowX = "";
        },
        { passive: true }
      );

      slides.addEventListener(
        "touchmove",
        (event) => {
          if (axis || !event.touches[0]) return;
          const dx = Math.abs(event.touches[0].clientX - startX);
          const dy = Math.abs(event.touches[0].clientY - startY);
          if (dx < 8 && dy < 8) return;
          axis = dx > dy ? "x" : "y";
          if (axis === "y") slides.style.overflowX = "hidden";
        },
        { passive: true }
      );

      slides.addEventListener("touchend", releaseAxis, { passive: true });
      slides.addEventListener("touchcancel", releaseAxis, { passive: true });
    }

    if (product.dataset.sliderNavBound !== "true") {
      product.dataset.sliderNavBound = "true";

      const track = underline.querySelector(".underline__track");
      track?.addEventListener("click", (event) => {
        const sources = (product.dataset.images || "").split("|").filter(Boolean);
        const rect = track.getBoundingClientRect();
        const ratio = (event.clientX - rect.left) / rect.width;
        const index = Math.min(
          sources.length - 1,
          Math.max(0, Math.floor(ratio * sources.length))
        );
        slides.scrollTo({
          left: index * slides.clientWidth,
          behavior: "smooth",
        });
        fill.style.width = `${100 / sources.length}%`;
        fill.style.left = `${(index / sources.length) * 100}%`;
      });

      let raf;
      slides.addEventListener(
        "scroll",
        () => {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(() => {
            const sources = (product.dataset.images || "").split("|").filter(Boolean);
            const index = currentIndex(slides, sources.length);
            fill.style.width = `${100 / sources.length}%`;
            fill.style.left = `${(index / sources.length) * 100}%`;
          });
        },
        { passive: true }
      );
    }
  });
}
