import { includeIgnoreFile } from "@eslint/compat";
import eslint from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import eslintPluginAstro from "eslint-plugin-astro";
import jsxA11y from "eslint-plugin-jsx-a11y";
import pluginReact from "eslint-plugin-react";
import reactCompiler from "eslint-plugin-react-compiler";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tseslint from "typescript-eslint";

// File path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, ".gitignore");

const baseConfig = tseslint.config({
  extends: [eslint.configs.recommended, tseslint.configs.strict, tseslint.configs.stylistic],
  rules: {
    "no-console": "off",
    "no-unused-vars": "off",
    "no-undef": "off",
    "react-hooks/exhaustive-deps": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "unused-imports/no-unused-imports": "off",
    "@eslint/eslintrc/no-unused-disable": "off",
  },
  languageOptions: {
    globals: {
      // Browser globals
      console: "readonly",
      window: "readonly",
      document: "readonly",
      fetch: "readonly",
      Response: "readonly",
      Request: "readonly",
      Headers: "readonly",
      URL: "readonly",
      URLSearchParams: "readonly",
      FormData: "readonly",
      File: "readonly",
      Blob: "readonly",
      setTimeout: "readonly",
      setInterval: "readonly",
      clearTimeout: "readonly",
      clearInterval: "readonly",

      // HTML element types
      HTMLElement: "readonly",
      HTMLInputElement: "readonly",
      HTMLButtonElement: "readonly",
      HTMLDivElement: "readonly",
      HTMLParagraphElement: "readonly",
      SVGSVGElement: "readonly",
      Event: "readonly",
      CustomEvent: "readonly",
      MouseEvent: "readonly",
      Node: "readonly",

      // Node.js globals
      process: "readonly",
      __dirname: "readonly",
      __filename: "readonly",
      module: "readonly",
      require: "readonly",
      global: "readonly",

      // React
      React: "readonly",

      // Browser APIs
      localStorage: "readonly",
      sessionStorage: "readonly",
      navigator: "readonly",
      location: "readonly",
      confirm: "readonly",
      alert: "readonly",
    },
  },
});

const jsxA11yConfig = tseslint.config({
  files: ["**/*.{js,jsx,ts,tsx}"],
  extends: [jsxA11y.flatConfigs.recommended],
  languageOptions: {
    ...jsxA11y.flatConfigs.recommended.languageOptions,
  },
  rules: {
    ...jsxA11y.flatConfigs.recommended.rules,
  },
});

const discordBotConfig = tseslint.config({
  files: ["src/discord-bot/**/*.js"],
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    globals: {
      // Node.js globals
      console: "readonly",
      process: "readonly",
      __dirname: "readonly",
      __filename: "readonly",
      module: "readonly",
      require: "readonly",
      exports: "writable",
      global: "writable",
      URL: "readonly",
    },
  },
  rules: {
    "no-redeclare": "off",
    "no-undef": "off",
  },
});

const reactConfig = tseslint.config({
  files: ["**/*.{js,jsx,ts,tsx}"],
  extends: [pluginReact.configs.flat.recommended],
  languageOptions: {
    ...pluginReact.configs.flat.recommended.languageOptions,
    globals: {
      window: true,
      document: true,
    },
  },
  plugins: {
    "react-hooks": eslintPluginReactHooks,
    "react-compiler": reactCompiler,
  },
  settings: { react: { version: "detect" } },
  rules: {
    ...eslintPluginReactHooks.configs.recommended.rules,
    "react/react-in-jsx-scope": "off",
    "react-compiler/react-compiler": "error",
    "react-hooks/exhaustive-deps": "off",
  },
});

// Create a simple ESLint config for ignoring all warnings
const ignoreWarningsConfig = {
  name: "ignore-all-warnings",
  linterOptions: {
    reportUnusedDisableDirectives: false,
  },
};

export default tseslint.config(
  includeIgnoreFile(gitignorePath),
  baseConfig,
  jsxA11yConfig,
  discordBotConfig,
  reactConfig,
  ignoreWarningsConfig,
  eslintPluginAstro.configs["flat/recommended"],
  eslintPluginPrettier
);
