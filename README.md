# htpl [Not ready]

> A JavaScript templating engine uses Vue syntax

[![npm](https://img.shields.io/npm/v/htpl.svg)](https://www.npmjs.com/package/htpl)

## Install

```sh
npm i htpl
```

## Usage

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

## License

MIT
