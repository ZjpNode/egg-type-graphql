import 'reflect-metadata'
import { Application } from 'egg'
import GraphQLServer from './lib/GraphQLServer'

export default async (app: Application) => {
  app.beforeStart(async () => {
    const graphQLServer = new GraphQLServer(app)
    graphQLServer.start()
  })
}
