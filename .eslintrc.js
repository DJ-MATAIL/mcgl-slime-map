module.exports = {
	parserOptions: {sourceType: 'module'},
	extends: ['eslint:recommended'],
	env: {
		node: true,
		es2021: true,
	},
	rules: {
		// запретить __proto__
		'no-proto': 'error',
		// запретить return await
		'no-return-await': 'error',
		// запретить eval
		'no-eval': 'error',
		// максимальная длина строки
		'max-len': [
			'error',
			{code: 120},
		],
		// требовать пустую строку в конце файла
		'eol-last': 'error',
		// разрешить только одиночные кавычки и обратные кавычки (backticks) внутри шаблонных выражений
		'quotes': [
			'error',
			'single',
		],
		// запретить ;
		'semi': [
			'error',
			'never',
		],
		// требовать запятую в конце последнего элемента (trailing comma), когда запись в несколько строк
		'comma-dangle': [
			'error',
			{
				arrays: 'always-multiline',
				objects: 'always-multiline',
				imports: 'always-multiline',
				exports: 'always-multiline',
				functions: 'never',
			},
		],
		// запретить func( 'arg' ). Только func('arg')
		'space-in-parens': [
			'error',
			'never',
		],
		// запретить if, for, ... без скобок
		'curly': 'error',

		/*
		** предупреждения
		*/

		// предупредить об неиспользуемых переменных
		'no-unused-vars': 'warn',
	},
}
