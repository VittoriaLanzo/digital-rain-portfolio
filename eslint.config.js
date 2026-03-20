import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    // Never lint generated/vendored files
    ignores: [
      "dist",
      "src/components/ui/**",   // shadcn/ui auto-generated components
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Warn on fast-refresh violations but don't block CI (hooks/constants are fine)
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      // Unused vars already caught by TypeScript; avoid double-reporting
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
);
