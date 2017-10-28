var htpl = require('../dist/index').default;

const a = htpl(
  `<div>
    <div v-for="n in list">{{ n }}</div>
    <input>
    <span>333</span>
  </div>`
);
