const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "../dashboard.html"), "utf8");
const match = html.match(/<div class="adol-app">([\s\S]*?)<\/div>\s*<script>/);
if (!match) {
  console.error("Could not find adol-app");
  process.exit(1);
}

function neutralizeDashboardColors(html) {
  return html
    .replace(/#2563EB/gi, "#000000")
    .replace(/#3B82F6/gi, "#333333")
    .replace(/#93C5FD/gi, "#d6d6d6")
    .replace(/#DBEAFE/gi, "#f0f0f0")
    .replace(/#60A5FA/gi, "#bdbdbd")
    .replace(/#BFDBFE/gi, "#e5e5e5")
    .replace(/linear-gradient\(135deg,#f0f0f0,#d6d6d6\)/gi, "linear-gradient(135deg,#f0f0f0,#d6d6d6)")
    .replace(/linear-gradient\(160deg,#1E3A8A,#bdbdbd\)/gi, "linear-gradient(160deg,#1a1a1a,#666666)")
    .replace(/linear-gradient\(160deg,#1E293B,#475569\)/gi, "linear-gradient(160deg,#000000,#444444)");
}

let markup = neutralizeDashboardColors(
  match[1]
    .replace(/ADOL/g, "RACÈLIA")
    .replace(/adol-tab/g, "racelia-dashboard-tab")
    .replace(/@adol\.com/g, "@racelia.com")
    .replace(/from ADOL/g, "from RACÈLIA")
)
  .replace(/class="topbar"/g, 'class="dashboard-topbar"')
  .replace(
    /(<header class="dashboard-topbar">\s*<div class="logo">[\s\S]*?<\/div>)\s*/,
    `$1
      <button type="button" class="dashboard-store-btn js-dashboard-store-btn" aria-label="Back to store">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        <span>Back to store</span>
      </button>
      `
  )
  .replace(
    /<div class="search-bar">[\s\S]*?<input placeholder="[^"]*" \/>/,
    `<div class="search-bar search-bar--compact">
        <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        <input type="search" placeholder="Search store…" aria-label="Search store" />`
  );

markup = neutralizeDashboardColors(markup);

const escaped = markup
  .replace(/\\/g, "\\\\")
  .replace(/`/g, "\\`")
  .replace(/\$\{/g, "\\${");

const out = `/** @generated from dashboard.html — do not edit by hand */\nexport function getDashboardMarkup() {\n  return \`${escaped}\`;\n}\n`;

fs.writeFileSync(path.join(__dirname, "../js/dashboardMarkup.js"), out);
console.log("Wrote js/dashboardMarkup.js", out.length, "chars");
