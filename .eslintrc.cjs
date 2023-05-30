/* eslint-env node */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended'
  ],
  plugins: ['@typescript-eslint'],
  parser: "vue-eslint-parser",
  parserOptions: {
    sourceType: "module",
    parser: "@typescript-eslint/parser",
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    extraFileExtensions: ['.vue'],
  },
  root: true,
  ignorePatterns: ["**/cypress/**/*.d.ts", "**/*.js"],
  rules:{
    'vue/multi-word-component-names': [
      'error',
      {
        ignores: ['Header', 'Footer', 'Caution'],
      },
    ],
    'camelcase': 'error'
  }
};
