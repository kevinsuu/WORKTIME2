module.exports = {
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es6: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  plugins: ["react"],
  rules: {
    "no-unused-vars": "off",
    "jsx-a11y/anchor-is-valid": "off",
    eqeqeq: "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
