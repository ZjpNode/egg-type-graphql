import 'egg'
import { EggAppConfig } from 'egg'
import { MiddlewareFn } from 'type-graphql'

declare module 'egg' {
  interface EggAppConfig {
    typeGraphQL: {
      router: string
      graphiql: boolean
      globalMiddlewares: MiddlewareFn<any>[]
      typeDefs: string
    }
  }
}
