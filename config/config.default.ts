import { EggAppConfig, PowerPartial } from 'egg'

export default () => {
  const config = {} as PowerPartial<EggAppConfig>

  config.typeGraphQL = {
    router: '/graphql',
    graphiql: true,
    globalMiddlewares: [],
  }

  return config
}
