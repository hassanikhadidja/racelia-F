const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "../shopping bag page.html"), "utf8");

const bodyStart = html.indexOf("<body>");
const scriptStart = html.indexOf("<script>", bodyStart);
if (bodyStart < 0 || scriptStart < 0) {
  console.error("Could not parse shopping bag page.html");
  process.exit(1);
}

let markup = html.slice(bodyStart + "<body>".length, scriptStart).trim();

markup = markup.replace(
  /<a onclick="moveToBag\(\)">Move to Bag<\/a>/,
  '<a href="#" class="js-wishlist-move">Move to Bag</a>'
);
markup = markup.replace(
  /<a onclick="removeWishlist\(\)">Remove<\/a>/,
  '<a href="#" class="js-wishlist-remove">Remove</a>'
);
markup = markup.replace(
  /<a onclick="alert\('Sign In clicked'\)">Sign In<\/a>/g,
  '<a href="#" class="js-shopping-bag-signin">Sign In</a>'
);
markup = markup.replace(
  /<a class="modal-signin" onclick="alert\('Sign In clicked'\)">/,
  '<a href="#" class="modal-signin js-shopping-bag-signin">'
);

markup = markup.replace(/\s*onchange="[^"]*"/g, "");
markup = markup.replace(/\s*onclick="[^"]*"/g, "");

markup = markup.replace(
  '<div class="promo-row"',
  '<div class="promo-row js-promo-open" role="button" tabindex="0"'
);
markup = markup.replace('class="modal-close"', 'class="modal-close js-promo-close"');
markup = markup.replace('class="apply-btn"', 'class="apply-btn js-promo-apply"');
markup = markup.replace(
  'class="checkout-btn"',
  'class="checkout-btn js-checkout"'
);
markup = markup.replace(
  '<span class="promo-chevron">›</span>',
  `<span class="promo-chevron" aria-hidden="true"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg></span>`
);

markup = markup.replace(
  /<div class="bag-header">[\s\S]*?<\/div>\s*/,
  ""
);

const modalStart = markup.indexOf("<!-- ════════════ PROMO MODAL");
let modalMarkup = "";
if (modalStart >= 0) {
  modalMarkup = markup.slice(modalStart).trim();
  markup = markup.slice(0, modalStart).trim();
}

const shell = `<div class="shopping-bag-shell">
  <header class="shopping-bag-topbar">
    <button type="button" class="btn-icon js-shopping-bag-back" aria-label="Back">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>
    <h1>My Bag</h1>
    <span class="shopping-bag-topbar__spacer" aria-hidden="true"></span>
  </header>
  <div class="shopping-bag-inner">
    <p class="bag-header-summary"><span class="bag-header-count">2</span> <span class="bag-header-items-label">items</span> · <span class="bag-header-total">990.00 €</span></p>
`;

markup = shell + markup + "\n  </div>\n</div>\n" + (modalMarkup ? modalMarkup + "\n" : "");

const escaped = markup
  .replace(/\\/g, "\\\\")
  .replace(/`/g, "\\`")
  .replace(/\$\{/g, "\\${");

const out = `/** @generated from shopping bag page.html */\nexport function getShoppingBagMarkup() {\n  return \`${escaped}\`;\n}\n`;

fs.writeFileSync(path.join(__dirname, "../js/shoppingBagMarkup.js"), out);
console.log("Wrote js/shoppingBagMarkup.js", out.length, "chars");
