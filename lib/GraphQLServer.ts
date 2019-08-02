import { join } from 'path'
import { existsSync } from 'fs'
import { find } from 'fs-jetpack'
import { Application } from 'egg'
import { ApolloServer, Config } from 'apollo-server-koa'
import { buildSchema, ResolverData, MiddlewareFn } from 'type-graphql'

interface GraphQLConfig {
  router: string
  globalMiddlewares?: MiddlewareFn<any>[]
  schemaDirectives?: any
}

class CustomContainer {
  instances: any[] = []
  constructor() {
    this.instances = []
  }
  get(someClass: any, resolverData: ResolverData) {
    let instance = this.instances.find(it => it.type === someClass)
    if (!instance) {
      instance = {
        type: someClass,
        object: new someClass(resolverData),
      }
      this.instances.push(instance)
    }
    return instance.object
  }
}

export default class GraphQLServer {
  private readonly app: Application
  private graphqlConfig: GraphQLConfig

  constructor(app: Application) {
    this.app = app
    this.graphqlConfig = app.config.typeGraphQL
  }

  private loadResolvers() {
    const { baseDir } = this.app
    const graphqlDir = join(baseDir, 'app', 'resolver')
    const resolvers: any[] = []

    if (!existsSync(graphqlDir)) {
      this.app.logger.warn('[egg-type-graphql]', '缺少 resolver 文件')
      return []
    }

    // TODO: handle other env
    const matching = this.app.config.env === 'local' ? '*.ts' : '*.js'
    const files = find(graphqlDir, { matching })
    if (!files.length) {
      this.app.logger.error('[egg-type-graphql]', '缺少 resolver')
      return []
    }

    try {
      for (const file of files) {
        const resolverPath = join(baseDir, file)
        const resolver = require(resolverPath).default
        resolvers.push(resolver)
      }
    } catch (e) {
      this.app.logger.error('[egg-type-graphql]', e)
    }

    return resolvers
  }

  private async getSchema() {
    const resolvers = this.loadResolvers()
    if (!resolvers.length) {
      return null
    }
    try {
      return await buildSchema({
        resolvers,
        dateScalarMode: 'timestamp',
        emitSchemaFile: true,
        globalMiddlewares: this.graphqlConfig.globalMiddlewares || [],
        container: () => new CustomContainer(),
      })
    } catch (e) {
      this.app.logger.error('[egg-type-graphql]', e)
    }
  }

  async start() {
    const schema = await this.getSchema()
    if (!schema) return null
    const apolloConfig: Config = {
      schema,
      tracing: false,
      context: ({ ctx }) => ctx,
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      } as any,
      introspection: true,
    }
    const { schemaDirectives } = this.graphqlConfig
    if (schemaDirectives) {
      apolloConfig.schemaDirectives = schemaDirectives
    }

    const server = new ApolloServer(apolloConfig)
    server.applyMiddleware({
      app: this.app,
      path: this.graphqlConfig.router,
      cors: false,
    })
    this.app.logger.info('[egg-type-graphql] GraphQL server started')
  }
}
