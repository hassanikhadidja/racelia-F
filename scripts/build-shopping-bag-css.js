const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "../shopping bag page.html"), "utf8");
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (!styleMatch) {
  console.error("No <style> in shopping bag page.html");
  process.exit(1);
}

let css = styleMatch[1].replace(/\/\*[\s\S]*?\*\//g, "");
css = css.replace(/^\s*body\s*\{/m, "#shoppingBagPage {");
css = css.replace(/^\s*\*\s*\{/m, "#shoppingBagPage * {");

function prefixRuleSelectors(ruleText) {
  return ruleText.replace(/([^{}]+)\{/g, (full, selectors) => {
    if (selectors.trim().startsWith("@")) return full;
    const prefixed = selectors
      .split(",")
      .map((sel) => {
        const s = sel.trim();
        if (!s || s.startsWith("#shoppingBagPage")) return s;
        if (s === "from" || s === "to") return s;
        if (s.startsWith(":")) return `#shoppingBagPage${s}`;
        return `#shoppingBagPage ${s}`;
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
    const ruleStart = i;
    let depth = 0;
    let j = nextBrace;
    while (j < input.length) {
      if (input[j] === "{") depth++;
      if (input[j] === "}") {
        depth--;
        if (depth === 0) {
          j++;
          break;
        }
      }
      j++;
    }
    const rule = input.slice(ruleStart, j);
    out += prefixRuleSelectors(rule);
    i = j;
  }
  return out;
}

let transformed = transformCss(css);
transformed = transformed.replace(/font-family:\s*'Times New Roman'[^;]*;/g, "");
transformed = transformed.replace(
  /#shoppingBagPage \.bag-header h1 span\{[^}]*\}/g,
  ""
);
transformed = transformed.replace(
  /@keyframes slideIn[\s\S]*?\}\s*\}/,
  ""
);
transformed = transformed.replace(
  /animation:\s*slideIn[^;]*;/g,
  ""
);

const shell = `#shoppingBagPage {
  position: fixed;
  inset: 0;
  z-index: 1100;
  overflow: auto;
  display: none;
  font-family: Georgia, "Times New Roman", serif;
  -webkit-font-smoothing: antialiased;
  background: #fff;
  color: #000;
}
#shoppingBagPage:not([hidden]) {
  display: block;
}
body.shopping-bag-active {
  overflow: hidden;
}
body.shopping-bag-active #racelia-app > .topbar,
body.shopping-bag-active #racelia-app > .site-footer,
body.shopping-bag-active #racelia-app > #selectionWidget,
body.shopping-bag-active #racelia-app .cta-dock {
  display: none !important;
}
#shoppingBagPage .shopping-bag-shell {
  min-height: 100vh;
  background: #fff;
}
`;

fs.writeFileSync(path.join(__dirname, "../styles/shoppingBag.css"), shell + transformed);
console.log("Wrote styles/shoppingBag.css", (shell + transformed).length, "chars");
