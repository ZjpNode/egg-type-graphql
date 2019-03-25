# egg-graphql

[graphql](https://graphql.io/#/) plugin for Egg.js.

> NOTE: This plugin supports TypeScript only.

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/@forsigner/egg-graphql.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@forsigner/egg-graphql
[download-image]: https://img.shields.io/npm/dm/@forsigner/egg-graphql.svg?style=flat-square
[download-url]: https://npmjs.org/package/@forsigner/egg-graphql

<!--
Description here.
-->

## Install

```bash
$ yarn add @forsigner/egg-graphql mysql
```

## Usage

### Plugin

```ts
// {app_root}/config/plugin.ts
const plugin: EggPlugin = {
  graphql: {
    enable: true,
    package: '@forsigner/egg-graphql',
  },
}
```

### Configuration

```ts
// {app_root}/config/config.default.ts
config.graphql = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'test',
  password: 'test',
  database: 'test',
  synchronize: true,
  logging: false,
  entities: ['app/entity/**/*.ts'],
  migrations: ['app/migration/**/*.ts'],
  subscribers: ['app/subscriber/**/*.ts'],
}
```

### Create entity files

```bash
├── controller
│   ├── home.ts
│   ├── report.ts
│   └── test-result.ts
├── entity
    ├── Post.ts
    └── User.ts
```

### Entity file

```ts
// app/entity/User.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'graphql'

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string
}

export default User
```

### Invoke model

```ts
// in controller
export default class UserController extends Controller {
  public async index() {
    const { ctx } = this
    ctx.body = await ctx.model.User.find()
  }
}
```

## Example

[example](https://github.com/forsigner/egg-graphql/tree/master/example)

## Questions & Suggestions

Please open an issue [here](https://github.com/forsigner/egg-graphql/issues).

## License

[MIT](LICENSE)
