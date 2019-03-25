import { join } from 'path'
import { existsSync } from 'fs'
import { find } from 'fs-jetpack'
import { Application } from 'egg'
import { ApolloServer } from 'apollo-server-koa'
import { buildSchema } from 'type-graphql'

interface GraphQLConfig {
  router: string
  graphiql: boolean
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
    const graphqlDir = join(baseDir, 'app', 'graphql')
    const resolvers: any[] = []

    if (!existsSync(graphqlDir)) return []

    // TODO: handle other env
    const matching =
      this.app.config.env === 'local' ? '*resolver.ts' : '*resolver.js'
    const files = find(graphqlDir, { matching })

    try {
      for (const file of files) {
        const resolverPath = join(baseDir, file)
        const resolver = require(resolverPath).default
        resolvers.push(resolver)
      }
    } catch (e) {
      this.app.logger.error('[egg-type-graphql]', JSON.stringify(e))
    }

    return resolvers
  }

  private async getSchema() {
    const resolvers = this.loadResolvers()
    return await buildSchema({
      resolvers,
      dateScalarMode: 'timestamp',
      emitSchemaFile: true,
    })
  }

  async start() {
    const schema = await this.getSchema()
    const server = new ApolloServer({
      schema,
      tracing: false,
      context: ({ ctx }) => ctx,
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      } as any,
      introspection: true,
    })
    server.applyMiddleware({
      app: this.app,
      path: this.graphqlConfig.router,
      cors: false,
    })
    this.app.logger.info('[egg-type-graphql] GraphQL server started')
  }
}
