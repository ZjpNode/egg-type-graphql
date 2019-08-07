import 'reflect-metadata'
import { Application } from 'egg'
import GraphQLServer from './lib/GraphQLServer'

export default async (app: Application) => {
  app.on('server', (server: any) => {
    const graphQLServer = new GraphQLServer(app, server)
    graphQLServer.start()
  })
}
