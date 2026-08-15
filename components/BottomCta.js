export function createBottomCta() {
  const button = document.createElement("button");
  button.className = "bottom-cta";
  button.id = "ctaBtn";
  button.innerHTML = `
    <span class="bottom-cta__content">
      <span class="bottom-cta__eyebrow">SACS</span>
      <span class="bottom-cta__label">TOUTE LA SÉLECTION</span>
    </span>
    <span class="chev"></span>
  `;
  return button;
}
