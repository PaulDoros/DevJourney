/** @type {import('prettier').Config} */
module.exports = {
  // Basic formatting
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: "as-needed",
  jsxSingleQuote: false,
  trailingComma: "all",
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",

  // Whitespace
  proseWrap: "preserve",
  htmlWhitespaceSensitivity: "css",
  endOfLine: "auto",

  // Special files formatting
  embeddedLanguageFormatting: "auto",
  singleAttributePerLine: false,

  // Plugins
  plugins: ["prettier-plugin-tailwindcss"],

  // File-specific overrides
  overrides: [
    {
      files: ["*.json", "*.yaml", "*.yml"],
      options: {
        singleQuote: false,
        tabWidth: 2,
      },
    },
    {
      files: "*.md",
      options: {
        proseWrap: "always",
        tabWidth: 2,
      },
    },
  ],
};
