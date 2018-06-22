# ts-plugin-mmlpx
🤖Generate mmlpx ViewModel/Store name automatically, also suit for mobx actions

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


