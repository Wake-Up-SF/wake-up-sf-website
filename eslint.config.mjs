import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Design-system guardrails (plans/DESIGN-SYSTEM.md §10).
// Checked wherever classes are written: className / style attributes and cva() / cn() / clsx() arguments.
const forbidden = [
  {
    re: "#[0-9a-fA-F]{3,8}\\b|\\brgba?\\(|\\bhsla?\\(",
    message: "Color literal: use a token from src/styles/tokens.css (semantic alias classes only).",
  },
  {
    re: "\\b(sage|sand|dust-blue|footer-bg)\\b",
    message: "Direction A token; not in this design system.",
  },
  {
    re: "\\bfont-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)\\b|(^|\\s)italic(\\s|$)",
    message: "Ten styles only: weight comes from the style token (text-h4 for links). No font-* weight or italic utilities.",
  },
  {
    re: "\\buppercase\\b|\\btracking-(wide|wider|widest|normal)\\b",
    message: "No uppercase or wide tracking in this design system.",
  },
  {
    re: "\\btext-(xs|sm|base|lg|xl|[2-9]xl|\\[)",
    message: "Font size outside the scale: use text-h1..h5, text-body-1..3, text-display*, text-lede*.",
  },
  {
    re: "\\brounded-(md|lg|xl|2xl|3xl|full)\\b",
    message: "Only rounded-sm (4px) and rounded-pill (legacy input) exist in this system.",
  },
];

const inClassContext = (inner) =>
  `:matches(JSXAttribute[name.name=/^(className|style)$/], CallExpression[callee.name=/^(cva|cn|clsx|twMerge)$/]) ${inner}`;

const literal = (re) => `:matches(Literal[value=/${re}/], TemplateElement[value.raw=/${re}/])`;

const restricted = forbidden.map(({ re, message }) => ({ selector: inClassContext(literal(re)), message }));

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: { "no-restricted-syntax": ["error", ...restricted] },
  },
  {
    // Components set no outer margins and use semantic aliases, never palette names.
    files: ["src/components/**/*.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        ...restricted,
        {
          selector: inClassContext(literal("(^|\\s)-?m[xytblr]?-\\d")),
          message: "Components set no outer margins; the parent uses gap.",
        },
        {
          selector: inClassContext(literal("\\b(bg|text|border)-(ink|clay|bg)(-[a-z]+)?\\b")),
          message: "Use semantic aliases (surface, text, accent, rule) inside components, not palette names.",
        },
      ],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
