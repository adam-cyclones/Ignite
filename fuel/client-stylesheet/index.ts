import { clientSideScript } from "../client-script/index";

export function injectClientSideStylesheet(styleString) {
  function constructCSSStyleSheet(env) {
    var blob = new Blob([env.styleString || ""], { type: "text/css" });
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = window.URL.createObjectURL(blob);
    document.head.appendChild(link);
  }
  clientSideScript(constructCSSStyleSheet, { styleString });
}

// // expose to Rhino global only! please use module system
// global.injectClientSideStylesheet = injectClientSideStylesheet;
