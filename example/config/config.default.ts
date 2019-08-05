import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg'

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1551875313892_8568'

  config.security = {
    csrf: {
      enable: false,
    },
  }

  config.typeGraphQL = {
    router: '/graphql',
    dateScalarMode: 'isoDate',
    typeDefs: `
      directive @upperCase on FIELD_DEFINITION | FIELD
      directive @dateFormat(format: String) on FIELD_DEFINITION | FIELD
    `,
  }

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  }

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  }
}
