const minifyRhinoSafe = true;

require("esbuild").buildSync({
  banner: {
    js: `
    this.global = this;
    this.module = {
      set exports(exportable) {
        Object.assign(global, exportable);
      },
    };
    global.outcome = function (result) {
        var fr = JavaImporter(
            org.forgerock.openam.auth.node.api.Action
        )
        action = fr.Action.goTo(String(result))
    };
    global.complete = function () {
        var fr = JavaImporter(
            org.forgerock.openam.auth.node.api.Action
        )
        action = fr.Action.build();
    };
`,
  },
  entryPoints: ["fuel/client-stylesheet/index.ts"],
  bundle: true,
  platform: "node",
  inject: ["./fuel/__global__/index.ts"],
  //   target: ["node"],
  target: "es5",
  outfile: "out.js",
  minifyWhitespace: minifyRhinoSafe,
  minifyIdentifiers: true,
});

// TODO:
// remove shorthand property in module.exports line in bundle
// add something like
/**
 * `global.injectClientSideStylesheet = module.exports.injectClientSideStylesheet;`
 * */
