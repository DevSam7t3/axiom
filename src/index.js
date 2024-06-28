import * as p from "@clack/prompts";
import figlet from "figlet";
import gradient from "gradient-string";
import { execSync } from "node:child_process";
import { setTimeout } from "node:timers/promises";
import color from "picocolors";

import { questions } from "./constants.js";

async function main() {
  console.clear();

  await setTimeout(1000);

  figlet("T e m p l i f y", (err, data) => {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log(gradient.pastel.multiline(data));
  });

  await setTimeout(2000);

  const project = await p.group(questions, {
    onCancel: () => {
      p.cancel("Operation cancelled.");
      process.exit(0);
    },
  });

  if (project.install) {
    const s = p.spinner();
    s.start("Installing via npm");
    execSync(`cd ${project.path}`);
    execSync("npm install", { cwd: project.path });
    s.stop("Installed via npm");
  }

  let nextSteps = `cd ${project.path}        \n${
    project.install ? "" : "npm install\n"
  }npm run dev`;

  p.note(nextSteps, "Next steps.");

  p.outro(
    `Problems? ${color.underline(color.cyan("https://example.com/issues"))}`
  );
}

main().catch(console.error);
