import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // 1) Your main config object
  {
    // Tell ESLint to skip these folders (they won't even be linted)
    ignores: ["node_modules", "dist", "build/**", "public", "Archive/**", "web-ui/**", "web-ui"],

    // Files to lint
    files: ["**/*.{js,mjs,cjs,jsx}"],

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      // If you need advanced parser settings, add them here, for example:
      // parserOptions: { ecmaVersion: "latest", sourceType: "module", ecmaFeatures: { jsx: true } }
    },

    // Optionally declare plugin usage if you want custom plugin rules
    plugins: {
      // This key must match how you reference rules, e.g. "react/sort-comp" for pluginReact
      // but if you just rely on recommended sets, you can skip this
      react: pluginReact,
    },

    // Common rules you’d like to override or add
    rules: {
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      // Add any other custom rules you need
      // "no-console": "warn",
      // "react/prop-types": "off",
    },
  },

  // 2) Merge in ESLint’s recommended config for JS
  pluginJs.configs.recommended,

  // 3) Merge in React’s recommended config for JSX
  pluginReact.configs.flat.recommended,
];
