const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "../client profile.html"), "utf8");
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (!styleMatch) {
  console.error("No <style> in client profile.html");
  process.exit(1);
}

let css = styleMatch[1].replace(/\/\*[\s\S]*?\*\//g, "");
css = css.replace(/^\s*body\s*\{/m, "#clientProfilePage {");
css = css.replace(/^\s*\*\s*\{/m, "#clientProfilePage * {");

function prefixRuleSelectors(ruleText) {
  return ruleText.replace(/([^{}]+)\{/g, (full, selectors) => {
    if (selectors.trim().startsWith("@")) return full;
    const prefixed = selectors
      .split(",")
      .map((sel) => {
        const s = sel.trim();
        if (!s || s.startsWith("#clientProfilePage")) return s;
        if (s === ":root") return s;
        if (s === "from" || s === "to") return s;
        if (s.startsWith(":")) return `#clientProfilePage${s}`;
        return `#clientProfilePage ${s}`;
      })
      .join(", ");
    return `${prefixed}{`;
  });
}

function transformCss(input) {
  let out = "";
  let i = 0;
  while (i < input.length) {
    const nextAt = input.indexOf("@", i);
    const nextBrace = input.indexOf("{", i);
    if (nextAt !== -1 && nextAt < nextBrace) {
      const atRuleEnd = input.indexOf("{", nextAt);
      const atHead = input.slice(nextAt, atRuleEnd + 1);
      let depth = 1;
      let j = atRuleEnd + 1;
      while (j < input.length && depth > 0) {
        if (input[j] === "{") depth++;
        if (input[j] === "}") depth--;
        j++;
      }
      const atBody = input.slice(atRuleEnd + 1, j - 1);
      if (atHead.startsWith("@media") || atHead.startsWith("@supports")) {
        out += atHead + transformCss(atBody) + "}";
      } else {
        out += input.slice(nextAt, j);
      }
      i = j;
      continue;
    }
    if (nextBrace === -1) {
      out += input.slice(i);
      break;
    }
    const selectorStart = i;
    const selectorText = input.slice(selectorStart, nextBrace).trim();
    let depth = 1;
    let j = nextBrace + 1;
    while (j < input.length && depth > 0) {
      if (input[j] === "{") depth++;
      if (input[j] === "}") depth--;
      j++;
    }
    const body = input.slice(nextBrace + 1, j - 1);
    out += prefixRuleSelectors(`${selectorText}{${body}}`);
    i = j;
  }
  return out;
}

css = transformCss(css);
css = css.replace(/\.phone-frame\b/g, ".client-profile-phone-frame");
css = css
  .replace(/font-family:\s*'DM Sans'[^;]*/g, 'font-family: var(--font-inter), "Inter", Helvetica, Arial, sans-serif')
  .replace(/background:\s*#f2f2f7/gi, "background: #fff")
  .replace(/color:\s*#007aff/gi, "color: #000");

const shell = `#clientProfilePage {
  position: fixed;
  inset: 0;
  z-index: 1100;
  overflow: auto;
  display: none;
  font-family: var(--font-inter), "Inter", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  background: #fff;
  justify-content: center;
}
#clientProfilePage:not([hidden]) {
  display: flex;
}
body.client-profile-active {
  overflow: hidden;
}
body.client-profile-active #racelia-app > .topbar,
body.client-profile-active #racelia-app > .site-footer,
body.client-profile-active #racelia-app > #selectionWidget,
body.client-profile-active #racelia-app .cta-dock {
  display: none !important;
}
#clientProfilePage .client-profile-phone-frame {
  width: 100%;
  max-width: 480px;
  min-height: 100vh;
  margin: 0 auto;
  background: #fff;
}
`;

fs.writeFileSync(path.join(__dirname, "../styles/clientProfile.css"), shell + css);
console.log("Wrote styles/clientProfile.css", fs.statSync(path.join(__dirname, "../styles/clientProfile.css")).size, "bytes");
