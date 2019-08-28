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
  dateScalarMode: 'isoDate',
}
```

### Resovler files

```shell
.
├── controller
│   └── home.ts
├── directive
│   ├── dateFormat.ts
│   └── upperCase.ts
├── public
├── recipe
│   ├── resolver
│   │   ├── recipe.resolver.ts
│   │   └── sample.resolver.ts
│   └── type
│       └── notification.ts
├── router.ts
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
  async user(): Promise<User> {
    return await this.ctx.service.user.getUser()
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    return await this.ctx.service.user.queryUser()
  }
}
```

[example](https://github.com/forsigner/egg-type-graphql/tree/master/example)

# Use Directive

In config:

```ts
config.typeGraphQL = {
  router: '/graphql',
  dateScalarMode: 'isoDate',
  typeDefs: `
      directive @upperCase on FIELD_DEFINITION | FIELD
      directive @dateFormat(format: String) on FIELD_DEFINITION | FIELD
    `,
}
```

Create a Directive:

```ts
// app/directive/upperCase.ts
export default async function upperCase({ resolve }) {
  const value = await resolve()
  return value.toString().toUpperCase()
}
```

Create a Directive with args:

```ts
// app/directive/dateFormat.ts
import { format } from 'date-fns'

const dateFormat = async ({ resolve, args }) => {
  const value = await resolve()

  if (value instanceof Date) {
    return format(value, args.format)
  }

  return format(new Date(value), args.format)
}

export default dateFormat
```

## Questions & Suggestions

Please open an issue [here](https://github.com/forsigner/egg-type-graphql/issues).

## License

[MIT](LICENSE)
