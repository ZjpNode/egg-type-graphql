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
config.graphql = {
  router: '/graphql',
  graphiql: true,
}
```

[example](https://github.com/forsigner/egg-type-graphql/tree/master/example)

## Questions & Suggestions

Please open an issue [here](https://github.com/forsigner/egg-type-graphql/issues).

## License

[MIT](LICENSE)
