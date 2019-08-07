import { join, basename } from 'path'
import { existsSync } from 'fs'
import { find } from 'fs-jetpack'
import { Application } from 'egg'
import { ApolloServer, Config } from 'apollo-server-koa'
import { buildSchema, ResolverData, MiddlewareFn } from 'type-graphql'
import { extendSchema, parse, GraphQLSchema, GraphQLScalarType } from 'graphql'

import { GraphQLISODateTime } from './scalars/isodate'
import { GraphQLTimestamp } from './scalars/timestamp'
import addDirective from './addDirective'

interface scalarsMapItem {
  type: any
  scalar: GraphQLScalarType
}

interface GraphQLConfig {
  router: string
  globalMiddlewares?: MiddlewareFn<any>[]
  scalarsMap?: scalarsMapItem[]
  dateScalarMode?: 'isoDate' | 'timestamp'
  typeDefs?: string
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
  readonly app: Application
  graphqlConfig: GraphQLConfig
  koaServer: any

  constructor(app: Application, server: any) {
    this.app = app
    this.koaServer = server
    this.graphqlConfig = app.config.typeGraphQL
  }

  getDirectives() {
    const { baseDir } = this.app
    const directivesDir = join(baseDir, 'app', 'directive')
    if (!existsSync(directivesDir)) return {}

    const matching = this.app.config.env === 'local' ? '*.ts' : '*.js'
    const files = find(directivesDir, { matching })
    return files.reduce(
      (prev, cur) => {
        const directivePath = join(baseDir, cur)
        const name = basename(directivePath).replace(/(.ts)|(.js)$/, '')
        return {
          ...prev,
          [name]: require(directivePath).default,
        }
      },
      {} as any,
    )
  }

  loadResolvers() {
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

  setDirective(schema: GraphQLSchema) {
    const { typeDefs } = this.graphqlConfig
    if (typeDefs) {
      schema = extendSchema(schema, parse(typeDefs))
    }
    const resolverMap = this.getDirectives()
    if (Object.keys(resolverMap).length) {
      return addDirective(schema, resolverMap || {})
    }
    return schema
  }

  async getSchema() {
    const { scalarsMap = [], dateScalarMode } = this.graphqlConfig
    let schema: GraphQLSchema
    const resolvers = this.loadResolvers()
    if (!resolvers.length) return null
    const defaultScalarMap = [
      {
        type: Date,
        scalar:
          dateScalarMode === 'timestamp'
            ? GraphQLTimestamp
            : GraphQLISODateTime,
      },
    ]

    try {
      schema = await buildSchema({
        resolvers,
        dateScalarMode: 'isoDate',
        scalarsMap: [...defaultScalarMap, ...scalarsMap],
        emitSchemaFile: true,
        globalMiddlewares: this.graphqlConfig.globalMiddlewares || [],
        container: () => new CustomContainer(),
      })

      return this.setDirective(schema)
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
    const server = new ApolloServer(apolloConfig)

    server.applyMiddleware({
      app: this.app,
      path: this.graphqlConfig.router,
      cors: false,
    })
    server.installSubscriptionHandlers(this.koaServer)

    this.app.logger.info('[egg-type-graphql] GraphQL server started')
  }
}
