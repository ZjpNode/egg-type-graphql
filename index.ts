import { GraphQLResolveInfo } from 'graphql'

export interface DirectiveResolveParams<
  TSource = any,
  TContext = any,
  TArgs = { [argName: string]: any }
> {
  resolve: () => any
  source: TSource
  args: TArgs
  context: TContext
  info: GraphQLResolveInfo
}
