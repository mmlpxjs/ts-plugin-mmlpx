# ts-plugin-mmlpx
🤖Generate mmlpx ViewModel/Store name automatically, also suit for mobx actions

[![npm version](https://img.shields.io/npm/v/ts-plugin-mmlpx.svg?style=flat-square)](https://www.npmjs.com/package/ts-plugin-mmlpx)
[![coverage](https://img.shields.io/codecov/c/github/mmlpx/ts-plugin-mmlpx.svg?style=flat-square)](https://codecov.io/gh/mmlpx/ts-plugin-mmlpx)
[![npm downloads](https://img.shields.io/npm/dt/ts-plugin-mmlpx.svg?style=flat-square)](https://www.npmjs.com/package/ts-plugin-mmlpx)
[![Build Status](https://img.shields.io/travis/mmlpx/ts-plugin-mmlpx.svg?style=flat-square)](https://travis-ci.org/mmlpx/ts-plugin-mmlpx)

input
```ts
import { Store } from 'mmlpx';

@Store
export default class Store {
}
```

output
```ts
import { Store } from 'mmlpx';

@Store('${filePath}/Store')
export default class Store {
}
```


