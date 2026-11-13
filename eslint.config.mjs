import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Scripts folder - build-time utilities, not production code
    "scripts/**",
    // Legacy folder - deprecated code, not actively maintained
    "legacy/**",
    // Conductor workspace scratch files - local agent artifacts, not source
    ".context/**",
    ".playwright-mcp/**",
    // Docs folder - internal documentation, not user-facing code
    "app/(docs)/**",
    // Examples folder - reference implementations
    "app/(examples)/**",
  ]),
  // Disable overly strict rules for content pages
  {
    rules: {
      // Quotes and apostrophes in content are fine - Next.js handles encoding
      "react/no-unescaped-entities": "off",
      // eslint-config-next 16.4 ships a newer react-hooks plugin that flags
      // existing patterns in 17 places. Kept visible as warnings so the
      // security upgrade doesn't rewrite components; clean up separately.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/immutability": "warn",
    },
  },
]);

export default eslintConfig;
