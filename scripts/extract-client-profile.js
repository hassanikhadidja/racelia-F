const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "../client profile.html"), "utf8");

const frameOpen = html.indexOf('<div class="phone-frame">');
const overlayStart = html.indexOf('<div class="profile-edit-overlay"');
const scriptStart = html.indexOf("<script>", overlayStart);

if (frameOpen < 0 || overlayStart < 0 || scriptStart < 0) {
  console.error("Could not parse client profile.html");
  process.exit(1);
}

let frameInner = html
  .slice(frameOpen + '<div class="phone-frame">'.length, overlayStart)
  .trim();

const overlayHtml = html.slice(overlayStart, scriptStart).trim();

frameInner = frameInner.replace(
  /<button class="btn-icon" onclick="history\.back\(\)">/,
  '<button type="button" class="btn-icon js-client-profile-back" aria-label="Back">'
);

frameInner = frameInner
  .replace(/\s*onclick="flipLoyaltyCard\(\)"/g, "")
  .replace(/\s*onclick="flipEgiftCard\(\)"/g, "")
  .replace(/\s*onclick="event\.stopPropagation\(\)"/g, "");

let markup = `<div class="client-profile-phone-frame">${frameInner}</div>${overlayHtml}`;

const escaped = markup
  .replace(/\\/g, "\\\\")
  .replace(/`/g, "\\`")
  .replace(/\$\{/g, "\\${");

const out = `/** @generated from client profile.html */\nexport function getClientProfileMarkup() {\n  return \`${escaped}\`;\n}\n`;

fs.writeFileSync(path.join(__dirname, "../js/clientProfileMarkup.js"), out);
console.log("Wrote js/clientProfileMarkup.js", out.length, "chars");
