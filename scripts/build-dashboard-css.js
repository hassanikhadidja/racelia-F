const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "../dashboard.html"), "utf8");
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (!styleMatch) {
  console.error("No <style> block in dashboard.html");
  process.exit(1);
}

let css = styleMatch[1];
css = css.replace(/\/\*[\s\S]*?\*\//g, "");
css = css.replace(/\.topbar(?!-)/g, ".dashboard-topbar");
css = css.replace(/^\s*body\s*\{/m, "#dashboardPage {");
css = css.replace(/^\s*\*\s*\{/m, "#dashboardPage * {");
css = css.replace(/:root\s*\{/g, "#dashboardPage {");

function prefixRuleSelectors(ruleText) {
  return ruleText.replace(/([^{}]+)\{/g, (full, selectors) => {
    if (selectors.trim().startsWith("@")) return full;
    const prefixed = selectors
      .split(",")
      .map((sel) => {
        const s = sel.trim();
        if (!s) return s;
        if (s.startsWith("#dashboardPage")) return s;
        if (s === ":root") return s;
        if (s === "from" || s === "to") return s;
        if (s.startsWith("@")) return s;
        if (s.startsWith(":")) return `#dashboardPage${s}`;
        return `#dashboardPage ${s}`;
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
      const atRule = input.slice(nextAt, j);
      if (atHead.startsWith("@media") || atHead.startsWith("@supports")) {
        out += atHead + transformCss(atBody) + "}";
      } else {
        out += atRule;
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
    const rule = `${selectorText}{${body}}`;
    out += prefixRuleSelectors(rule);
    i = j;
  }
  return out;
}

css = transformCss(css);
css = css
  .replace(/font-family:\s*'DM Sans'[^;]*/g, 'font-family: var(--font-inter), "Inter", Helvetica, Arial, sans-serif')
  .replace(/background:\s*#F4F6FB/gi, "background: #fff")
  .replace(/color:\s*#0F172A/gi, "color: #000")
  .replace(/--blue:\s*#2563EB/gi, "--blue: #000")
  .replace(/--blue-light:\s*#DBEAFE/gi, "--blue-light: #f5f5f5")
  .replace(/--blue-mid:\s*#93C5FD/gi, "--blue-mid: #d6d6d6")
  .replace(
    /linear-gradient\(135deg,\s*#0F172A\s*0%,\s*#1E3A8A\s*50%,\s*#2563EB\s*100%\)/gi,
    "linear-gradient(135deg, #000 0%, #3a3a3a 100%)"
  );

const shell = `/* Base layout — brand tokens in dashboard-theme.css */

#dashboardPage {
  position: fixed;
  inset: 0;
  z-index: 1100;
  overflow: auto;
  background: #fff;
  display: none;
  font-family: var(--font-inter), "Inter", Helvetica, Arial, sans-serif;
  color: #000;
  min-height: 100vh;
}
#dashboardPage:not([hidden]) {
  display: block;
}
body.dashboard-active {
  overflow: hidden;
}
body.dashboard-active #racelia-app > .topbar,
body.dashboard-active #racelia-app > .site-footer,
body.dashboard-active #racelia-app > #selectionWidget,
body.dashboard-active #racelia-app .cta-dock {
  display: none !important;
}

#dashboardPage .icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--white);
  border: 1px solid var(--gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
}
#dashboardPage .icon-btn svg {
  width: 18px;
  height: 18px;
  stroke: none;
  fill: var(--gray-500);
}

#dashboardPage .dashboard-store-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  color: var(--gray-700);
  background: var(--white);
  border: 1px solid var(--gray-100);
  transition: background 0.15s ease, border-color 0.15s ease;
}
#dashboardPage .dashboard-store-btn:hover {
  background: var(--gray-50);
  border-color: var(--gray-200);
}
#dashboardPage .dashboard-store-btn svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
#dashboardPage .search-bar--compact {
  flex: 1 1 auto;
  min-width: 0;
  max-width: min(360px, calc(100vw - 300px));
}

`;

const topbarOverrides = `
#dashboardPage .dashboard-topbar .search-bar.search-bar--compact {
  flex: 1 1 auto !important;
  width: auto !important;
  min-width: 0 !important;
  max-width: min(360px, calc(100vw - 300px)) !important;
}
@media (max-width: 768px) {
  #dashboardPage .dashboard-topbar .search-bar.search-bar--compact {
    max-width: none !important;
    flex: 1 1 0 !important;
  }
}
`;

const outPath = path.join(__dirname, "../styles/dashboard.css");
fs.writeFileSync(outPath, shell + css + topbarOverrides);
console.log("Wrote", outPath, fs.statSync(outPath).size, "bytes");
