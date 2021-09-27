module.exports = {
	extends: ['airbnb', 'airbnb-typescript', 'airbnb/hooks', 'plugin:@typescript-eslint/recommended', 'plugin:jest/recommended', 'plugin:promise/recommended', 'plugin:compat/recommended', 'prettier'],
	env: {
		browser: true,
		node: true,
	},
	rules: {
		'import/no-extraneous-dependencies': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-var-requires': 'off',
		'no-param-reassign': ['error', { props: false }],
	},
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		project: './tsconfig.json',
		tsconfigRootDir: __dirname,
		createDefaultProgram: true,
	},
	settings: {
		'import/resolver': {
			node: {},
			webpack: {
				config: require.resolve('./.erb/configs/webpack.config.eslint.js'),
			},
		},
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.tsx'],
		},
	},
}
