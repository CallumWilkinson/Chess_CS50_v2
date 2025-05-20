// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    ignores: ["node_modules/**", "test-results/**", "playwright-report/**"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        process: "readonly",
      },
    },
    env: {
      node: true,
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-constant-condition": "warn",
      "no-var": "error",
      "prefer-const": "warn",
      "no-mixed-spaces-and-tabs": "warn",
      "no-unreachable": "warn",
      "no-nested-ternary": "error",
      "no-ternary": "error",
      curly: ["error", "all"],
      "no-console": "off",
    },
  },
  {
    files: ["**/*.spec.js", "**/*.test.js", "e2e/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
    },
  },
]);
