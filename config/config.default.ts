import { EggAppConfig, PowerPartial } from 'egg'

export default () => {
  const config = {} as PowerPartial<EggAppConfig>

  config.typeGraphQL = {
    dirPath: 'graphql',
    router: '/graphql',
    validate: true,
    globalMiddlewares: [],
  }

  return config
}
