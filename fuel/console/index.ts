import { clientSideScript } from "../client-script";

// this === rhino global at top level
//@ts-ignore
global.console = {
  log(...args: any[]) {
    logger.message(JSON.stringify(args, null, 4));
    clientSideScript(
      function sandbox({ args }) {
        console.log(...args);
      },
      { args }
    );
  },
  warn(...args: any[]) {
    logger.message(JSON.stringify(args, null, 4));
    clientSideScript(
      function sandbox({ args }) {
        console.warn(...args);
      },
      { args }
    );
  },
  error(...args: any[]) {
    logger.error(JSON.stringify(args, null, 4));
    clientSideScript(
      function sandbox({ args }) {
        console.error(...args);
      },
      { args }
    );
  },
  info(...args: any[]) {
    logger.message(JSON.stringify(args, null, 4));
    clientSideScript(
      function sandbox({ args }) {
        console.info(...args);
      },
      { args }
    );
  },
  table(...args: any[]) {
    logger.message("console.table not implimented yet.");
    clientSideScript(
      function sandbox({ args }) {
        console.table(...args);
      },
      { args }
    );
  },
  time(...args: any[]) {
    logger.message("console.time not implimented yet.");
    clientSideScript(
      function sandbox({ args }) {
        console.time(...args);
      },
      { args }
    );
  },
  timeEnd(...args: any[]) {
    logger.message("console.timeEnd not implimented yet.");
    clientSideScript(
      function sandbox({ args }) {
        console.table(...args);
      },
      { args }
    );
  },
  assert(...args: any[]) {
    logger.message("console.assert not implimented yet.");
    clientSideScript(
      function sandbox({ args }) {
        console.assert(...args);
      },
      { args }
    );
  },
  clear() {
    logger.message("console.clear not implimented yet.");
    clientSideScript(function sandbox() {
      console.clear();
    });
  },
  group(...args: any[]) {
    logger.message("console.group not implimented yet.");
    clientSideScript(
      function sandbox({ args }) {
        console.group(...args);
      },
      { args }
    );
  },
  groupEnd() {
    logger.message("console.groupEnd not implimented yet.");
    clientSideScript(function sandbox() {
      console.groupEnd();
    });
  },
};
