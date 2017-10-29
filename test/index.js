const htpl = require('../dist/htpl.common');

const html = htpl(`
<div>
  <h1>Hello, {{ name }}</h1>
  <span h-for="n in list">{{ n }}</span>
</div>
`).render({
  name: 'htpl',
  list: ['扒 Vue 源码', '糊出来的', '模板引擎']
});

console.log(html);
