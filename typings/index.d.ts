import 'egg'
import { EggAppConfig } from 'egg'
import { MiddlewareFn } from 'type-graphql'
import { GraphQLScalarType } from 'graphql'

interface scalarsMapItem {
  type: any
  scalar: GraphQLScalarType
}

declare module 'egg' {
  interface EggAppConfig {
    typeGraphQL: {
      router: string
      globalMiddlewares?: MiddlewareFn<any>[]
      scalarsMap?: scalarsMapItem[]
      dateScalarMode?: 'isoDate' | 'timestamp'
      typeDefs?: string
    }
  }
}
