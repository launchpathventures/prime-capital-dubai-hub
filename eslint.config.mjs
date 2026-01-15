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
    },
  },
]);

export default eslintConfig;
