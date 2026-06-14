export function initProductSliders(root, scope = root) {
  scope.querySelectorAll(".product").forEach((product) => {
    const imgs = (product.dataset.images || "").split("|").filter(Boolean);
    if (!imgs.length) return;

    const slides = product.querySelector(".slides");
    const underline = product.querySelector(".underline");
    if (!slides || !underline) return;

    slides.innerHTML = imgs
      .map(
        (src) =>
          `<img src="${src}" alt="" onerror="this.style.visibility='hidden'">`
      )
      .join("");

    const fill = underline.querySelector(".underline__fill");
    if (!fill) return;

    const setActive = (index) => {
      const count = imgs.length;
      fill.style.width = `${100 / count}%`;
      fill.style.left = `${(index / count) * 100}%`;
    };

    setActive(0);

    const track = underline.querySelector(".underline__track");
    track?.addEventListener("click", (event) => {
      const rect = track.getBoundingClientRect();
      const ratio = (event.clientX - rect.left) / rect.width;
      const index = Math.min(
        imgs.length - 1,
        Math.max(0, Math.floor(ratio * imgs.length))
      );
      slides.scrollTo({
        left: index * slides.clientWidth,
        behavior: "smooth",
      });
      setActive(index);
    });

    let raf;
    slides.addEventListener(
      "scroll",
      () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const index = Math.round(slides.scrollLeft / slides.clientWidth);
          setActive(index);
        });
      },
      { passive: true }
    );
  });
}
