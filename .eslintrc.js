const { tslint, deepmerge } = require('@ice/spec');

module.exports = deepmerge(tslint, {
  env: {
    jest: true,
  },
  rules: {},
});
module.exports = {
  root: false,
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['markdown', 'react', 'babel', 'jest', '@typescript-eslint'],
  env: {
    browser: true,
    node: true,
    jasmine: true,
    jest: true,
    es6: true,
  },
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    camelcase: 0,
    semi: 2,
    eqeqeq: 2,
    'no-console': 1,
    'no-debugger': 1,
    'react/prop-types': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
  },
};
