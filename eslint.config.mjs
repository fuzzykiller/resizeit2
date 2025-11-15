import eslint from '@eslint/js';
import globals from "globals";
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(["**/web-ext-types.d.ts"]),
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      }
    }
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.webextensions,
      },

      ecmaVersion: 5,
      sourceType: "script",
    },
  },
  {
    rules: {
      indent: ["error", 2],
      "linebreak-style": ["error", "windows"],

      quotes: ["error", "double", {
        avoidEscape: true,
      }],

      semi: "error",
      "sort-keys": "off",
    },
  }
]);