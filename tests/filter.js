'use strict';

QUnit.module('Проверка работы функции filter', function () {
	QUnit.test('filter экранирует символы в обычном тексте', function (assert) {
		const input = '- "42!", сказала Машина. Это и был главный ответ на Вопрос жизни, вселенной & всего такого...';

		const output = filter(input, [ 'strong', 'em' ]);

		const expected = '- &quot;42!&quot;, сказала Машина. Это и был главный ответ на Вопрос жизни, вселенной &amp; всего такого...';

		assert.strictEqual(output, expected);
	});

	QUnit.test('filter не экранирует валидные html-тэги', function (assert) {
		const input = '<strong>Hello, <em>World!</em></strong> 1 + 2 < 4!';

		const output = filter(input, [ 'strong', 'em' ]);

		const expected = '<strong>Hello, <em>World!</em></strong> 1 + 2 &lt; 4!';

		assert.strictEqual(output, expected);
	});

	QUnit.test('filter экранирует XSS', function (assert) {
		assert.strictEqual(filter(`<script>alert('1');</script>`, [ 'strong', 'em' ]), '&lt;script&gt;alert(&#39;1&#39;);&lt;/script&gt;');
		assert.strictEqual(filter(`<img src="bad" onerror="alert('1');">`, [ 'strong', 'em' ]), '&lt;img src=&quot;bad&quot; onerror=&quot;alert(&#39;1&#39;);&quot;&gt;');
	});

	QUnit.test('Совмещение валидных и не валидных тэгов', function(assert) {
		const input = '<div><div><button type="button">Touck me</button></div></div>';

		const output = filter(input, [ 'div' ]);

		const expected = '<div><div>&lt;button type=&quot;button&quot;&gt;Touck me&lt;/button&gt;</div></div>';

		assert.strictEqual(output, expected);
	});

	QUnit.test('filter не экранирует валидные тэги и их аргументы', function (assert) {
		const input = '<div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown"><a class="dropdown-item" href="#">Profile</a></div>';

		const output = filter(input, [ 'div' ]);

		const expected = '<div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">&lt;a class=&quot;dropdown-item&quot; href=&quot;#&quot;&gt;Profile&lt;/a&gt;</div>';
		assert.strictEqual(output, expected);
	});
});
