import {
  defaultFieldResolver,
  GraphQLField,
  getNamedType,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLFieldResolver,
  DirectiveNode,
} from 'graphql'
import * as graphqlLanguage from 'graphql/language'
import * as graphqlType from 'graphql/type'
import { getDirectiveValues } from 'graphql/execution'

const DirectiveLocation =
  graphqlLanguage.DirectiveLocation || graphqlType.__DirectiveLocation

const BUILT_IN_DIRECTIVES = ['deprecated', 'skip', 'include']

type FieldIteratorFn = (
  fieldDef: GraphQLField<any, any>,
  typeName: string,
  fieldName: string,
) => void

interface ResolverMap {
  // [key: string]: Promise<any>
  [key: string]: any
}

function forEachField(schema: GraphQLSchema, fn: FieldIteratorFn): void {
  const typeMap = schema.getTypeMap()

  Object.keys(typeMap).forEach(typeName => {
    const type = typeMap[typeName]

    // TODO: maybe have an option to include these?
    if (
      !getNamedType(type).name.startsWith('__') &&
      type instanceof GraphQLObjectType
    ) {
      const fields = type.getFields()
      Object.keys(fields).forEach(fieldName => {
        const field = fields[fieldName]
        fn(field, typeName, fieldName)
      })
    }
  })
}

function getFieldResolver(field) {
  const resolver = field.resolve || defaultFieldResolver
  return resolver.bind(field)
}

function createAsyncResolver(field) {
  const originalResolver = getFieldResolver(field)
  const resolverFn: GraphQLFieldResolver<any, any> = async (
    source,
    args,
    context,
    info,
  ) => originalResolver(source, args, context, info)
  return resolverFn
}

function getDirectiveInfo(
  directive: DirectiveNode,
  resolverMap: ResolverMap,
  schema: GraphQLSchema,
  location: any,
  variables?: any,
) {
  const name = directive.name.value

  const Directive = schema.getDirective(name)

  if (typeof Directive === 'undefined') {
    throw new Error(
      `Directive @${name} is undefined. ` +
        'Please define in schema before using.',
    )
  }

  if (!Directive || !Directive.locations.includes(location)) {
    throw new Error(
      `Directive @${name} is not marked to be used on "${location}" location. ` +
        `Please add "directive @${name} ON ${location}" in schema.`,
    )
  }

  const resolver = resolverMap[name]
  if (!resolver && !BUILT_IN_DIRECTIVES.includes(name)) {
    throw new Error(
      `Directive @${name} has no resolver.` +
        'Please define one using createFieldExecutionResolver().',
    )
  }

  const args =
    getDirectiveValues(Directive, { directives: [directive] }, variables) || {}
  return { args, resolver }
}

function createFieldExecutionResolver(
  field: GraphQLField<any, any>,
  resolverMap: ResolverMap,
  schema: GraphQLSchema,
) {
  if (!field.astNode) return getFieldResolver(field)
  const { directives } = field.astNode
  if (!directives || !directives.length) return getFieldResolver(field)
  return directives.reduce((prevResolver, directive) => {
    const directiveInfo = getDirectiveInfo(
      directive,
      resolverMap,
      schema,
      DirectiveLocation.FIELD_DEFINITION,
    )
    const resolverFn: GraphQLFieldResolver<any, any> = (
      source,
      args,
      context,
      info,
    ) =>
      directiveInfo.resolver(
        () => prevResolver(source, args, context, info),
        source,
        directiveInfo.args,
        context,
        info,
      )
    return resolverFn
  }, createAsyncResolver(field))
}

function createFieldResolver(
  field: GraphQLField<any, any>,
  resolverMap: ResolverMap,
  schema: GraphQLSchema,
) {
  const originalResolver = getFieldResolver(field)
  const asyncResolver = createAsyncResolver(field)

  const resolverFn: GraphQLFieldResolver<any, any> = (
    source,
    args,
    context,
    info,
  ) => {
    const { directives } = info.fieldNodes[0]

    if (!directives || !directives.length) {
      return originalResolver(source, args, context, info)
    }

    const fieldResolver = directives.reduce((prevResolver, directive) => {
      const directiveInfo = getDirectiveInfo(
        directive,
        resolverMap,
        schema,
        DirectiveLocation.FIELD,
        info.variableValues,
      )

      const value = () =>
        directiveInfo.resolver(
          () => prevResolver(source, args, context, info),
          source,
          directiveInfo.args,
          context,
          info,
        )
      return () => value()
    }, asyncResolver)

    return fieldResolver(source, args, context, info)
  }
  return resolverFn
}

function addDirectiveResolveFunctionsToSchema(
  schema: GraphQLSchema,
  resolverMap: ResolverMap,
) {
  if (typeof resolverMap !== 'object') {
    throw new Error(
      `Expected resolverMap to be of type object, got ${typeof resolverMap}`,
    )
  }

  if (Array.isArray(resolverMap)) {
    throw new Error('Expected resolverMap to be of type object, got Array')
  }

  forEachField(schema, field => {
    field.resolve = createFieldExecutionResolver(field, resolverMap, schema)
    field.resolve = createFieldResolver(field, resolverMap, schema)
  })
  return schema
}

export default addDirectiveResolveFunctionsToSchema
