# ts-plugin-mmlpx

[![npm version](https://img.shields.io/npm/v/ts-plugin-mmlpx.svg?style=flat-square)](https://www.npmjs.com/package/ts-plugin-mmlpx)
[![coverage](https://img.shields.io/codecov/c/github/mmlpxjs/ts-plugin-mmlpx.svg?style=flat-square)](https://codecov.io/gh/mmlpxjs/ts-plugin-mmlpx)
[![npm downloads](https://img.shields.io/npm/dt/ts-plugin-mmlpx.svg?style=flat-square)](https://www.npmjs.com/package/ts-plugin-mmlpx)
[![Build Status](https://img.shields.io/travis/mmlpxjs/ts-plugin-mmlpx.svg?style=flat-square)](https://travis-ci.org/mmlpxjs/ts-plugin-mmlpx)

Generate mmlpx `Store` name automatically, suitable for mobx actions as well. 
Compatible with ts-loader(^2.2.0) and awesome-typescript-loader(^3.1.3).

## Transpilation

input
```ts
import { Store } from 'mmlpx';

@Store
export default class UserStore {
}
```

output
```ts
import { Store } from 'mmlpx';

@Store('${filePath}/UserStore')
export default class UserStore {
}
```

## Configuration
```js
const createMmlpxTransformer  = require('ts-plugin-mmlpx').default;
var config = {
	
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                    compilerOptions: {
                        module: 'es2015'
                    },
                    getCustomTransformers: () => ({
                        before: [
                            // transform Store/ViewModel of mmlpx by default
                            createMmlpxTransformer(),
                            // manual config mobx action
                            // createMmlpxTransformer([
                            //    { libraryName: 'mobx', bindings: ['action'] }
                            // ]),
                        ]
                    })
                }
            }
        ]
    }
}
```

## API

### createTransformer

```ts
const defaultOptions = {
    libraryName: 'mmlpx',
    bindings: ['Store', 'ViewModel'],
};
function createTransformer(options: Array<Partial<Options>> = [defaultOptions]): ts.TransformerFactory<ts.SourceFile>
```

### Options

```ts
type Options = {
    libraryName?: string;
    bindings?: string[];
};
```

## Notes

As we use `${fileName}/${decoratedClassName}` as the id of configured bindings, we should name our Store/ViewModel and file name more descriptive, such as UserStore.ts/UserStore.

Avoid naming file name as index.ts and Store/ViewModel as Index class like index.ts/Index after transpilation, make sure they're unique.
