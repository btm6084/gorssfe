module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'eslint:all',
    'plugin:react/all'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'array-bracket-spacing': [ 'error', 'always' ],
    'comma-dangle': [ 'error',
      {
        arrays: 'ignore',
        exports: 'never',
        functions: 'never',
        imports: 'never',
        objects: 'always',
      } ],
    'comma-spacing': [ 'error',
      {
        after: true,
        before: false,
      } ],

    'eol-last': 'off',
    'linebreak-style': 0,
    'max-len': [ 'error',
      {
        code: 250,
        comments: 200,
      } ],
    'no-alert': 'off',
    'no-continue': 'off',
    'no-param-reassign': 0,
    'no-plusplus': 'off',
    'no-shadow': [
      'error',
      {
        allow: [ 'state', 'getters' ],
      },
    ],
    'no-trailing-spaces': 'error',
    'no-unused-vars': [ 'error', { args: 'none', } ],
    quotes: [ 'error', 'single' ],
    radix: [ 'error', 'as-needed' ],
  },
};
