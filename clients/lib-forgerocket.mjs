import retry from "p-retry";
import { promisify } from "util";
import { exec as _exec } from "child_process";
import fg from "fast-glob";
import webpack from "webpack";
import { resolve } from "path";
import MergeIntoSingleFilePlugin from "webpack-merge-and-include-globally";
import { readFile } from "fs/promises";
const exec = promisify(_exec);

export const attemptFrodo = async ({
  retries,
  frodo: { command, host, realm, user, password },
}) =>
  await retry(
    async () => {
      console.log("frodo: 💍 connecting...");
      const { stdout, stderr } = await exec(
        `npx frodo ${command} ${[host, realm, user, password]
          .filter(Boolean)
          .join(" ")}`
      );
      if (stderr && !stderr.includes("Importing JSON modules")) {
        console.log("frodo: 💍 connection attempt failed retrying...");
        throw new Error(stderr);
      }
      return stdout;
    },
    {
      retries: retries,
      onFailedAttempt(error) {
        console.log(
          `frodo: 💍 Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.\n`
        );
      },
    }
  );

export const readFuelFeatures = async () =>
  await fg(["fuel/**/package.json"], { ignore: ["__*__"] });

// dynamicly inform webpack of code splitting
export const webpackFromFuel = async (fuelScripts) => {
  const config = {
    mode: "development",
    target: ["web", "es5"],
    resolve: {
      alias: {
        global: resolve("fuel", "__global__"),
      },
    },
    entry: {
      //   forgerocket: "forgerocket.js",
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
      new webpack.BannerPlugin({
        banner: "this.global = this;",
        raw: true,
      }),
      new webpack.ProvidePlugin({
        global: resolve(".", "fuel", "__global__"),
        // ...
      }),
    ],
  };

  fuelScripts.forEach((packageJson) => {
    config.entry[
      `${packageJson.name.replace("@", "").replace("fuel-", "")}-${
        packageJson.version
      }`
    ] = resolve(packageJson.__filename, "../", "index.ts");
  });

  console.log(config);
  webpack(config, (err, stats) => {
    console.log(stats, err);
    // [Stats Object](#stats-object)
    if (err || stats.hasErrors()) {
      // [Handle errors here](#error-handling)
    }
    // Done processing
  });
};
