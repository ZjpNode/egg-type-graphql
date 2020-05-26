# egg-type-graphql

[TypeGraphQL](https://typegraphql.ml/) plugin for Egg.js.

<!-- 
  [![NPM version][npm-image]][npm-url]
  [![npm download][download-image]][download-url]

  [npm-image]: https://img.shields.io/npm/v/egg-type-graphql.svg?style=flat-square
  [npm-url]: https://npmjs.org/package/egg-type-graphql
  [download-image]: https://img.shields.io/npm/dm/egg-type-graphql.svg?style=flat-square
  [download-url]: https://npmjs.org/package/egg-type-graphql 
-->

<!--
Description here.
-->

## Install

```bash
$ npm i egg-type-graphql
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
  dirPath: 'graphql'
  router: '/graphql',
  dateScalarMode: 'isoDate',
}
```

### Resovler files

```shell
├── controller
│   └── home.ts
├── {dirPath}(graphql)
│   ├── app
│   │   │── recipe
│   │   │   │── recipe.resolver.ts
│   │   │   │── recipe.service.ts
│   │   │   └── recipe.type.ts
│   │   └── sample
│   │       │── sample.resolver.ts
│   │       │── sample.service.ts
│   │       └── sample.type.ts
│   ├── decorators
│   ├── directive
│   │   ├── dateFormat.ts
│   │   └── upperCase.ts
│   └── middle_wares
├── router.ts
└── service
    └── Test.ts
```

### Usage

```ts
// service

import { Service } from 'typedi';

@Service()
export class UserService {
  getUser() {
    // TODO
  }

  queryUser() {
    // TODO
  }
}

```


```ts
// {app_root}/app/{dirPath}/app/resolver/user.ts
import { Resolver, Query } from 'type-graphql'
import { User } from './User.type'

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => [User])
  async user(): Promise<User> {
    return await this.userService.getUser()
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    return await this.userService.queryUser()
  }
}
```

[example](https://github.com/ZjpNode/egg-type-graphql/tree/master/example)

# Use Directive

In config:

```ts
config.typeGraphQL = {
  dirPath: 'graphql',
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
// {app_root}/app/{dirPath}/directive/upperCase.ts
export default async function upperCase({ resolve }) {
  const value = await resolve()
  return value.toString().toUpperCase()
}
```

Create a Directive with args:

```ts
// {app_root}/app/{dirPath}/directive/dateFormat.ts
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

Please open an issue [here](https://github.com/ZjpNode/egg-type-graphql/issues).

## License

[MIT](LICENSE)
