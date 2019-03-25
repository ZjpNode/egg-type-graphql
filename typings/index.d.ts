import 'egg'
import { EggAppConfig } from 'egg'

declare module 'egg' {
  interface EggAppConfig {
    typeGraphQL: {
      router: string
      graphiql: boolean
    }
  }
}
