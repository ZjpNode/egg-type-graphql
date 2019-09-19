import { Resolver, Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'Object representing cooking recipe' })
export class Recipe {
  @Field({ nullable: true })
  title: string;

  @Field({
    nullable: true,
    description: 'The recipe description with preparation info',
  })
  description?: string;

  @Field({
    nullable: true,
    description: 'created date',
  })
  createdAt: Date;
}
