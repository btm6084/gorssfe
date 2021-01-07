module.exports = {
	root: true,
	parserOptions: {
	  parser: 'babel-eslint',
	},
	env: {
	  node: true,
	},
	extends: [
	  'plugin:vue/recommended',
	  '@vue/airbnb',
	],
	globals: {
	  dataLayer: false,
	  _sift: false,
	},
	rules: {
	  'no-trailing-spaces': 'error',
	  'linebreak-style': 0,
	  quotes: [ 'error', 'single' ],
	  'eol-last': 'off',
	  allowElseIf: true,
	  'max-len': [ 'error', {
		comments: 200,
		code: 250,
	  } ],
	  'comma-spacing': [ 'error', {
		before: false,
		after: true,
	  } ],
	  'comma-dangle': [ 'error', {
		arrays: 'ignore',
		objects: 'always',
		imports: 'never',
		exports: 'never',
		functions: 'never',
	  } ],
	  'no-unused-vars': [ 'error', { args: 'none', } ],
	  'array-bracket-spacing': [ 'error', 'always' ],
	  'no-alert': 'off',
	  'no-continue': 'off',
	  'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
	  'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
	  'no-param-reassign': 0,
	  'no-plusplus': 'off',
	  'vue/name-property-casing': [ 'error', 'kebab-case' ],
	  'vue/component-name-in-template-casing': [
		'error',
		'kebab-case',
		{
		  ignores: [
			'b-loading',
			'b-modal',
			'b-tooltip',
			'component',
			'template',
			'transition',
			'transition-group',
			'keep-alive',
			'slot',
			'router-view',
			'router-link',
		  ],
		},
	  ],
	  'vue/max-attributes-per-line': [
		'error',
		{
		  singleline: 15,
		  multiline: {
			max: 1,
			allowFirstLine: true,
		  },
		},
	  ],
	  'vue/html-closing-bracket-newline': [
		'error',
		{
		  multiline: 'never',
		},
	  ],
	  // 'vue/singleline-html-element-content-newline': ['error', {
	  //   'ignoreWhenNoAttributes': true,
	  //   'ignores': ['pre', 'textarea']
	  // }],
	  'vue/html-closing-bracket-spacing': [ 'error', {
		startTag: 'never',
		endTag: 'never',
		selfClosingTag: 'never',
	  } ],
	  'vue/html-indent': [
		'error',
		2,
		{
		  alignAttributesVertically: true,
		},
	  ],
	  radix: [ 'error', 'as-needed' ],
	  'no-shadow': [
		'error',
		{
		  allow: [ 'state', 'getters' ],
		},
	  ],
	},
  };
