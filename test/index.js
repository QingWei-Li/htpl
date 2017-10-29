var htpl = require('../dist/htpl.common');

const a = htpl(
  `<div>
    <div h-for="n in list">
      <span>'111'{{ n }}</span>
    </div>
    <input>
    <span>333</span>
  </div>`
);

console.log(a.render({ list: 6 }));
