# egg-type-graphql

[TypeGraphQL](https://typegraphql.ml/) plugin for Egg.js.

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-type-graphql.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-type-graphql
[download-image]: https://img.shields.io/npm/dm/egg-type-graphql.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-type-graphql

<!--
Description here.
-->

## Install

```bash
$ yarn add egg-type-graphql
```

## Usage

### Plugin

```ts
// {app_root}/config/plugin.ts
const plugin: EggPlugin = {
  typeGraphQL: {
    enable: true,
    package: 'egg-type-graphql',
  },
}
```

### Configuration

```ts
// {app_root}/config/config.default.ts
config.typeGraphQL = {
  router: '/graphql',
}
```

### Resovler files

```shell
.
├── controller
│   └── home.ts
├── resolver
│   ├── recipe.ts
│   └── user.ts
└── service
    └── Test.ts
```

### Usage

```ts
// {app_root}/app/resolver/user.ts
import { Resolver, Query } from 'type-graphql'
import { EggResolver } from 'egg-type-graphql'
import { User } from './User.type'

@Resolver(() => User)
export default class UserResolver extends EggResolver {
  @Query(() => [User])
  async report(): Promise<User> {
    return await this.ctx.service.report.getUser()
  }

  @Query(() => [User])
  async reports(): Promise<User[]> {
    return await this.ctx.service.report.queryUsers()
  }
}
```

[example](https://github.com/forsigner/egg-type-graphql/tree/master/example)

## Questions & Suggestions

Please open an issue [here](https://github.com/forsigner/egg-type-graphql/issues).

## License

[MIT](LICENSE)
