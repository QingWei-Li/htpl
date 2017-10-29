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
		<span h-for="n in list"> {{ n }} </span>
	</div>
`).render({
	msg: 'htpl',
	list: ['Fast', 'Simple', 'Micro']
})
```

# License

MIT

