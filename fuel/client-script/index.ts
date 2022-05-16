// import "global";

/**
 *
 * @param t
 * @param vars
 */
export function clientSideScript(sandboxFunction: Function, vars?: object) {
  var fr = JavaImporter(
    org.forgerock.openam.auth.node.api.Action,
    com.sun.identity.authentication.callbacks.ScriptTextOutputCallback
  );
  var sandboxEnvVars = JSON.stringify(vars);

  callbacks.isEmpty()
    ? (action = fr.Action.send(
        new fr.ScriptTextOutputCallback(
          // the generated output is:
          // function sandbox() {...defined}; sandbox(...args);
          `${sandboxFunction.toString()} /* Imediately call passing vars*/ ${
            (sandboxFunction as any).name
          }(${sandboxEnvVars});`
        )
      ).build())
    : (action = fr.Action.goTo(true.toString()).build());
}

// expose to Rhino global only! please use module system
global.clientSideScript = clientSideScript;
