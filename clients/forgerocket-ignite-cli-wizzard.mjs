import { promisify } from "util";
import { exec as _exec } from "child_process";
import prompts from "prompts";
import { readdir, readFile } from "fs/promises";
import { resolve } from "path";
import {
  attemptFrodo,
  readFuelFeatures,
  webpackFromFuel,
} from "./lib-forgerocket.mjs";

const lifecycle = {
  async deploy() {
    const valueExists = { validate: (value) => value.length > 0 };

    const { saveProfile } = await prompts({
      type: "confirm",
      hint: "Selecting yes will prompt for a nickname.",
      name: "rememberUsername",
      message: "Save this conection profile?",
      default: true,
      required: true,
    });

    const { host } = await prompts({
      type: "text",
      hint: "example: (https://openam-forgerock-myname.forgeblocks.com/am)",
      name: "host",
      message: "host",
      validate: (value) => value.length > 0,
      required: true,
    });

    const { username } = await prompts({
      type: "text",
      name: "username",
      message: "username",
      ...valueExists,
      required: true,
    });

    const { realm } = await prompts({
      type: "text",
      name: "realm",
      message: "realm",
      default: "/alpha",
      ...valueExists,
      required: true,
    });

    const { password } = await prompts({
      type: "password",
      name: "password",
      message: "password",
      ...valueExists,
      required: true,
    });

    const listScripts = await attemptFrodo({
      retries: 5,
      frodo: {
        host: "https://openam-fr-adamcrockett.forgeblocks.com/am",
        realm: "/alpha",
        user: "adam.crockett@forgerock.com",
        password: "Moocow000!",
        command: "script list",
      },
      required: true,
    });

    const listOfScripts = listScripts
      .split("...")
      .pop()
      .split("- ")
      .map((scriptName) => scriptName.trim())
      .sort();

    listOfScripts.push("deploy empty script");

    const { selectedScriptsDeploymentTarget } = await prompts({
      type: "autocompleteMultiselect",
      name: "selectedScriptsDeploymentTarget",
      message: `Select script to append ForgeRocket into 🚀`,
      choices: listOfScripts.map((scriptName) => ({
        title: scriptName,
        value: scriptName,
      })),
      min: 1,
      max: 1,
      hint: `
      • After this step, you will be prompted to select the fuel features you require
      • 🚨 Warning! The selected script will be overwritten, backup and use at own risk!
      
      Selected script deployment target:`,
      disabled: false,
      required: true,
    });

    const listForgeRocketFeaturesPackageJson = await readFuelFeatures();

    const listForgeRocketFeaturesMetadata = await Promise.all(
      listForgeRocketFeaturesPackageJson.map(async (pathToFile) => ({
        __filename: pathToFile,
        ...JSON.parse(await readFile(pathToFile, { encoding: "utf8" })),
      }))
    );

    console.log(listForgeRocketFeaturesMetadata);

    selectedScriptsDeploymentTarget.forEach(async (script) => {
      const { selectFuelScriptFeatures } = await prompts({
        type: "autocompleteMultiselect",
        name: "selectFuelScriptFeatures",
        message: `${script}: Which features of ForgeRocket do you want to add to your selected script?`,
        choices: listForgeRocketFeaturesMetadata.map((packageJson, index) => ({
          title: `#${index + 1}
         name: ${packageJson.name.replace("@forgerocket/fuel-", "")}
  description: ${packageJson.config.forgerocket["cli-description"]}
      version: ${packageJson.version}
         docs: ${
           packageJson.config.forgerocket.docs ||
           "Not available yet, pester the author 😱"
         }
       author: ${packageJson.author}
  `,
          value: packageJson,
        })),
        min: 1,
        disabled: false,
        required: true,
      });

      await webpackFromFuel(selectFuelScriptFeatures);
    });

    // for (const script of selectScriptDeploymentTargets) {
    // }

    // await exec(
    //   `frodo info https://openam-fr-adamcrockett.forgeblocks.com/am ${username} ${password}`
    // );
  },
};

lifecycle[process.env.npm_lifecycle_event]();

// frodo script export --all https://openam-fr-adamcrockett.forgeblocks.com/am /alpha adam.crockett@forgerock.com Moocow000!
