import { Resolver, Query, Field, ObjectType } from 'type-graphql'
import { EggResolver } from '../../lib/EggResolver'

@ObjectType({ description: 'Object representing cooking recipe' })
export class User {
  @Field({ nullable: true })
  name: string

  @Field({
    nullable: true,
  })
  email: string
}

@ObjectType({ description: 'Object representing cooking recipe' })
export class Recipe {
  @Field({ nullable: true })
  title: string

  @Field({
    nullable: true,
    description: 'The recipe description with preparation info',
  })
  description?: string

  @Field({
    nullable: true,
    description: 'created date',
  })
  createdAt: Date

  @Field(() => User)
  user: User


}

@Resolver(() => Recipe)
export default class RecipeResolver extends EggResolver {
  @Query(() => Recipe, { nullable: true })
  async recipe(): Promise<Recipe> {
    return {
      title: 'hello~',
      description: 'desc...',
      createdAt: new Date(),
      user: {
        name: 'forsigner',
        email: 'hello@qq.com'
      }
    }
  }
}
