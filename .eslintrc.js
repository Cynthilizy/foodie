module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "@react-native-community",
  ],
  parserOptions: {
    ecmaVersion: latest,
    sourceType: "module",
    babelOptions: {
      configFile: "./babel.config.js",
    },
  },
  plugins: ["react"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    quotes: [2, "double", { avoidEscape: true }],
  },
};
