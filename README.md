# htpl

> xxx

# Install

```sh
npm i htpl
```

# Usage

```js
import * as htpl from 'htpl'

htpl(`
	<div>
		<h1>Hello, {{ msg }}</h1>
		<span for="n in list"> {{ n }} </span>
	</div>
`, {
	msg: 'htpl',
	list: ['Fast', 'Simple', 'Micro']
})
```

# License

MIT

