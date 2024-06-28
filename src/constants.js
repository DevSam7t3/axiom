import * as p from "@clack/prompts";
import fs from "fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { copyFilesAndDirectories, renamePackageJsonName } from "./utils.js";

const FRAMEWORKS = [
  "nextjs",
  // "vanilla",
  // "react",
  // "angular",
  // "vue",
  // "svelte",
];

const ORM = [
  // "sequelize",
  // "typeorm",
  "prisma",
  // "drizzle",
  // "mongoose"
];

const DATABASES = [
  "mysql",
  //  "postgres",
  //   "sqlite",
  //    "mongodb"
];

const AUTH = [
  // "nextauth",
  //  "supabase",
  //   "firebase",
  "clerk",
];

export const TEMPLATES = [
  {
    value: "template-1",
    title: "Template 1",
    description: "This is template 1",
  },
  {
    value: "template-2",
    title: "template-2",
    description: "This is template 2",
  },
];

export const questions = {
  path: () =>
    p.text({
      message: "What is your project name?",
      placeholder: "my-app",
      validate: (value) => {
        if (!value) return "Please enter a project name.";
      },
    }),
  framework: () =>
    p.select({
      message: "Pick a framework",
      options: FRAMEWORKS.map((f) => ({ value: f, label: f })),
    }),
  useTypescript: ({ results }) =>
    p.confirm({
      message: `Use TypeScript for ${results.framework}?`,
      initialValue: true,
    }),
  orm: () =>
    p.select({
      message: "Pick an ORM you want to use.",
      options: ORM.map((o) => ({ value: o, label: o })),
    }),
  database: () =>
    p.select({
      message: "Pick an Database.",
      options: DATABASES.map((d) => ({ value: d, label: d })),
    }),
  auth: () =>
    p.select({
      message: "Pick an Auth provider.",
      options: AUTH.map((a) => ({ value: a, label: a })),
    }),
  install: async ({ results }) => {
    const s = p.spinner();
    s.start(`copying template into ${results.path}`);
    s.stop(`copying template into ${results.path} successful`);

    // TODO: uncomment this when the templates are ready
    // const template = `${results.framework}-${
    //   results.useTypescript ? "ts" : "js"
    // }-${results.orm}-${results.database}-${results.auth}`;

    // TODO: remove this when the templates are ready
    const template = `${results.framework}-ts-${results.orm}-${results.database}-${results.auth}`;

    const projectName = results.path;
    const cwd = process.cwd();
    const targetDir = path.join(cwd, projectName);
    const sourceDir = path.resolve(
      fileURLToPath(import.meta.url),
      "../../templates",
      `${template}`
    );

    if (!fs.existsSync(targetDir)) {
      // Copying logic
      fs.mkdirSync(targetDir, { recursive: true });
      await copyFilesAndDirectories(sourceDir, targetDir);
      await renamePackageJsonName(targetDir, projectName);
    } else {
      throw new Error("Target directory already exist!");
    }
    return p.confirm({
      message: "Install dependencies?",
      initialValue: true,
    });
  },
};
