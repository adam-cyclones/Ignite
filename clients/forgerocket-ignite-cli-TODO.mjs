import { promisify } from "util";
import { exec as _exec } from "child_process";
import prompts from "prompts";
import retry from "p-retry";
import { readdir } from "fs/promises";
import { resolve } from "path";


const exec = promisify(_exec);

const lifecycle = {
  async deploy() {
    const valueExists = { validate: (value) => value.length > 0 };

    const { saveProfile } = await prompts({
      type: "confirm",
      name: "rememberUsername",
      message: "Save this conection profile?",
      default: true,
    });

    const { host } = await prompts({
      type: "text",
      name: "host",
      message: "host",
      validate: (value) => value.length > 0,
    });

    const { username } = await prompts({
      type: "text",
      name: "username",
      message: "username",
      ...valueExists,
    });

    const { realm } = await prompts({
      type: "text",
      name: "realm",
      message: "realm",
      default: "/alpha",
      ...valueExists,
    });

    const { password } = await prompts({
      type: "password",
      name: "password",
      message: "password",
      ...valueExists,
    });

    const listScripts = await retry(
      async () => {
        console.log("frodo: 💍 connecting...");
        const { stdout, stderr } = await exec(
          "frodo script list https://openam-forgerock-adamcrockett.forgeblocks.com/am /alpha adam.crockett@forgerock.com Moocow000!"
        );
        if (stderr) {
          console.log("frodo: 💍 connection attempt failed retrying...");
          throw new Error(stderr);
        }
        return stdout;
      },
      {
        retries: 5,
        onFailedAttempt(error) {
          console.log(
            `frodo: 💍 Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.\n`
          );
        },
      }
    );

    const listOfScripts = listScripts
      .split("...")
      .pop()
      .split("- ")
      .map((scriptName) => scriptName.trim())
      .sort();

    listOfScripts.push("deploy empty script");

    const { selectScriptDeploymentTargets } = await prompts({
      type: "multiselect",
      name: "selectScriptDeploymentTargets",
      message: `Select scripts to deploy ForgeRocket 🚀 
        • After this step, you will be prompted to select the features you need to inject
        • 🚨 Warning! Selected scripts will be re-wrote, use at own risk!
        
        Deploy targets`,
      choices: listOfScripts.map((scriptName) => ({
        title: scriptName,
        value: scriptName,
      })),
      disabled: false,
    });

    const listForgeRocketFeatures = await readdir(resolve("./fuel"));

    console.log(selectScriptDeploymentTargets);

    selectScriptDeploymentTargets.forEach(async (script) => {
      const selectFuelScriptFeatures = await prompts({
        type: "multiselect",
        name: "selectFuelScriptFeatures",
        message: `${script}: Which features of ForgeRocket do you want to add to your selected script?`,
        choices: listForgeRocketFeatures.map((text) => ({
          title: text,
          value: text,
        })),
        disabled: false,
      });
      console.log(selectFuelScriptFeatures);
    });

    // for (const script of selectScriptDeploymentTargets) {
    // }

    // await exec(
    //   `frodo info https://openam-forgerock-adamcrockett.forgeblocks.com/am ${username} ${password}`
    // );
  },
};

lifecycle[process.env.npm_lifecycle_event]();

// frodo script export --all https://openam-forgerock-adamcrockett.forgeblocks.com/am /alpha adam.crockett@forgerock.com Moocow000!
