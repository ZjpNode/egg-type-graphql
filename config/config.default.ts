import { EggAppConfig, PowerPartial } from 'egg'

export default () => {
  const config = {} as PowerPartial<EggAppConfig>

  config.typeGraphQL = {
    router: '/graphql',
    globalMiddlewares: [],
  }

  return config
}
