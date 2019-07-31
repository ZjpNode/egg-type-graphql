import { Resolver, Query, Field, ObjectType } from 'type-graphql'
import { EggResolver } from '../../lib/EggResolver'

@ObjectType({ description: 'Object representing cooking recipe' })
export class Recipe {
  @Field({ nullable: true })
  title: string

  @Field({
    nullable: true,
    description: 'The recipe description with preparation info',
  })
  description?: string
}

@Resolver(() => Recipe)
export default class RecipeResolver extends EggResolver {
  @Query(() => Recipe, { nullable: true })
  async recipe(): Promise<Recipe> {
    return {
      title: 'hello~',
      description: 'desc...',
    }
  }
}
