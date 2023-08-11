// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: [
    '@kadena-dev/eslint-config/profile/react',
    'plugin:playwright/recommended',
  ],
  parserOptions: {
    project: ['./tsconfig.json'], // Specify it only for TypeScript files,
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: 'playwright.config.ts',
  rules: {
    '@typescript-eslint/naming-convention': 'off',
  },
};
